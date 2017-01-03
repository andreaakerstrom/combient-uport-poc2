/**
 *  TestApp
 *
 *  Core
 *
 *  Error Handlers
 *
 *  Route handlers for HTTP `404` and HTTP `500`
 */

var logger = require('../lib/logger')();

module.exports = function (app){

  app.use(function error500 (err, req, res, next) {
    logger.log('\x1b[31mERROR: \n----------------------------------------\x1b[0m');
    if (err.stack) {
      logger.log(err.stack);
    } else {
      logger.log(err);
    }

    res.statusCode = 500;
    //return sendHTML(res, 'error/500.html');
    return res.send(err)
  });

  app.use(function error404 (req, res, next) {
    res.statusCode = 404;
    //return sendHTML(res, 'error/404.html');
    return res.send("Not found! / Nada por aqui!");
  });

  return app;
}

/**
 * @res     {Object} res
 * @param   {String} path
 *
 * @api     private
 *
 * @summary Envía al cliente un archivo html
 */
function sendHTML (res, path) {
  return res.sendfile(viewsPath + path);
}
