let teamsData = {};

function createMatchMatrix(matches) {
    // Reset team data
    teamsData = {};

    let teams = [...new Set([].concat(...matches.map(match => [match.homeTeam, match.awayTeam])))];

    teams.forEach(team => {
        teamsData[team] = {
            name: team,
            points: 0,
            goals: 0,
            wins: 0,
            homeWins: 0,
            awayWins: 0,
            matches: 0,
            draws: 0,
            loses: 0
        };
    });

    let matchMatrix = [['Team'].concat(teams)];

    for (let team of teams) {
        matchMatrix.push([team].concat(new Array(teams.length).fill('-')));
    }

    for (let match of matches) {
        let homeTeamIndex = teams.indexOf(match.homeTeam) + 1;
        let awayTeamIndex = teams.indexOf(match.awayTeam) + 1;

        let homeTeamData = teamsData[match.homeTeam];
        let awayTeamData = teamsData[match.awayTeam];

        homeTeamData.matches++;
        awayTeamData.matches++;

        homeTeamData.goals += match.homeTeamGoals;
        awayTeamData.goals += match.awayTeamGoals;

        if (match.homeTeamGoals > match.awayTeamGoals) {
            homeTeamData.points += 3;
            homeTeamData.wins += 1;
            homeTeamData.homeWins += 1;
            awayTeamData.loses += 1;
        } else if (match.homeTeamGoals < match.awayTeamGoals) {
            awayTeamData.points += 3;
            awayTeamData.wins += 1;
            awayTeamData.awayWins += 1;
            homeTeamData.loses += 1;
        } else {
            homeTeamData.points += 1;
            awayTeamData.points += 1;
            homeTeamData.draws += 1;
            awayTeamData.draws += 1;
        }

        matchMatrix[homeTeamIndex][awayTeamIndex] = `${match.homeTeamGoals}-${match.awayTeamGoals}`;
    }

    // Update match table
    let matchTable = document.getElementById('matchTable');
    while (matchTable.firstChild) {
        matchTable.removeChild(matchTable.firstChild);
    }

    for (let row of matchMatrix) {
        let tableRow = document.createElement('tr');
        for (let cell of row) {
            let tableCell = row === matchMatrix[0] ? document.createElement('th') : document.createElement('td');
            tableCell.textContent = cell;
            tableRow.appendChild(tableCell);
        }
        matchTable.appendChild(tableRow);
    }

    // Update stats table
    sortTeams('points');
}

function sortTeams(by) {
    let sortedTeams = Object.values(teamsData).sort((a, b) => {
        if (by === 'name') {
            return a.name.localeCompare(b.name);
        } else if (by === 'goals') {
            return b.goals - a.goals;
        } else if (by === 'wins') {
            return b.wins - a.wins;
        } else if (by === 'homeWins') {
            return b.homeWins - a.homeWins;
        } else if (by === 'awayWins') {
            return b.awayWins - a.awayWins;
        } else {
            return b.points - a.points;
        }
    });

    let table = document.getElementById('statsTable');

    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    for (let teamData of sortedTeams) {
        let row = table.insertRow(-1);

        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3);
        let cell5 = row.insertCell(4);
        let cell6 = row.insertCell(5);
        let cell7 = row.insertCell(6);
        let cell8 = row.insertCell(7);

        cell1.innerHTML = teamData.name;
        cell2.innerHTML = teamData.points;
        cell3.innerHTML = teamData.matches;
        cell4.innerHTML = teamData.wins;
        cell5.innerHTML = teamData.homeWins;
        cell6.innerHTML = teamData.awayWins;
        cell7.innerHTML = teamData.draws;
        cell8.innerHTML = teamData.loses;
    }
}

function loadBracket(bracketFile) {
    fetch(bracketFile)
        .then(response => response.json())
        .then(matches => {
            createMatchMatrix(matches);
        })
        .catch(error => console.error('An error occurred:', error));
}
