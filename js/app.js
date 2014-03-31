$(document).ready(function () {
    viewModel = function () {
        vm = {};
        vm.teams = ko.observableArray();


        vm.games = ko.observableArray();
        vm.teamsByWins = ko.observableArray();

        vm.completedGames = ko.observableArray();
        vm.weeks = ko.observableArray();

        vm.completedGames.subscribe(function(){
			viewModel.teamsByWins(
				_.chain(vm.teams())
				.sortBy(function(team){
					return team.record.losses;
				})
				.map(function(team){
					return {
						id: team.id,
						name: team.institution.name,
						wins: team.record.wins,
						losses: team.record.losses,
						skill: team.skill
					}
				})
				.value()
			);
        });



        vm.loadGame = function (vm) {
            var gameId = arguments[1].currentId;
            vm(_.find(viewModel.games(), function (game) {
                return game.gameId.toString() === gameId;
            }));
        };

        vm.loadTeam = function (vm) {
            vm(team(viewModel.teams()[arguments[1].currentId]));
        };
        vm.currentWeek = ko.observable(0);
        vm.thisWeek = ko.observable(8);
        return vm;
    }();



    $.when(
        $.getJSON("js/data/data.json"),
        $.getJSON("js/data/first_names.json"),
        $.getJSON("js/data/last_names.json"),
        $.getJSON("js/data/play_by_q.json"),
        $.getJSON("js/data/kickdata.json"),
        $.getJSON("js/data/xpm_skill.json"),
        $.getJSON("img/logos.json")
    ).done(function (data, firstNames, lastNames, playData, kickdata, xpmSkill, logos) {

        var teamGenerator = genball.generators.teams(data, firstNames, lastNames, xpmSkill, logos);
        var seed;
        if (window.location.hash.split("/")[1]) {
            seed = window.location.hash.split("/")[1];
        } else {
            seed = Math.random().toString(36).substring(7);
            window.location.hash = '#!/' + seed + "/";
        }
        console.log("SEED: " + seed)
        Math.seedrandom(seed);

        var schedule = genball.generators.schedule().schedule();

        _.times(10, function () {
            viewModel.teams.push(teamGenerator.newTeam())
        });

        _.each(schedule, function (week) {
            var matches = _.map(week, function (matchup) {
                var gameToAdd = game(genball.generators.game(
                    playData[0], kickdata[0], viewModel.teams()[matchup.teams[0]],
                    viewModel.teams()[matchup.teams[1]], matchup.id, new Date().setDate(24), seed + matchup.id, false));
                viewModel.games.push(gameToAdd);
                return gameToAdd;
            })
            viewModel.weeks.push(matches);
        });

        _.chain(_.range(0, viewModel.thisWeek()))
            .map(function (weekNumber) {
                return viewModel.weeks()[weekNumber];
            })
            .each(function (matches) {
                _.each(matches, function (game) {
                    game.playUntil(new Date().getTime());
                    viewModel.completedGames.push(game);
                })
            });



        setInterval(function () {
        	if(viewModel.games().length !== viewModel.completedGames().length){
	            _.each(viewModel.weeks()[viewModel.thisWeek()], function (game) {
	                game.playUntil(new Date().getTime());
	                if (game.completed()) {
	                    viewModel.completedGames.push(game);
                	}
            	})
        	}
        }, 1000, true)

        pager.Href.hash = '#!/' + seed + "/";
        pager.extendWithPage(viewModel);
        ko.applyBindings(viewModel);
        pager.start();
    })
});