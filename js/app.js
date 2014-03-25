$(document).ready(function () {
	viewModel = function()
		{
			vm = {};
			vm.teams = ko.observableArray();
			vm.games = ko.observableArray();
			vm.futureGames = ko.computed(function(){
				return _.select(this.games(),
					function(game){
						return game.startTime > new Date().getTime();
					}
				);
			},vm);
			vm.currentGames = ko.computed(function(){
				return _.select(this.games(),
					function(game){
						return game.startTime <= new Date().getTime() && !game.completed;
					}
				);
			},vm);
			vm.completedGames = ko.computed(function(){
				return _.select(this.games(),
					function(game){
					return game.complete;
					}
				);
			},vm);

			vm.loadGame =function(vm){
				vm(viewModel.games()[arguments[1].currentId]);
			};

			vm.loadTeam=function(vm){
				vm(team(viewModel.teams()[arguments[1].currentId]));
			};
			
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
	).done(function (data, firstNames, lastNames, playData,kickdata,xpmSkill, logos) {
		var teamGenerator = genball.generators.teams(data, firstNames, lastNames, xpmSkill, logos);
		var schedule = genball.generators.schedule().schedule();
		var seed;
		if (window.location.hash.split("/")[1]){
			seed = window.location.hash.split("/")[1];
		} else {
			seed = Math.random().toString(36).substring(7);
			window.location.hash = '#!/'+ seed + "/";
		}
		console.log("SEED: " + seed)
		Math.seedrandom(seed);
		
		_.times(10, function(){
			viewModel.teams.push(teamGenerator.newTeam())
		});

		_.each(schedule[0], function(matchup, index){
			viewModel.games.push(game(genball.generators.game(
				playData[0], kickdata[0], viewModel.teams()[matchup[0]],
				viewModel.teams()[matchup[1]], index, new Date().setDate(24), seed + index, false)));
		})

		
       setInterval(function(){
           _.each(viewModel.currentGames(), function(game){
	           game.playUntil(new Date().getTime());
           })
       }, 1000 , true)

		pager.Href.hash = '#!/'+ seed + "/";
		pager.extendWithPage(viewModel);
		ko.applyBindings(viewModel);
		pager.start();
		})
});