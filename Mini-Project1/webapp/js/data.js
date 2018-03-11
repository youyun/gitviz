var data = [];
var dataObj = [];
var participationObj = [];
var hourlyCommitsObj = [];
var languages = {};
var languagesObj = [];


/*functions to get ajax callback results*/
function getParticipation() {
    // GET /repos/:owner/:repo/stats/participation
    var owner = $("#owner").val();
    var repo = $("#repository").val();

    $.get("https://api.github.com/repos/"+owner+"/"+repo+"/stats/participation?access_token=" + localStorage.getItem("token"), function (result) {
        console.log("Participation", result);
        processParticipation(result);
    })
    .fail(function() {
        alert( "error" );
    });
}

function getHourlyCommits() {
    // GET /repos/:owner/:repo/stats/punch_card
    var owner = $("#owner").val();
    var repo = $("#repository").val();
    
    $.get("https://api.github.com/repos/"+owner+"/"+repo+"/stats/punch_card?access_token=" + localStorage.getItem("token"), function (result) {
        console.log("Hourly Commits:", result);
        processHourlyCommits(result);
    })
    .fail(function() {
        alert( "error" );
    });
}

function getRepoLanguages() {
    var owner = $("#owner").val();
    // Step 1: get all repos
    // GET /users/:username/repos
    $.get("https://api.github.com/users/"+owner+"/repos?access_token=" + localStorage.getItem("token"), function (result) {
        console.log("Repo Languages:", result);        
        localStorage.totalRepo = result.length;

        // Step 2: get bytes of languages for each repo
        // GET /repos/:owner/:repo/languages
        $.each(result, function(i, repo) {
            $.get("https://api.github.com/repos/"+owner+"/"+repo.name+"/languages?access_token=" + localStorage.getItem("token"), function (result) {
                data.push(result);
                localStorage.actualRepo = parseInt(localStorage.actualRepo) + 1;
            });
        });
    })
    .fail(function() {
        alert( "error" );
    });
}

function getAllRepoLanguages() {
    data = [];
    localStorage.actualRepo = 0;
    $.when(getRepoLanguages()).done(function(result){
        var check = function(){
            if (localStorage.actualRepo > 0 && localStorage.totalRepo == localStorage.actualRepo){
                processRepoLanguages()
            }
            else {
                setTimeout(check, 500); // check again in a second
            }
        }

        check();
    });
}


/*functions to process data*/
function processParticipation(result) {
    participationObj = [];

    for (var i = 0; i < 52; i ++) {
        part = {};
        part.owner = result["owner"][i];
        part.others = result["all"][i] - result["owner"][i];
        part.total = result["all"][i];
        part.week = i+1;
        participationObj.push(part);
    }

    drawParticipation();
}

function processHourlyCommits(result) {
    // parse from JSON to something useful for D3
    hourlyCommitsObj = [];
    var DaysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var HoursOfDay = ["8:00~9:00", "9:00~10:00", "10:00~11:00", "11:00~12:00", "12:00~13:00", "13:00~14:00", "14:00~15:00","15:00~16:00","16:00~17:00","17:00~18:00"];
    $.each(result, function(i, dataset) {
        if (dataset[1] >= 8 && dataset[1] < 18) {
            var hourlyCommit = {};
            hourlyCommit["days"] = DaysOfWeek[dataset[0]];
            hourlyCommit["hour"] = HoursOfDay[(dataset[1]-8)];
            hourlyCommit["commits"] = dataset[2];
            hourlyCommitsObj.push(hourlyCommit);
        }
    });

    drawHourlyCommits();
}

function processRepoLanguages() {
    // parse from JSON to something useful for D3
    languages = {};
    languagesObj = [];
    dataObj = [];

    $.each(data, function(i, dataset) {
        temp = [];
        for (var k in dataset) {
            if (!(k in languages)) {
                languages[k] = 0;
            }
            languages[k] += dataset[k];
            temp.push({
                language: k,
                count: dataset[k]
            });
        }
        if (temp.length > 0) dataObj.push(temp);
    })

    for (var k in languages) {
        languagesObj.push({
            language: k,
            count: languages[k]
        });
    }

    d3.selectAll("svg").remove();
    $('#graph h3').html('');
    $('#graph svg').html('');
    $('#graph tooltip').html('');
    $("#subgraph div").html("");
    $("#subgraph h3").html("");
    $("#subgraph svg").html("");

    $("#graph").append("<h3>Overall</h3>");
    drawRepoLanguages(languagesObj, '#graph', 650, 650, 75, 18, 4, 30, 150, -20);
    $("#subgraph").append("<h3>Individual Statistics</h3>");
    $.each(dataObj, function(i, repo) {
        drawRepoLanguages(repo, "#subgraph", 300, 300, 50, 8, 2, 15, 40, -10);
    })
}
