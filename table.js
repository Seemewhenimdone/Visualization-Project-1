export var tableOrganizer = {

    rowInfo: [
        {
            internalName: "years",
            externalName: "Season",
            isDescending: false
        },
        {
            internalName: "teamName",
            externalName: "Team Name",
            isDescending: false
        },
        {
            internalName: "name",
            externalName: "Player",
            isDescending: false
        },
        {
            internalName: "playerScore",
            externalName: "Score",
            isDescending: false
        },
        {
            internalName: "offensiveRating",
            externalName: "Offensive Rating",
            isDescending: false
        },
        {
            internalName: "defensiveRating",
            externalName: "Defensive Rating",
            isDescending: false
        },
        {
            internalName: "games",
            externalName: "Games",
            isDescending: false
        },
    ],

    state: {
        rowsDisplayed: 100,
        filterByYear: {
            state: false,
            value: 1982
        },
        filterByTeam: "",
        filterByPlayer: "",
        filterByGames: 0

    },

    createRow: function (data) {
        var row = document.createElement("tr");
        
        for(var i = 0; i < this.rowInfo.length; i++) {    
            var cellData = data[this.rowInfo[i].internalName];

            if(cellData != null) {
                if(this.rowInfo[i].internalName == "playerScore" || 
                   this.rowInfo[i].internalName == "offensiveRating" || 
                   this.rowInfo[i].internalName == "defensiveRating") {
                    cellData = parseFloat(cellData.toFixed(3));
                }
            }

            row.appendChild(this.createCell(cellData));
        }
    
        return row;
    },
    createRowHeader: function() {
        var headerRow = document.createElement("tr");
        for(var i = 0; i < this.rowInfo.length; i++) {
            headerRow.appendChild(this.createCellWithId(this.rowInfo[i].externalName));
        }
        return headerRow;
    },
    createTable: function (data) {

        var actualTable = document.createElement("table");
        var goal = this.state.rowsDisplayed;
        for(var i = 0; i < goal && i < data.length; i++) {
            if(this.pastFilters(data[i])) {
                actualTable.appendChild(this.createRow(data[i]));
            } else {
                goal++;
            }
        }
    
        return actualTable;
    },
    createCell: function (innerData) {
        var result = document.createElement("td");
        result.innerHTML = innerData;
    
        return result;
    },
    createCellWithId: function (innerData) {
        var result = document.createElement("td");
        result.innerHTML = innerData;
        result.id = innerData;
    
        return result;
    },
    sortData: function(data, category, isDescending, start, end) {
        
        for(var i = 0; i < data.length; i++) {
            end++;
            if(this.pastFilters(data[i])) {
                start = i;
                break;
            }
        }
        
        for(var i = start; i < end + 4; i++) {
            var minIndex = i;
    
            for(var j = i + 1; j < data.length; j++) {
                if(this.pastFilters(data[j])) {
                    if(isDescending && data[j][category] > data[minIndex][category]) {
                        minIndex = j;
                    }
                    else if(!isDescending && data[j][category] < data[minIndex][category]) {
                        minIndex = j;
                    }
                }
            }
    
            var temp = data[i];
            data[i] = data[minIndex];
            data[minIndex] = temp;
    
        }
    },
    pastFilters: function (dataPiece) {
        if((this.state.filterByYear.state && dataPiece['years'].split('-')[0] != this.state.filterByYear.value) ||
           !dataPiece['teamName'].toLowerCase().startsWith(this.state.filterByTeam.toLowerCase()) ||
           !dataPiece['name'].toLowerCase().startsWith(this.state.filterByPlayer.toLowerCase()) || 
           parseInt(dataPiece['games']) < this.state.filterByGames) {
            return false;
        }

        return true;
    }
};