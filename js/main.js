var main = function(games, teams) {
    var quarterNames = {
        1: "1st",
        2: "2nd",
        3: "3rd",
        4: "4th"
    };

    var mainVM = {};

    mainVM.teamPath = "../team/";

    mainVM.scoringFeed = ko.computed(function() {
        return _.chain(games())
            .map(function(game) {
                return game.scoringPlays();
            })
            .flatten()
            .sortBy(function(play) {
                return -1 * play.time;
            })
            .first(8)
            .value();
    })

    mainVM.gamesInProgress = ko.computed(function() {
        return _.select(games(), function(game) {
            return !game.completed() && game.plays().count !== 0;
        });
    })

    mainVM.upcomingGames = ko.computed(function() {
        return _.select(games(), function(game) {
            return !game.completed() && game.plays().count === 0;
        });
    })

    mainVM.finishedGames = ko.computed(function() {
        return _.select(games(), function(game) {
            return game.completed();
        });
    })

    mainVM.headlines = ko.computed(function() {
        return _.chain(games())
            .select(function(game) {
                return !!game.headline();
            })
            .map(function(game) {
                return {
                    headline: game.headline(),
                    home: game.teams.home,
                    away: game.teams.away,
                    gameId: game.gameId
                }
            })
            .compact()
            .value()
    })

    mainVM.clock = function(clock) {
        if (_.isUndefined(clock)) {
            return "0:00";
        }
        var seconds = Math.floor(clock % 60).toString();
        if (seconds.length < 2) {
            seconds = "0".concat(seconds);
        }
        var minutes = Math.floor((clock / 60))
        if (_.isNaN(minutes)) {
            minutes = "0";
        }
        return minutes + ":" + seconds;
    }


    mainVM.getQuarterName = function(quarter) {
        if (quarter < 5) {
            return quarterNames[quarter];
        }

        return "OT " + (quarter - 4);
    }

    mainVM.topPassers = ko.computed(function() {
        return _.chain(games())
            .map(function(game) {
                return game.topPasserData();
            })
            .flatten()
            .compact()
            .sortBy(function(player) {
                return -1 * player.player.points
            })
            .first(5)
            .map(function(player) {
                return {
                    player: player.player.player,
                    gameId: player.gameId
                }
            })
            .value()
    });

    mainVM.topRushers = ko.computed(function() {
        return _.chain(games())
            .map(function(game) {
                return game.topRusherData();
            })
            .flatten()
            .compact()
            .sortBy(function(player) {
                return -1 * player.player.points
            })
            .first(5)
            .map(function(player) {
                return {
                    player: player.player.player,
                    gameId: player.gameId
                }
            })
            .value()
    });

    mainVM.topReceivers = ko.computed(function() {
        return _.chain(games())
            .map(function(game) {
                return game.topReceiverData();
            })
            .flatten()
            .compact()
            .sortBy(function(player) {
                return -1 * player.player.points
            })
            .first(5)
            .map(function(player) {
                return {
                    player: player.player.player,
                    gameId: player.gameId
                }
            })
            .value()
    });

    mainVM.teamsByWins = ko.computed(function() {
        return _.chain(teams())
            .sortBy(function(team) {
                return team.ranking;
            })
            .sortBy(function(team) {
                return team.record.losses;
            })
            .map(function(team) {
                var ranking;
                if (team.ranking < 26) {
                    ranking = '#' + team.ranking;
                } else {
                    ranking = "";
                }

                return {
                    id: team.id,
                    name: team.institution.name,
                    wins: team.record.wins,
                    ranking: ranking,
                    losses: team.record.losses,
                    skill: team.skill,
                    defSkill: team.defSkill

                }
            })
            .value()
    });
    return mainVM;
}
