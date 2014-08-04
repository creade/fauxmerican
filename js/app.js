$(document).ready(function() {
    viewModel = function() {
        vm = {};
        vm.teams = ko.observableArray();
        vm.otherTeams = ko.observableArray();


        vm.games = ko.observableArray();
        vm.teamsByWins = ko.observableArray();


        vm.upcomingGames = ko.observableArray();
        vm.bowlGames = ko.observableArray();
        vm.weeks = ko.observableArray(_.range(0, 9));
        vm.teamPath = "../team/";


        vm.gamesForCurrentWeek = ko.computed(function() {
            return _.select(vm.games(), function(match) {
                return match.week === viewModel.currentWeek();
            });
        });

        vm.gameTemplate = function(game) {
            return game.startTime > new Date().getTime() ? 'preview-template' : "score-template";
        }

        vm.logo = function(logo, size, klass) {
            if (klass) {
                return '<svg class="'+klass+'" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" width="'+size+'" height="'+size+'">' + logo + "</svg>"
            }
            return '<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" width="'+size+'" height="'+size+'">' + logo + "</svg>"
        }


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
        $.getJSON("js/data/play_by_q_and_dn.json"),
        $.getJSON("js/data/kickdata.json"),
        $.getJSON("img/logos.json")
    ).done(function(data, firstNames, lastNames, playData, kickdata, logos) {
        var lastNameGenerator = genball.generators.lastNameGenerator(lastNames);
        var firstNameGenerator = genball.generators.firstNameGenerator(firstNames);
        var teamGenerator = genball.generators.teams(data, firstNameGenerator, lastNameGenerator, logos);
        var gameNameGenerator = genball.generators.gameName(firstNameGenerator, lastNameGenerator);
        var seed;
        var startWeek;
        if (window.location.hash.split("/")[1]) {
            seed = window.location.hash.split("/")[1];
            startWeek = parseInt(seed.split("-")[1]);
        } else {
            startWeek = 1;
            seed = Math.random().toString(36).substring(7) + "-" + startWeek;
            window.location.hash = '#!/' + seed + "/";

        }
        console.log("SEED: " + seed)
        Math.seedrandom(seed);

        var schedule = genball.generators.schedule().schedule(startWeek);
        var eventSchedule = genball.generators.schedule().scheduleEvents(startWeek);
        var bowlSchedule = genball.generators.schedule().bowlSchedule(startWeek);

        _.times(10, function() {
            viewModel.teams.push(team(teamGenerator.newTeam(false)));
        });

        _.times(6, function(index) {
            var matchId = 100 + index;
            var bowlOpponent = team(teamGenerator.newTeam(true));
            viewModel.otherTeams.push(bowlOpponent);
            var gameToAdd = genball.generators.bowlGame(
                playData[0], kickdata[0], bowlOpponent,
                matchId, bowlSchedule[index], seed + matchId, gameNameGenerator.nextBowlName(), false);

            viewModel.bowlGames.push(gameToAdd);
        });



        _.each(schedule, function(match) {
            var homeTeam = viewModel.teams()[match.teams[0]];
            var awayTeam = viewModel.teams()[match.teams[1]];
            var name = "";
            if(Math.random()<.1 && gameNameGenerator.rivalryGamesLeft()){
                name = gameNameGenerator.nextRivalryGame();
            }

            var gameToAdd = game(genball.generators.game(
                playData[0], kickdata[0], homeTeam, awayTeam,
                match.id, match.time, seed + match.id, match.week, name, false));

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
                match.action(viewModel);
            }
        });

        _.each(viewModel.upcomingGames(), function(match) {
            if (match.startTime.isBefore(new Date().getTime()) && !match.completed()) {
                match.action(viewModel);
            }
        });

        setInterval(function() {
            _.each(viewModel.upcomingGames(), function(match) {
                if (!match.completed() && match.startTime.isBefore(new Date().getTime())) {
                    match.action(viewModel);
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
        $("#load-screen").remove();
    })
});
