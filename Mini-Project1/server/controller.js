'use strict';

var AuthURL = "https://github.com/login/oauth/authorize";
var AccessTokenURL = "https://github.com/login/oauth/access_token";
var ClientID = "e3a6a83c52ebd43d0f14";
var ClientSecret = "ca543991057c4102dc37423f046b8a4540c1a97e";
var RedirectURI = "http://ec2-52-221-218-97.ap-southeast-1.compute.amazonaws.com:3001/callback"

var request = require('request');
var url = require('url')

exports.login = function(req, res) {
  console.log("login")
  
  var u = 'https://github.com/login/oauth/authorize'
      + '?client_id=' + ClientID
      + '&redirect_uri=' + RedirectURI
      ;
  // res.statusCode = 302
  // res.setHeader('location', u)
  // res.end()
  res.redirect(u);
}

exports.callback = function(req, res) {
  console.log("callback")
  var query = url.parse(req.url, true).query
  var code = query.code
  if (!code) res.status(400).send("Error");

  var u = 'https://github.com/login/oauth/access_token'
      + '?client_id=' + ClientID
      + '&client_secret=' + ClientSecret
      + '&code=' + code
      ;

  request.get({url:u, json: true}, function (err, tokenResp, body) {
    if (err) {
      console.log("error in callback")
      res.status(400).send("Error");
    }
    var jsonResult = JSON.stringify(tokenResp.body);
    res.header('Content-Type', 'application/json');
    res.status(200).send(jsonResult);
  })
}