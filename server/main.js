/**
 * HashingWill
 *
 * Main Server File
 *
 */

// Dependencies
var express       = require('express'),
    webpack       = require('webpack'),
    webpackDevMiddleware       = require('webpack-dev-middleware'),
    webpackHotMiddleware       = require('webpack-hot-middleware'),
    environment   = require('./core/environment'),
    routes        = require('./core/routes'),
    events        = require('./core/events'),
    errors        = require('./core/errors'),
    elServer      = {};

module.exports = function () {
  var node_env = process.env.NODE_ENV || "development";

  var app = express();
  console.log("NODE_ENV:"+node_env);
  if(node_env=="development"){
    webpackConfig = require('../webpack.dev.config.js');
    const compiler = webpack(webpackConfig);

    app.use(webpackDevMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath,
      stats: { colors: true }
    }));

    app.use(webpackHotMiddleware(compiler, {
      log: console.log
    }));

  }

  // components
  elServer  = environment(app);

  routes(elServer);
  errors(elServer);

  // No declaremos los jobs, hasta que el servidor parta
  elServer.start = function (port, callback) {
    events(elServer);
    return elServer.listen(port, callback);
  }

  // La carga del core está lista
  return elServer;
}
