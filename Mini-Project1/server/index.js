var AuthURL = "https://github.com/login/oauth/authorize";
var AccessTokenURL = "https://github.com/login/oauth/access_token";
var ClientID = "e3a6a83c52ebd43d0f14";
var ClientSecret = "ca543991057c4102dc37423f046b8a4540c1a97e";

var githubOAuth = require('github-oauth')({
  githubClient: "e3a6a83c52ebd43d0f14",
  githubSecret: "ca543991057c4102dc37423f046b8a4540c1a97e",
  baseURL: 'http://localhost:3001',
  loginURI: '/login',
  callbackURI: '/callback',
  scope: 'user' // optional, default scope is set to user 
})
 
require('http').createServer(function(req, res) {
  if (req.url.match(/login/)) return githubOAuth.login(req, res)
  if (req.url.match(/callback/)) return githubOAuth.callback(req, res)
}).listen(3001)
 
githubOAuth.on('error', function(err) {
  console.error('there was a login error', err)
})

githubOAuth.on('token', function(token, serverResponse) {
  console.log('here is your shiny new github oauth token', token)
  serverResponse.end(JSON.stringify(token))
})
