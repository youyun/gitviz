var data = [];
var contributors = {};
var hourlyCommits = {};
var languages = {};

function getContributors() {
    // GET /repos/:owner/:repo/stats/contributors
    var owner = $("#owner").val();
    var repo = $("#repository").val();

    $.get("https://api.github.com/repos/"+owner+"/"+repo+"/stats/contributors?access_token=" + localStorage.getItem("token"), function (result) {
        console.log(result);
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
        console.log(result);
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
        console.log("result", result);        
        localStorage.totalRepo = result.length;

        // Step 2: get bytes of languages for each repo
        // GET /repos/:owner/:repo/languages
        $.each(result, function(i, repo) {
            $.get("https://api.github.com/repos/"+owner+"/"+repo.name+"/languages?access_token=" + localStorage.getItem("token"), function (result) {
                console.log("before", data);
                data.push(result);
                console.log("after", data);
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

function processRepoLanguages() {
    // parse from JSON to something useful for D3
    languages = {};

    $.each(data, function(i, dataset) {
        for (var k in dataset) {
            if (!(k in languages)) {
                languages[k] = 0;
            }
            languages[k] += dataset[k];
        }
    })
}