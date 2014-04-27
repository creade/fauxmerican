$(document).ready(function () {
    viewModel = function () {
        vm = {};
        vm.teams = ko.observableArray();


        vm.games = ko.observableArray();
        vm.teamsByWins = ko.observableArray();


        vm.completedGames = ko.observableArray();
        vm.upcomingGames = ko.observableArray();
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

        vm.gamesForCurrentWeek = ko.computed(function(){
        	return _.select(vm.games(), function(match){
        		return match.week === viewModel.currentWeek();
        	});
        })



        vm.loadGame = function (vm) {
            var gameId = arguments[1].currentId;
            vm(_.find(viewModel.games(), function (game) {
                return game.gameId.toString() === gameId;
            }));
        };

        vm.loadTeam = function (vm) {
            vm(viewModel.teams()[arguments[1].currentId]);
        };
        vm.currentWeek = ko.observable(0);
        vm.thisWeek = ko.observable(8);

        vm.formatLocalDate = function(tzMoment){
        	return moment(tzMoment.valueOf()).format('dddd, MMMM Do YYYY, h:mm A')
        }

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

        var schedule = genball.generators.schedule().scheduleConcurrent(95);

        _.times(10, function () {
            viewModel.teams.push(team(teamGenerator.newTeam()));
        });



        _.each(schedule, function (match) {
            var homeTeam =viewModel.teams()[match.teams[0]];
            var awayTeam =viewModel.teams()[match.teams[1]];
            var gameToAdd = game(genball.generators.game(
            	playData[0], kickdata[0], homeTeam, awayTeam,
                match.id, match.time, seed + match.id, match.week, false));

            viewModel.games.push(gameToAdd);
            viewModel.upcomingGames.push(gameToAdd);
            homeTeam.games.push(gameToAdd);
            awayTeam.games.push(gameToAdd);

        });


		
 		_.each(viewModel.upcomingGames(), function (match) {
            match.playUntil(new Date().getTime());
              if (match.completed()) {

        	}
        });


        setInterval(function () {
 			_.each(viewModel.upcomingGames(), function (match) {
            	match.playUntil(new Date().getTime());
              	if (match.completed()) {
                    viewModel.completedGames.push(match);
                    viewModel.upcomingGames.remove(match);
        		}
        	});
        }, 5000)

        pager.Href.hash = '#!/' + seed + "/";
        pager.extendWithPage(viewModel);
        ko.applyBindings(viewModel);
        pager.start();
    })
});