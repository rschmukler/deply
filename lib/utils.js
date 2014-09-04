var extend = require('extend');

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
    console.error('[error] Could not find config at path: ' + path);
    process.exit(1);
  }
};
