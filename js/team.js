var team = function(team, schedule) {
    team.games = [];

    team.getPassingPlayers = function() {
        return _.chain(team.players)
            .select(selectPassingPlayers)
            .map(mapPassingPlayers)
            .sortBy("points")
            .reverse()
            .value();
    };

    var selectPassingPlayers = function(player) {
        var stats = player.seasonStats;
        return !!stats && stats["PA"];
    }

    var mapPassingPlayers = function(player) {
        var dataStats = player.seasonStats;
        return {
            player: player,
            team: team.shortName,
            teamId: team.id,
            points: ((dataStats["PTD"] || 0) * 4) + ((dataStats["PY"] || 0) * .04)
        };
    }

    team.getRushingPlayers = function() {
        return _.chain(team.players)
            .select(selectRushingPlayers)
            .map(mapRushingPlayers)
            .sortBy("points")
            .reverse()
            .value();
    };

    var selectRushingPlayers = function(player) {
        var stats = player.seasonStats;
        return !!stats && stats["RA"];
    }
    var mapRushingPlayers = function(player) {
        var dataStats = player.seasonStats;
        return {
            player: player,
            team: team.shortName,
            teamId: team.id,
            points: ((dataStats["RTDS"] || 0) * 4) + ((dataStats["RYDS"] || 0) * .04)
        }
    }

    var selectReceivingPlayers = function(player) {
        var stats = player.seasonStats;
        return !!stats && stats["R"];
    }
    var mapReceivingPlayers = function(player) {
        var dataStats = player.seasonStats;
        return {
            player: player,
            team: team.shortName,
            teamId: team.id,
            points: ((dataStats["RECTD"] || 0) * 4) + (dataStats["R"] || 0) + ((dataStats["RECY"] || 0) * .04)
        }
    }
    var selectKickingPlayers = function(player) {
        var stats = player.seasonStats;
        return !!stats && (stats["XPA"] || stats["FGA"]);
    }
    var mapKickingPlayers = function(player) {
        return {
            player: player,
            team: team.shortName,
            teamId: team.id
        }
    }
    var selectDefensivePlayers = function(player) {
        var stats = player.seasonStats;
        return !!stats && (stats["FR"] || stats["INTD"] || stats["SK"]);
    }
    var mapDefensivePlayers = function(player) {
        return {
            player: player,
            team: team.shortName,
            teamId: team.id
        }
    }
    var selectReturnPlayers = function(player) {
        var stats = player.seasonStats;
        return !!stats && (stats["PR"] || stats["KOR"]);
    }
    var mapReturnPlayers = function(player) {
        return {
            player: player,
            team: team.shortName,
            teamId: team.id
        }
    }
    var selectPuntingPlayers = function(player) {
        var stats = player.seasonStats;
        return !!stats && stats["P"];
    }
    var mapPuntingPlayers = function(player) {
        return {
            player: player,
            team: team.shortName,
            teamId: team.id
        }
    }

    team.getReceivingPlayers = function() {
        return _.chain(team.players)
            .select(selectReceivingPlayers)
            .map(mapReceivingPlayers)
            .sortBy("points")
            .reverse()
            .value();
    };
    team.getKickingPlayers = function() {
        return _.chain(team.players)
            .select(selectKickingPlayers)
            .map(mapKickingPlayers)
            .value();
    };
    team.getDefensivePlayers = function() {
        return _.chain(team.players)
            .select(selectDefensivePlayers)
            .map(mapDefensivePlayers)
            .value();
    };

    team.getReturnPlayers = function() {
        return _.chain(team.players)
            .select(selectReturnPlayers)
            .map(mapReturnPlayers)
            .value();
    };

    team.getPuntingPlayers = function() {
        return _.chain(team.players)
            .select(selectPuntingPlayers)
            .map(mapPuntingPlayers)
            .value();
    };

    team.teamPath = "../"

    team.getStatPlayers = function() {
        var stats = {};
        stats.passingPlayers = [];
        stats.rushingPlayers = [];
        stats.receivingPlayers = [];
        stats.kickingPlayers = [];
        stats.defensivePlayers = [];
        stats.returnPlayers = [];
        stats.puntingPlayers = [];

        _.each(team.players, function(player) {
            if (selectPassingPlayers(player)) {
                stats.passingPlayers.push(mapPassingPlayers(player))
            }
            if (selectRushingPlayers(player)) {
                stats.rushingPlayers.push(mapRushingPlayers(player))
            }
            if (selectReceivingPlayers(player)) {
                stats.receivingPlayers.push(mapReceivingPlayers(player))
            }
            if (selectKickingPlayers(player)) {
                stats.kickingPlayers.push(mapKickingPlayers(player))
            }
            if (selectDefensivePlayers(player)) {
                stats.defensivePlayers.push(mapDefensivePlayers(player))
            }
            if (selectReturnPlayers(player)) {
                stats.returnPlayers.push(mapReturnPlayers(player))
            }
            if (selectPuntingPlayers(player)) {
                stats.puntingPlayers.push(mapPuntingPlayers(player))
            }
        })

        return stats;
    }

    return team;
}
