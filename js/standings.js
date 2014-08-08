var standings = function(teams) {
    return {
        teamsByWins: _.chain(teams)
            .sortBy(function(team){
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
    }
}
