/**
 * TestApp
 *
 * Spa Controller
 *
 */


var app,
    path = require('path'),
    controller = {};

module.exports = function (_app) {
  app            = _app;
  return controller;
}

controller.index = function (req, res, next) {
  return res.sendFile(path.join(app.get("staticPath"),'index.html'));
}
