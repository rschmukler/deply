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
  error: function logError(text) {
    console.error('[' + chalk.red('error') + '] ' + text);
  },
  info: function logInfo(text) {
    console.log('[' + chalk.blue('info') + '] ' + text);
  }
};

exports.errorAndExit = function(err) {
  var message = err.message || err;
  utils.log.error(message);
  process.exit(1);
};
