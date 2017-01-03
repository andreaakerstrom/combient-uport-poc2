/**
 *  TestApp
 *  Core
 *
 *  Uncaught exceptions handlers
 *
 *  Catches exceptions, reporting them
 */

var logger = require('../lib/logger')();

process.on('uncaughtException', function(err) {
  logger.log("ERROR:");

  if (err.message) {
    logger.log('\nMessage: ' + err.message);
  }

  if (err.stack) {
    logger.log('\nStacktrace:');
    logger.log('----------------------------------');
    logger.log(err.stack);
  }
});
