var currentSheetId = "";
var currentPlayers = [];
var goalTypes = ["Counter", "Five Meter", "Foul", "Six on Five"];
var AP1_KEY;
var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
var group1 = [document.getElementById("signin-button"), document.getElementById("middleLogo")];
var group2 = [document.getElementById("namesInputForm"), document.getElementById("sheetInputForm"), document.getElementById("enterthe"), document.getElementById("or")];
var group3 = [document.getElementById("addGoalForm"), document.getElementById("goback")];
var cheez = 'AIza' + document.getElementById("cheeez").innerHTML;
var previousActions = [];

// function makeApiCall() {
//     var params = {
//     // The ID of the spreadsheet to retrieve data from.
//     spreadsheetId: '1cIkJhHj9CZjOaWLRH971x3J0XaHF7ETDWxPSr5JJhSE',  // TODO: Update placeholder value.

//     // The A1 notation of the values to retrieve.
//     range: 'Sheet1',  // TODO: Update placeholder value.

//     // How values should be represented in the output.
//     // The default render option is ValueRenderOption.FORMATTED_VALUE.
//     //valueRenderOption: '',  // TODO: Update placeholder value.

//     // How dates, times, and durations should be represented in the output.
//     // This is ignored if value_render_option is
//     // FORMATTED_VALUE.
//     // The default dateTime render option is [DateTimeRenderOption.SERIAL_NUMBER].
//     //dateTimeRenderOption: '',  // TODO: Update placeholder value.
//     };

//     var request = gapi.client.sheets.spreadsheets.values.get(params);
//     request.then(function(response) {
//     // TODO: Change code below to process the `response` object:
//     console.log(response.result);
//     dealWithResponse(response.result);
//     console.log("printed");
//     }, function(reason) {
//     console.error('error: ' + reason.result.error.message);
//     });
// }

//from old spreadsheet

function updateSheetInput(form) {
    var linkl = form.linkBox.value;
    var partId = false;

    currentSheetId = "";

    for (var i = 0; i < linkl.length; i++) {
    if (partId) {
        if (linkl.charAt(i) == "/") {
        partId = false;
        } else {
        currentSheetId += linkl.charAt(i);
        }
    }
    if(linkl.charAt(i - 2) == "/" && linkl.charAt(i - 1) == "d" && linkl.charAt(i) == "/") {
        partId = true;
    }
    }    
    var params = {
    spreadsheetId: currentSheetId,
    range: 'Sheet1',
    };
    {
    var request = gapi.client.sheets.spreadsheets.values.get(params);
    request.then(function(response) {
        //console.log(response.result);
        addNames(response.result);
    }, function(reason) {
        console.error('error: ' + reason.result.error.message);
        if (reason.result.error.message == "Requested entity was not found.") {
            alert("Please enter a link.")
        }
    });
    }
}
function addNames(result) {
    var ars = result.values;
    currentPlayers = [];
    for (var i = 1; i < ars.length; i++) {
    currentPlayers.push(ars[i][0]);
    }
    populateNameSelect();
    stage3();
}

//from name list
function createNewSheet(form) {
    var linkl = form.linkBox.value;
    var partId = false;
    currentSheetId = "";
    for (var i = 0; i < linkl.length; i++) {
    if (partId) {
        if (linkl.charAt(i) == "/") {
        partId = false;
        } else {
        currentSheetId += linkl.charAt(i);
        }
    }
    if(linkl.charAt(i - 2) == "/" && linkl.charAt(i - 1) == "d" && linkl.charAt(i) == "/") {
        partId = true;
    }
    }    
    var params = {
        spreadsheetId: currentSheetId,
        range: 'Sheet1',
    };
    {
        var request = gapi.client.sheets.spreadsheets.values.get(params);
        request.then(function(response) {
            //console.log(response.result);
            addNames(response.result);
            makeSheet();
        }, function(reason) {
            console.error('error: ' + reason.result.error.message);
            if (reason.result.error.message == "Requested entity was not found.") {
                alert("Please enter a link.")
            }
        });
    }
}
function makeSheet() {
    var d = new Date();
    var spreadsheetBody = {
        "properties": {
            "title": "Game at " + ((d.getHours() + ":" + d.getMinutes()) + " on " + (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear())
        }
    };

    {
        var request = gapi.client.sheets.spreadsheets.create({}, spreadsheetBody);
        request.then(function(response) {
        currentSheetId = response.result.spreadsheetId;
        populateNewSheet();
        //console.log(response.result);
        }, function(reason) {
            console.error('error: ' + reason.result.error.message);
            
        });
    }
}
function populateNewSheet() {
    var params = {
    spreadsheetId: currentSheetId
    };

    var batchUpdateValuesRequestBody = {
        valueInputOption: "USER_ENTERED",
        "data": [
            {
            "range": "Sheet1!A1:E1",
            "majorDimension": "ROWS",
            "values": [
                ["Name", "Counter", "Five Meter", "Foul", "Six on Five"]
            ]
            }
        ]
    };

    for (var i = 0; i < currentPlayers.length; i++) {
        batchUpdateValuesRequestBody.data.push(
            {
                "range": "Sheet1!A" + (i + 2) + ":E"+ (i + 3),
                "majorDimension": "ROWS",
                "values": [
                [currentPlayers[i], "0", "0", "0", "0"]
                ]
            }
        );
    }

    {
    var request = gapi.client.sheets.spreadsheets.values.batchUpdate(params, batchUpdateValuesRequestBody);
    request.then(function(response) {
    //console.log(response.result);
    }, function(reason) {
    console.error('error: ' + reason.result.error.message);
    });
    }
}

function addGoal(form) {
    window.navigator.vibrate(200);
    var selectedPlayer;
    for (var i = 0; i < currentPlayers.length; i++) {
        if (currentPlayers[i] == form.playerBox.value) {
            selectedPlayer = i + 2;
        }
    }
    var selectedGoal;
    for (var i = 0; i < goalTypes.length; i++) {
        if (goalTypes[i] == form.goalBox.value) {
            selectedGoal = letters[i + 1];
        }
    }
    var params = {
        spreadsheetId: currentSheetId,
        range: (selectedGoal + "" + selectedPlayer)
    };
    
    {
    var request = gapi.client.sheets.spreadsheets.values.get(params);
    request.then(function(response) {
        writeGoal(response.result.values[0][0], selectedGoal, selectedPlayer);

    }, function(reason) {
        console.error('error: ' + reason.result.error.message);
    });
    }
}
function writeGoal(prevVal, letterRange, numberRange) {
    var params = {
    spreadsheetId: currentSheetId,
    range: "Sheet1!" + (letterRange + "" + 1),
    valueInputOption: 'USER_ENTERED'

    };
    var tempVals = [];
    for (var i = 0; i < currentPlayers.length + 1; i++) {
        if (numberRange - 1 == i) {
            tempVals.push((parseInt(prevVal, 10) + 1))
        } else {
            tempVals.push(null);
        }
        
    }
    var valueRangeBody = {
        "range": "Sheet1!" + (letterRange + "" + 1),
        "majorDimension": "COLUMNS",
        "values": [tempVals]
    };
    var request = gapi.client.sheets.spreadsheets.values.update(params, valueRangeBody);
    request.then(function(response) {
        //console.log(response.result);
        document.getElementById("updateMsg").style.display = "block";
        previousActions.push(letterRange + "" + numberRange);
        setTimeout(function(){
            document.getElementById("updateMsg").style.display = "none";
        }, 3000);
    }, function(reason) {
    console.error('error: ' + reason.result.error.message);
    });
}


function subtractGoal() {
    var params = {
        spreadsheetId: currentSheetId,
        range: previousActions[previousActions.length - 1]
    };
    {
    var request = gapi.client.sheets.spreadsheets.values.get(params);
    request.then(function(response) {
        writeUndo(response.result.values[0][0], previousActions[previousActions.length - 1].charAt(1), previousActions[previousActions.length - 1].charAt(0));
        previousActions.pop();
    }, function(reason) {
        console.error('error: ' + reason.result.error.message);
    });
    }
}
function writeUndo(prevVal, numberRange, letterRange) {
    var params = {
    spreadsheetId: currentSheetId,
    range: "Sheet1!" + (letterRange + "" + 1),
    valueInputOption: 'USER_ENTERED'

    };
    var tempVals = [];
    for (var i = 0; i < currentPlayers.length + 1; i++) {
        if (numberRange - 1 == i) {
            tempVals.push((parseInt(prevVal, 10) - 1))
        } else {
            tempVals.push(null);
        }
        
    }
    var valueRangeBody = {
        "range": "Sheet1!" + (letterRange + "" + 1),
        "majorDimension": "COLUMNS",
        "values": [tempVals]
    };
    var request = gapi.client.sheets.spreadsheets.values.update(params, valueRangeBody);
    request.then(function(response) {
        //console.log(response.result);
        document.getElementById("updateMsg").style.display = "block";
        setTimeout(function(){
            document.getElementById("updateMsg").style.display = "none";
        }, 3000);
    }, function(reason) {
    console.error('error: ' + reason.result.error.message);
    });
}


//OAuth etc
function initClient() {
    var API_KEY = 'ASdkj13asI28hDKN63lSM-HzEJ9j539Gi4o8djsf72G8yguYdg8';  // TODO: Update placeholder with desired API key.
    var CLIENT_ID = '198278590323-f7090va9dl9uuaacue60kej9u9hcerqr.apps.googleusercontent.com';  // TODO: Update placeholder with desired client ID.

    // TODO: Authorize using one of the following scopes:
    //   'https://www.googleapis.com/auth/drive'
    //   'https://www.googleapis.com/auth/drive.file'
    //   'https://www.googleapis.com/auth/drive.readonly'
    //   'https://www.googleapis.com/auth/spreadsheets'
    //   'https://www.googleapis.com/auth/spreadsheets.readonly'
    var SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

    console.log(API_KEY)
    gapi.client.init({
    'apiKey': AP1_KEY,
    'clientId': CLIENT_ID,
    'scope': SCOPE,
    'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    }).then(function() {
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
    updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
}
function handleClientLoad() {
    AP1_KEY = cheez + "Ydg8";
    gapi.load('client:auth2', initClient);
}
function updateSignInStatus(isSignedIn) {
    if (isSignedIn) {
    //makeApiCall();
    stage2();
    }
}
function handleSignInClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}
function handleSignOutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
    stage1();
}

function populateNameSelect() {
    document.getElementById("playerBox").innerHTML = "";
    for (var i = 0; i < currentPlayers.length; i++) {
        var option = document.createElement("option");
        option.innerHTML = currentPlayers[i];
        document.getElementById("playerBox").append(option);
    }
}

function populateTypeSelect() {
    for (var i = 0; i < goalTypes.length; i++) {
        var option = document.createElement("option");
        option.innerHTML = goalTypes[i];
        document.getElementById("goalBox").append(option);
    }
}

function stage1() {
    document.getElementById("updateMsg").style.display = "none";
    console.log("stage1");
    for (var i = 0; i < group1.length; i++) {
        group1[i].style.display = 'inline';
    }
    for (var i = 0; i < group2.length; i++) {
        group2[i].style.display = 'none';
    }
    for (var i = 0; i < group3.length; i++) {
        group3[i].style.display = 'none';
    }
}

function stage2() {
    console.log("stage2");
    for (var i = 0; i < group1.length; i++) {
        group1[i].style.display = 'none';
    }
    for (var i = 0; i < group2.length; i++) {
        group2[i].style.display = 'inline-block';
    }
    for (var i = 0; i < group3.length; i++) {
        group3[i].style.display = 'none';
    }
}

function stage3() {
    console.log("stage3");
    for (var i = 0; i < group1.length; i++) {
        group1[i].style.display = 'none';
    }
    for (var i = 0; i < group2.length; i++) {
        group2[i].style.display = 'none';
    }
    for (var i = 0; i < group3.length; i++) {
        group3[i].style.display = 'inline-block';
    }
}

stage1();
populateTypeSelect();

function refresh() {
    if (previousActions.length == 0) {
        document.getElementById("undo").style.display = "none";
    } else {
        document.getElementById("undo").style.display = "block";
    }
    if (currentSheetId == "") {
        document.getElementById("openSheetButton").style.display = "none";
    } else {
        document.getElementById("openSheetButton").style.display = "block";
        document.getElementById("openSheetLink").href = "https://docs.google.com/spreadsheets/d/" + currentSheetId;
    }
}

refresh();
var refreshInterval = window.setInterval(refresh, 1000);
// if (screen.width <= 699) {
//     document.getElementById("pagestyle").setAttribute("href", index.css);
// }

function backHome() {
    stage2();
    previousActions = [];
    currentSheetId = "";
    currentPlayers = [];
    document.getElementById("sheetInputForm").linkBox.value = "";
    document.getElementById("namesInputForm").linkBox.value = "";
}