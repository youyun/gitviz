var data = [];
var dataObj = [];
var participationObj = [];
var hourlyCommitsObj = [];
var languages = {};
var languagesObj = [];


/*functions to load data*/
function loadData() {
    $.getJSON("../Mini-project-2-data.json", function(json) {
        console.log(json); // this will show the info it in firebug console
    });
}


/*functions to process data*/
function processParticipation(result) {
    
}

function processHourlyCommits(result) {
    // parse from JSON to something useful for D3
    
}

function processRepoLanguages() {
    // parse from JSON to something useful for D3
    
}
