/**
 *  TestApp
 *
 * Library
 *
 * LOGGER
 *
 */

var lib = {};

// Constructor
module.exports = function (_app) {
  return lib;
}

/**
 * @param   {String} msg
 *
 * @api     public
 *
 * @summary Escribe un log
 */
lib.log = function () {
  if (process.env.NODE_ENV !== 'test') {
    console.log.apply(console, arguments);
  } else {
    // TODO: write to file?
  }
}
