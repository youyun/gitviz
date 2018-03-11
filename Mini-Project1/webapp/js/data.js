function getData() {
    // rest call
}

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
    // https://api.github.com/users/torvalds/repos
    $.get("https://api.github.com/users/"+owner+"/repos?access_token=" + localStorage.getItem("token"), function (result) {
        console.log(result);
    })
    .fail(function() {
        alert( "error" );
    });

    // Step 2: get bytes of languages for each repo
    // GET /repos/:owner/:repo/languages
    // https://api.github.com/repos/torvalds/libdc-for-dirk/languages
    // https://api.github.com/repos/torvalds/linux/languages
    // https://api.github.com/repos/torvalds/pesconvert/languages
    // https://api.github.com/repos/torvalds/subsurface-for-dirk/languages
    // https://api.github.com/repos/torvalds/test-tlb/languages
    // https://api.github.com/repos/torvalds/uemacs/languages
}