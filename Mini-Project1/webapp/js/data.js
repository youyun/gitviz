function getData() {
    // rest call
}

function processData() {
    // parse from JSON to something useful for D3
}

function getContributors() {
    // GET /repos/:owner/:repo/stats/contributors
    // https://api.github.com/repos/torvalds/linux/stats/contributors
}

function getHourlyCommits() {
    // GET /repos/:owner/:repo/stats/punch_card
    // https://api.github.com/repos/torvalds/linux/stats/punch_card
}

function getRepoLanguages() {
    // Step 1: get all repos
    // GET /users/:username/repos
    // https://api.github.com/users/torvalds/repos

    // Step 2: get bytes of languages for each repo
    // GET /repos/:owner/:repo/languages
    // https://api.github.com/repos/torvalds/libdc-for-dirk/languages
    // https://api.github.com/repos/torvalds/linux/languages
    // https://api.github.com/repos/torvalds/pesconvert/languages
    // https://api.github.com/repos/torvalds/subsurface-for-dirk/languages
    // https://api.github.com/repos/torvalds/test-tlb/languages
    // https://api.github.com/repos/torvalds/uemacs/languages
}