var game = function(data){
	data.homeOne = ko.computed(function(){
		return data.scoreboard.homeScores.first();
	})
	data.homeTwo = ko.computed(function(){
		return data.scoreboard.homeScores.second();
	})
	data.homeThree = ko.computed(function(){
		return data.scoreboard.homeScores.third();
	})
	data.homeFour = ko.computed(function(){
		return data.scoreboard.homeScores.fourth();
	})
	data.homeTotal = ko.computed(function(){
		return data.scoreboard.homeScores.total();
	})
	data.awayOne = ko.computed(function(){
		return data.scoreboard.awayScores.first();
	})
	data.awayTwo = ko.computed(function(){
		return data.scoreboard.awayScores.second();
	})
	data.awayThree = ko.computed(function(){
		return data.scoreboard.awayScores.third();
	})
	data.awayFour = ko.computed(function(){
		return data.scoreboard.awayScores.fourth();
	})
	data.awayTotal = ko.computed(function(){
		return data.scoreboard.awayScores.total();
	})

	return data;
}