/**
 *  TestApp
 *
 *  Environment
 *
 *
 */

var express             = require('express'),
    bodyParser          = require("body-parser"),
    http                = require('http'),
    logger              = require('../lib/logger')(),
    packageJSON         = require('../../package.json'),
    path                = require('path');

// Check blockchain
var blockchain = process.env.BLOCKCHAIN;
if(blockchain==undefined) blockchain = 'local';

if (blockchain !== 'mainnet' &&
    blockchain !== 'ropsten' &&
    blockchain !== 'consensysnet' &&
    blockchain !== 'local') {
  throw new Error('blockchain "'+blockchain+'" not supported! - EXIT!');
}

module.exports = function (app) {
  //Logger
  //app.use(express.logger({format : 'dev'}));

  // Set cookieParser, session, bodyParser and csrf middleware
  //app.use(express.cookieParser());
  /*
  app.use(
    express.session(
      { secret : 'a29208b23abeb2099b3f24e0d53a8a36875cb43c',
        store  : new express.session.MemoryStore
      }
    ));
  */
  //app.use(express.bodyParser());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  /*
   *
   * Set version, host, port
   *
   */

  app.set("blockchain",blockchain);


  var GETH_ENDPOINT;
  var NETWORK_ID;
  if (blockchain === 'mainnet') {
    GETH_ENDPOINT = 'https://mainnet.infura.io:8545';
    NETWORK_ID = '1';
  } else if (blockchain === 'ropsten') {
    GETH_ENDPOINT = 'https://ropsten.infura.io:8545';
    NETWORK_ID = '2';
  } else if (blockchain === 'consensysnet') {
    GETH_ENDPOINT = 'https://consensysnet.infura.io:8545';
    NETWORK_ID = '161';
  } else if (blockchain === 'local') {
    GETH_ENDPOINT = 'http://localhost:8545';
    NETWORK_ID = 'default';
  }
  app.set('GETH_ENDPOINT',GETH_ENDPOINT);
  app.set('NETWORK_ID',NETWORK_ID);

  var PORT = process.env.PORT || 3000;
  app.set('version',  packageJSON.version);
  //app.set('host',     HOST);
  app.set('port',     PORT);

  // Set app directory (img, css, js)
  var staticPath=path.join(__dirname, '..', '..','build');
  app.set('staticPath', staticPath);
  app.use(express.static(staticPath));

  /**
   *
   * Acá repasamos las variables de ambiente configuradas
   *
   */
  logger.log (  '\x1b[1mBlockchain:\x1b[0m %s\n'+
                '\x1b[1mVersion:\x1b[0m %s\n'+
                '\x1b[1mPort:\x1b[0m %s\n'+
                '\x1b[1mGETH_ENDPOINT:\x1b[0m %s\n'+
                '\x1b[1mstaticPath:\x1b[0m %s\n',
    blockchain,
    app.get('version'),
    app.get('port'),
    app.get('GETH_ENDPOINT'),
    app.get('staticPath')
  );

  // Return
  return app;
}
