var team = function(team){
	team.getPassingPlayers = function(){
		return _.select(team.players, function(player){
			return player.seasonStats["PA"];
		});
	};
	team.getRushingPlayers = function(){
		return _.select(team.players, function(player){
			return player.seasonStats["RA"];
		});
	};
	team.getRecevingPlayers = function(){
	return _.select(team.players, function(player){
			return player.seasonStats["R"];
		});
	};
	team.getKickingPlayers = function(){
	return _.select(team.players, function(player){
			return player.seasonStats["XPA"] || player.seasonStats["FGA"];
		});
	};
	return team;
}