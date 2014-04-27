var team = function(team, schedule) {
    team.games = [];

    team.getPassingPlayers = function() {
        return _.select(team.players, function(player) {
            return player.seasonStats["PA"];
        });
    };
    team.getRushingPlayers = function() {
        return _.select(team.players, function(player) {
            return player.seasonStats["RA"];
        });
    };
    team.getRecevingPlayers = function() {
        return _.select(team.players, function(player) {
            return player.seasonStats["R"];
        });
    };
    team.getKickingPlayers = function() {
        return _.select(team.players, function(player) {
            return player.seasonStats["XPA"] || player.seasonStats["FGA"];
        });
    };
    team.getDefensivePlayers = function() {
        return _.select(team.players, function(player) {
            return player.seasonStats["INTD"] || player.seasonStats["FR"];
        });
    };    
    team.getReturnPlayers = function() {
        return _.select(team.players, function(player) {
            return player.seasonStats["KOR"] || player.seasonStats["PR"];
        });
    };
    return team;
}
