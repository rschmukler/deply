var exec = require('child_process').exec,
    mkdirp = require('mkdirp'),
    existsSync = require('fs').existsSync,
    noop = function() { };

var Git = module.exports = function Git(config) {
  this._config = config;
  this._repoDir = config.workingDir + '/src/';
};

Git.prototype.prepare = function(cb) {
  cb = cb || noop;
  var self = this;
  if(self.repoExists()) {
    self.checkout(cb);
  } else {
    mkdirp.sync(this._repoDir);
    self.cloneRepo(function(err) {
      if(err) return cb(err);
      self.checkout(cb);
    });
  }
};

Git.prototype.cloneRepo = function(cb) {
  var src = this._config.source.repo,
      repoDir = this._repoDir;

  var cmd = 'git clone ' + src + ' ' + repoDir;
  exec(cmd, function(err, stdout) {
    if(err) return cb(err);
    cb(null);
  });
};

Git.prototype.checkout = function(cb) {
};

Git.prototype.repoExists = function() {
  return existsSync(this._repoDir + '/.git');
};
