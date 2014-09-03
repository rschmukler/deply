var noop = function() { };

var Deployment = module.exports = function Deployment(config) {
  this._config = config;

  var Src = dynamicLoad(config.adapters.source, 'source'),
      Dest = dynamicLoad(config.adapters.dest, 'destination');

  this._source = new Src(config);
  this._dest = new Dest(config);
};

Deployment.prototype.deploy = function(cb) {
  cb = cb || noop;
  var source = this._source,
      dest = this._dest,
      config = this._config;

  source.prepare(function(err) {
    if(err) return cb(err);
    dest.deploy(config, cb);
  });
};

function dynamicLoad(file, what) {
  try {
    var requirePath = './' + what + 's/' + file + '.js';
    var module =  require(requirePath);
    return module;
  } catch(e) {
    throw new Error('Invalid ' + what + ' specified: ' + file);
  }
}
