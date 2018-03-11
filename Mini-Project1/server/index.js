'use strict';

// basic setup
var http = require('http'),
    express = require('express'),
    pg = require('pg'),
    format = require('pg-format'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    helmet = require('helmet');

var app = express();
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());    
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', 3001);

var AuthURL = "https://github.com/login/oauth/authorize";
var AccessTokenURL = "https://github.com/login/oauth/access_token";
var ClientID = "e3a6a83c52ebd43d0f14";
var ClientSecret = "ca543991057c4102dc37423f046b8a4540c1a97e";

// set for unknown url
app.use(function(req, res) {
  var allowedOrigins = ['http://127.0.0.1:4280', 'http://localhost:4280'];
  var origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
      logger.info("Request is from origin");
      res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);

  res.status(404).send({url: req.originalUrl + ' not found'});
});

// create server
http.createServer(app).listen(app.get('port'), function() {
});