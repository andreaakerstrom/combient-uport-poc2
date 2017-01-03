/**
 *  Application Launcher
 *
 */

var start = Date.now();
console.log('Loading...');

// Must be loaded at a very top level
require('./core/exceptions');

var app = require('./main')(),
    port   = app.get('port');

// Start!
app.start(port);

var diff = Date.now() - start;

console.log('Loading stage took ' + diff + ' ms');

console.log ( '\x1b[36mTestApp Server \x1b[90mv%s\x1b[0m running as ' +
              '\x1b[1m%s\x1b[0m on port %d',
              app.get('version'),
              app.get('env'),
              port
);
