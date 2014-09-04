var utils = require('./utils'),
    noop = function() { };

var Deployment = module.exports = function Deployment(config) {
  this._config = config;

  var Src = dynamicLoad(config.adapters.source, 'source'),
      Transform = dynamicLoad(config.adapters.transform, 'transformer'),
      Dest = dynamicLoad(config.adapters.dest, 'destination');

  this._source = new Src(config);
  this._transform = new Transform(config);
  this._dest = new Dest(config);
};

Deployment.prototype.deploy = function(cb) {
  cb = cb || noop;
  var source = this._source,
      transform = this._transform,
      dest = this._dest,
      config = this._config;

  source.prepare(function() {
    transform.run(function() {
      dest.deploy(cb);
    });
  });
};

function dynamicLoad(file, what) {
  try {
    var requirePath = './' + what + 's/' + file + '.js';
    var module =  require(requirePath);
    return module;
  } catch(e) {
    utils.errorAndExit('Invalid ' + what + ' specified: ' + file);
  }
}
