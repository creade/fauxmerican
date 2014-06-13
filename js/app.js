$(document).ready(function() {
    viewModel = function() {
        vm = {};
        vm.teams = ko.observableArray();


        vm.games = ko.observableArray();
        vm.teamsByWins = ko.observableArray();


        vm.upcomingGames = ko.observableArray();
        vm.weeks = ko.observableArray();
        vm.teamPath = "../team/";


        vm.gamesForCurrentWeek = ko.computed(function() {
            return _.select(vm.games(), function(match) {
                return match.week === viewModel.currentWeek();
            });
        })



        vm.loadGame = function(vm) {
            var gameId = arguments[1].currentId;
            vm(_.find(viewModel.games(), function(game) {
                return game.gameId.toString() === gameId;
            }));
        };

        vm.loadTeam = function(vm) {
            vm(viewModel.teams()[arguments[1].currentId]);
        };

        vm.loadStats = function(vm) {
            vm(stats(viewModel.teams()));
        };

        vm.loadStandings = function(vm) {
            vm(standings(viewModel.teams()));
        }

        vm.currentWeek = ko.observable(0);
        vm.thisWeek = ko.observable(8);

        vm.formatLocalDate = function(tzMoment) {
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
    ).done(function(data, firstNames, lastNames, playData, kickdata, xpmSkill, logos) {

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

        var schedule = genball.generators.schedule().schedule(6);
        var eventSchedule = genball.generators.schedule().scheduleEvents(6);

        _.times(10, function() {
            viewModel.teams.push(team(teamGenerator.newTeam()));
        });



        _.each(schedule, function(match) {
            var homeTeam = viewModel.teams()[match.teams[0]];
            var awayTeam = viewModel.teams()[match.teams[1]];
            var gameToAdd = game(genball.generators.game(
                playData[0], kickdata[0], homeTeam, awayTeam,
                match.id, match.time, seed + match.id, match.week, false));

            viewModel.games.push(gameToAdd);
            viewModel.upcomingGames.push(gameToAdd);
            homeTeam.games.push(gameToAdd);
            awayTeam.games.push(gameToAdd);
        });

        _.each(eventSchedule, function(evnt) {
            viewModel.upcomingGames.push(evnt);
        });

        viewModel.upcomingGames.sort(function(left, right) {
            return left.startTime.isSame(right.startTime) ? 0 : (left.startTime.isBefore(right.startTime) ? -1 : 1)
        })


        _.each(viewModel.upcomingGames(), function(match) {
            if (match.startTime.isBefore(new Date().getTime())) {
                match.action(viewModel.teams());
            }
        });


        setInterval(function() {
            _.each(viewModel.upcomingGames(), function(match) {
                if (!match.completed && match.startTime.isBefore(new Date().getTime())) {
                    match.action(viewModel.teams());
                    if (match.completed()) {
                        viewModel.upcomingGames.remove(match);
                    }
                }
            });
        }, 5000)

        pager.Href.hash = '#!/' + seed + "/";
        pager.extendWithPage(viewModel);
        ko.applyBindings(viewModel);
        pager.start();
    })
});
