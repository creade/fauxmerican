var stats = function(teams) {
    var statsVM = {};
    statsVM.passingPlayers = [];
    statsVM.rushingPlayers = [];
    statsVM.receivingPlayers = [];
    statsVM.kickingPlayers = [];
    statsVM.defensivePlayers = [];
    statsVM.returnPlayers = [];
    statsVM.puntingPlayers = [];

    _.each(teams, function(team) {
        var stats = team.getStatPlayers();
        statsVM.passingPlayers.push(stats.passingPlayers);
        statsVM.rushingPlayers.push(stats.rushingPlayers);
        statsVM.receivingPlayers.push(stats.receivingPlayers);
        statsVM.kickingPlayers.push(stats.kickingPlayers);
        statsVM.defensivePlayers.push(stats.defensivePlayers);
        statsVM.returnPlayers.push(stats.returnPlayers);
        statsVM.puntingPlayers.push(stats.puntingPlayers);
    })

    statsVM.passingPlayers = _.flatten(statsVM.passingPlayers);
    statsVM.rushingPlayers = _.flatten(statsVM.rushingPlayers);
    statsVM.receivingPlayers = _.flatten(statsVM.receivingPlayers);
    statsVM.kickingPlayers = _.flatten(statsVM.kickingPlayers);
    statsVM.defensivePlayers = _.flatten(statsVM.defensivePlayers);
    statsVM.returnPlayers = _.flatten(statsVM.returnPlayers);
    statsVM.puntingPlayers = _.flatten(statsVM.puntingPlayers);

    statsVM.passingPlayers = _.sortBy(statsVM.passingPlayers, function(player) {
        return -1 * (player.player.seasonStats["PY"] || 0)
    });

    statsVM.rushingPlayers = _.sortBy(statsVM.rushingPlayers, function(player) {
        return -1 * (player.player.seasonStats["RYDS"] || 0);
    });

    statsVM.receivingPlayers = _.sortBy(statsVM.receivingPlayers, function(player) {
        return -1 * (player.player.seasonStats["RECY"] || 0);
    });
	
    statsVM.kickingPlayers = _.sortBy(statsVM.kickingPlayers, function(player) {
        return -1 * (player.player.seasonStats["FGM"] || 0);
    });

	statsVM.puntingPlayers = _.sortBy(statsVM.puntingPlayers, function(player) {
        return -1 * (player.player.seasonStats["PUYDS"] || 0);
    });

	statsVM.defensivePlayers = _.sortBy(statsVM.defensivePlayers, function(player) {
        return -1 * (player.player.seasonStats["FR"] || 0);
    });

	statsVM.defensivePlayers = _.sortBy(statsVM.defensivePlayers, function(player) {
        return -1 * ((player.player.seasonStats["INTD"] || 0) + (player.player.seasonStats["FR"] || 0) + (player.player.seasonStats["SK"] || 0))
    });


	statsVM.returnPlayers = _.sortBy(statsVM.returnPlayers, function(player) {
        return -1 * (player.player.seasonStats["PRYDS"] || 0);
    });



    return statsVM;
}
