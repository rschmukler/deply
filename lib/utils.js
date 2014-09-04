var extend = require('extend'),
    chalk = require('chalk');


var utils = exports;

exports.readConfigFor = function readConfigFor(env, path) {
  try {
    var config = require(path);
    var newConfig = extend({}, config);

    for(var key in newConfig) {
      if(newConfig[key].hasOwnProperty(env)) {
        newConfig[key] = newConfig[key][env];
      }
    }

    return newConfig;
  } catch(e) {
    utils.log.error('Could not find config at path: ' + path);
    process.exit(1);
  }
};

exports.log = {
  error: function logError(from, text) {
    if(!text) { 
      text = from; 
      from = undefined;
    }
    var fromStr = from ? ' [' + chalk.green(from) + '] ' : ' ';
    console.error('[' + chalk.red('error') + ']' + fromStr + text);
  },
  info: function logInfo(from, text) {
    if(!text) { 
      text = from; 
      from = undefined;
    }
    var fromStr = from ? ' [' + chalk.green(from) + '] ' : ' ';
    console.log('[' + chalk.blue('info') + ']' + fromStr + text);
  }
};

exports.errorAndExit = function(from, err) {
  if(!err) { err = from; from = undefined; }
  var message = err.message || err;
  utils.log.error(from, message);
  process.exit(1);
};
