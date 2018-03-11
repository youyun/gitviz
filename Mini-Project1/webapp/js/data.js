var data = [];

function processData() {
    // parse from JSON to something useful for D3
}

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
        console.log(result);
        data = [];
        localStorage.totalRepo = result.length;
        localStorage.actualRepo = 0;

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

function getData() {
    $.when(getRepoLanguages()).done(function(result){
        var check = function(){
            if (localStorage.totalRepo > 0 && localStorage.totalRepo == localStorage.actualRepo){
                console.log(data);
            }
            else {
                setTimeout(check, 500); // check again in a second
            }
        }

        check();
    });
}