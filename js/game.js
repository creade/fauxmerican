var game = function(data) {
    var quarterNames = {
        1: "1st",
        2: "2nd",
        3: "3rd",
        4: "4th"
    };

    data.action = function() {
        data.playUntil(new Date().getTime());
    }

    data.getQuarterName = function(quarter) {
        if (quarter < 5) {
            return quarterNames[quarter];
        }

        return "OT " + (quarter - 4);
    }

    var otherTeam = function(team) {
        return _.without([data.teams.away.name, data.teams.home.name], team)[0];
    }

    data.downFormatter = function(down) {
        var downs = ["1st", "2nd", "3rd", "4th"]
        return downs[down - 1];
    };

    data.atFormatter = function(play) {
        if (play.at === 50) {
            return "50";
        } else if (play.at < 50) {
            return data.teams[otherTeam(play.possession)].shortName + " " + play.at;
        } else {
            return data.teams[play.possession].shortName + " " + (100 - play.at);
        }
    };

    data.downAndDistance = function(play) {
        if (!play.down && !play.distance) {
            return "";
        }

        return this.downFormatter(play.down) + " and " + play.distance + " at " + this.atFormatter(play);
    };

    data.clock = function(clock) {
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
    data.scoringPlays = ko.computed(function() {
        return _.sortBy(data.scoreboard.scoringPlays(), function(play) {
            return play.driveNumber;
        });
    })

    data.homeOne = ko.computed(function() {
        return data.scoreboard.homeScores.quarters()[0];
    })
    data.homeTwo = ko.computed(function() {
        return data.scoreboard.homeScores.quarters()[1];
    })
    data.homeThree = ko.computed(function() {
        return data.scoreboard.homeScores.quarters()[2];
    })
    data.homeFour = ko.computed(function() {
        return data.scoreboard.homeScores.quarters()[3];
    })

    data.homeOTs = ko.computed(function() {
        return data.scoreboard.homeScores.quarters.slice(4, 4 + data.hasOTs());
    })

    data.homeTotal = ko.computed(function() {
        return data.scoreboard.homeScores.total();
    })

    data.awayOne = ko.computed(function() {
        return data.scoreboard.awayScores.quarters()[0];
    })
    data.awayTwo = ko.computed(function() {
        return data.scoreboard.awayScores.quarters()[1];
    })
    data.awayThree = ko.computed(function() {
        return data.scoreboard.awayScores.quarters()[2];
    })
    data.awayFour = ko.computed(function() {
        return data.scoreboard.awayScores.quarters()[3];
    })

    data.awayOTs = ko.computed(function() {
        return data.scoreboard.awayScores.quarters.slice(4, 4 + data.hasOTs());
    })
    data.awayTotal = ko.computed(function() {
        return data.scoreboard.awayScores.total();
    })

    data.getDriveSummary = function(driveNumber){
         var summary = data.driveSummaries()[driveNumber];

         var passes = "";
         var rushes = "";
         var yards ="";

         if (summary.PA && summary.PA > 1){
            passes = summary.PA  + " Passes, "
         } else if (summary.PA && summary.PA === 1){
            passes = summary.PA  + " Pass, "
         }

         if (summary.RA && summary.RA > 1){
            rushes = summary.RA  + " Rushes, "
         } else if (summary.RA && summary.RA === 1){
            rushes = summary.RA  + " Rush, "
         }

         if (summary.distance && Math.abs(summary.distance) !== 1){
            yards = summary.distance  + " Yards: "
         } else if (summary.distance && Math.abs(summary.distance) === 1){
            yards = summary.distance  + " Yard: "
         }

         return "DRIVE TOTALS: " +  passes + rushes + yards + summary.ending;

    }

    data.getPassingPlayers = function(team) {
        return _.chain(team.players)
            .select(function(player) {
                var stats = player.stats[data.gameId];
                return !!stats && stats["PA"];
            })
            .map(function(player) {
                var dataStats = player.stats[data.gameId];
                return {
                    player: player,
                    team: team.shortName,
                    points: ((dataStats["PTD"] || 0) * 4) + ((dataStats["PY"] || 0) * .04)
                };
            })
            .sortBy("points")
            .reverse()
            .value();
    };

    data.OTs = ko.computed(function() {
        return _.range(1, data.hasOTs() + 1);
    });
    data.getRushingPlayers = function(team) {
        return _.chain(team.players)
            .select(function(player) {
                var stats = player.stats[data.gameId];
                return !!stats && stats["RA"];
            })
            .map(function(player) {
                var dataStats = player.stats[data.gameId];
                return {
                    player: player,
                    team: team.shortName,
                    points: ((dataStats["RTDS"] || 0) * 4) + ((dataStats["RYDS"] || 0) * .04)
                }
            })
            .sortBy("points")
            .reverse()
            .value();
    };
    data.getReceivingPlayers = function(team) {
        return _.chain(team.players)
            .select(function(player) {
                var stats = player.stats[data.gameId];
                return !!stats && stats["R"];
            })
            .map(function(player) {
                var dataStats = player.stats[data.gameId];
                return {
                    player: player,
                    team: team.shortName,
                    points: ((dataStats["RECTD"] || 0) * 4) + (dataStats["R"] || 0) + ((dataStats["RECY"] || 0) * .04)
                }
            })
            .sortBy("points")
            .reverse()
            .value();
    };

    data.getKickingPlayers = function(team) {
        return _.chain(team.players)
            .select(function(player) {
                var stats = player.stats[data.gameId];
                return !!stats && (stats["XPA"] || stats["FGA"]);
            })
            .map(function(player) {
                return {
                    player: player
                }
            })
            .value();
    };


    data.getDefensivePlayers = function(team) {
        return _.chain(team.players)
            .select(function(player) {
                var stats = player.stats[data.gameId];
                return !!stats && (stats["FR"] || stats["INTD"]);
            })
            .map(function(player) {
                return {
                    player: player
                }
            })
            .value();
    };

    data.getReturnPlayers = function(team) {
        return _.select(team.players, function(player) {
            var stats = player.stats[data.gameId];
            return !!stats && (stats["PR"] || stats["KOR"]);
        });
    };

    data.getPuntingPlayers = function(team) {
        return _.chain(team.players)
            .select(function(player) {
                var stats = player.stats[data.gameId];
                return !!stats && stats["P"];
            })
            .map(function(player) {
                return {
                    player: player
                }
            })
            .value();
    };

    var getTopPasser = function() {
        var teamTops = _.compact([data.getPassingPlayers(data.teams.home)[0], data.getPassingPlayers(data.teams.away)[0]]);
        if (teamTops.length !== 0) {

            var topPasser = _.max(teamTops, function(player) {
                if (!player) {
                    return -Infinity;
                } else {
                    return player.points
                }

            });

            return topPasser.player.firstName[0] + ". " + topPasser.player.lastName + " (" + topPasser.team + ") - " + (topPasser.player.stats[data.gameId]["PY"] || "0") + " YDS, " + (topPasser.player.stats[data.gameId]["PTD"] || "0") + " TD";
        } else {
            return "-";
        }
    };

    var getTopRusher = function() {
        var teamTops = _.compact([data.getRushingPlayers(data.teams.home)[0], data.getRushingPlayers(data.teams.away)[0]]);
        if (teamTops.length !== 0) {
            var topRusher = _.max(teamTops, function(player) {
                return player.points;
            });
            return topRusher.player.firstName[0] + ". " + topRusher.player.lastName + " (" + topRusher.team + ") - " + (topRusher.player.stats[data.gameId]["RA"] || "0") + " CAR, " + (topRusher.player.stats[data.gameId]["RYDS"] || "0") + " YDS, " + (topRusher.player.stats[data.gameId]["RTDS"] || "0") + " TD";
        } else {
            return "-";
        }
    };

    var getTopReceiver = function() {
        var teamTops = _.compact([data.getReceivingPlayers(data.teams.home)[0], data.getReceivingPlayers(data.teams.away)[0]]);
        if (teamTops.length !== 0) {
            var topReceiver = _.max(teamTops, function(player) {
                return player.points;
            });
            return topReceiver.player.firstName[0] + ". " + topReceiver.player.lastName + " (" + topReceiver.team + ") - " + (topReceiver.player.stats[data.gameId]["R"] || "0") + " REC, " + (topReceiver.player.stats[data.gameId]["RECY"] || "0") + " YDS, " + (topReceiver.player.stats[data.gameId]["RECTD"] || "0") + " TD";
        } else {
            return "-";
        }
    };

    data.topPasser = ko.observable();
    data.topRusher = ko.observable();
    data.topReceiver = ko.observable();

    data.plays.subscribe(function() {
        data.topPasser(getTopPasser());
        data.topRusher(getTopRusher());
        data.topReceiver(getTopReceiver());
    })

    var playsForQ = function(q) {
        var playsInQ = _.select(data.plays(), function(play) {
            return play.quarter === q;
        });

        var drivesInQ = _.groupBy(playsInQ, 'driveNumber');

        return Object.keys(drivesInQ).map(function(key) {
            return drivesInQ[key];
        });
    };


    data.firstPlays = ko.computed(function() {
        return playsForQ(1);
    });

    data.secondPlays = ko.computed(function() {
        return playsForQ(2);
    });

    data.thirdPlays = ko.computed(function() {
        return playsForQ(3);
    });

    data.fourthPlays = ko.computed(function() {
        return playsForQ(4);
    });

    data.oTPlays = ko.computed(function() {
        var quarters = _.range(5, data.hasOTs() + 5);
        return _.map(quarters, function(quarter) {
            return {
                quarter: quarter,
                plays: playsForQ(quarter)
            }
        })
    });

    data.allPlays = ko.computed(function() {
        var drives = _.groupBy(data.plays(), 'driveNumber');

        return Object.keys(drives).map(function(key) {
            return drives[key];
        });
    });

    return data;
}
