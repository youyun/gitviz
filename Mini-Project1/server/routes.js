'use strict';

module.exports = function(app) {
  var ctrl = require('./controller');

  app.route('/login')
      .get(ctrl.login);

  app.route('/callback')
      .get(ctrl.callback);
};