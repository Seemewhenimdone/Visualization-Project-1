import { allData } from "./data.js";
import { tableOrganizer } from "./table.js"

var theContainer = document.getElementById("tbContainer");
refreshTable.headerRow = tableOrganizer.createRowHeader();
var yearSlider = document.getElementById("yearFilterSlider");
var yearCheckbox = document.getElementById("filterYearsOrNo");
var amountOfRows = document.getElementById("amountOfRows");
var teamFilterBox = document.getElementById("teamFilterBox");
var playerFilterBox = document.getElementById("playerFilterBox");
var gamesFilterBox = document.getElementById("gamesFilterBox");
var playerTotalCheckBox = document.getElementById("playerTotal");

tableOrganizer.state.amountOfRows = 1;

var currentData = allData;
var totalData = calculateTotalData();

function calculateTotalData() {
    var result = [];
    var seenNames = [];
    for(var i = 0; i < allData.length - 1; i++) {
        if(seenNames[allData[i]['name']]) {
            continue;
        }

        var copy = copyObject(allData[i]);
        copy['years'] = "N/A";
        copy['teamName'] = "N/A";

        var totalPlayerScore = copy['playerScore'] * copy['games'];
        var totalOffensiveRating = copy['offensiveRating'] * copy['games'];
        var totalDefensiveRating = copy['defensiveRating'] * copy['games'];
        var games = parseInt(copy['games']); // gamesplayed in season times season score

        for(var j = i + 1; j < allData.length; j++) {
            if(allData[j]['name'] == copy['name']) {
                totalPlayerScore += allData[j]['playerScore'] * allData[j]['games'];
                totalOffensiveRating += allData[j]['offensiveRating']* allData[j]['games'];
                totalDefensiveRating += allData[j]['defensiveRating']* allData[j]['games'];
                games += parseInt(allData[j]['games']);
            }
        }

        copy['games'] = games;
        copy['playerScore'] = totalPlayerScore / games;
        copy['offensiveRating'] = totalOffensiveRating / games;
        copy['defensiveRating'] = totalDefensiveRating / games;

        seenNames[copy['name']] = true;
        result.push(copy);
    }
    return result;
}

refreshTable(currentData, theContainer);

yearSlider.oninput = () => {
    document.getElementById("yearsTextBox").innerHTML = yearSlider.value + "-" 
                                                        + (parseInt(yearSlider.value) + 1);
    refreshYearFilter();
}

amountOfRows.oninput = () => {
    tableOrganizer.state.rowsDisplayed = parseInt(amountOfRows.value);
    refreshTable(currentData, theContainer);
}

teamFilterBox.oninput = () => {
    tableOrganizer.state.filterByTeam = teamFilterBox.value;
    refreshTable(currentData, theContainer);
}

gamesFilterBox.oninput = () => {
    tableOrganizer.state.filterByGames = parseInt(gamesFilterBox.value);
    refreshTable(currentData, theContainer);
}

playerFilterBox.oninput = () => {
    tableOrganizer.state.filterByPlayer = playerFilterBox.value;
    refreshTable(currentData, theContainer);
}

yearCheckbox.oninput = () => {
    refreshYearFilter();
}

playerTotalCheckBox.oninput = () => {
    if(currentData == allData) {
        currentData = totalData;
    } else {
        currentData = allData;
    }
    refreshYearFilter();
}

function refreshYearFilter() {
    tableOrganizer.state.filterByYear.value = yearSlider.value;
    if(yearCheckbox.checked) {
        tableOrganizer.state.filterByYear.state = true;
    } else {
        tableOrganizer.state.filterByYear.state = false;
    }

    refreshTable(currentData, theContainer);
}

function refreshTable(data, container) {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    var table = tableOrganizer.createTable(data)
    table.prepend(refreshTable.headerRow);
    container.appendChild(table);
}

function copyObject(theObject) {
    return JSON.parse(JSON.stringify(theObject));
}

function getReference(externalName) {
    for(var i = 0; i < tableOrganizer.rowInfo.length; i++) {
        if(tableOrganizer.rowInfo[i].externalName == externalName) {
            return tableOrganizer.rowInfo[i];
        }
    }
}

function setOnClick(id) {
    document.getElementById(id).onclick = function() {
        var theReference = getReference(id);
        theReference.isDescending = !theReference.isDescending;

        tableOrganizer.sortData(currentData, theReference.internalName, theReference.isDescending, 0, tableOrganizer.state.rowsDisplayed - 1);
        refreshTable(currentData, theContainer);
        
    }
}

setOnClick("Score");
setOnClick("Offensive Rating");
setOnClick("Defensive Rating");
setOnClick("Games");
setOnClick("Season");
setOnClick("Player");
setOnClick("Team Name");