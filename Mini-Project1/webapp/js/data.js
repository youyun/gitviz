var data = [];
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
        participationObj.push(part);
    }

    drawParticipation();
}

function processHourlyCommits(result) {
    // parse from JSON to something useful for D3
    hourlyCommitsObj = [];
    var DaysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    $.each(result, function(i, dataset) {
        if (dataset[1] >= 8 && dataset[1] < 18) {
            var hourlyCommit = {};
            hourlyCommit["days"] = DaysOfWeek[dataset[0]];
            hourlyCommit["hour"] = dataset[1];
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

    $.each(data, function(i, dataset) {
        for (var k in dataset) {
            if (!(k in languages)) {
                languages[k] = 0;
            }
            languages[k] += dataset[k];
        }
    })

    for (var k in languages) {
        languagesObj.push({
            language: k,
            count: languages[k]
        });
    }

    drawRepoLanguages();
}
