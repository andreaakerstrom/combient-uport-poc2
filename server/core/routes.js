/**
 *  TestApp
 *  Core
 *
 *
 */

var express = require('express');

module.exports = function (app) {
  // Controlers
  var spa = require('../controllers/spa_controller')(app);

  //spa
  app.get('/connect',        spa.index );
  app.get('/sign',  spa.index );

  return app;
}
