var exec = require('child_process').exec,
    mkdirp = require('mkdirp'),
    existsSync = require('fs').existsSync,
    utils = require('../utils'),
    noop = function() { };

var Git = module.exports = function Git(config) {
  this._config = config;
  this._repoDir = config.workingDir + 'current/';
  config.srcDir = this._repoDir;
};

Git.prototype.prepare = function(cb) {
  cb = cb || noop;
  var self = this;
  if(self.repoExists()) {
    self.fetchLatest(function() {
      self.checkout(cb);
    });
  } else {
    mkdirp.sync(this._repoDir);
    self.cloneRepo(function(err) {
      if(err) return cb(err);
      self.checkout(cb);
    });
  }
};

Git.prototype.fetchLatest = function(cb) {
  utils.log.info('git', 'fetching latest commits');
  var repoDir = this._repoDir;
  exec('git pull', { cwd: repoDir }, function(err) {
    if(err) utils.errorAndExit('git', 'could not fetch latest version of repo');
    cb();
  });
};

Git.prototype.cloneRepo = function(cb) {
  var src = this._config.source.repo,
      repoDir = this._repoDir;

  var cmd = 'git clone ' + src + ' ' + repoDir;
  utils.log.info('git', 'cloning repo ' + src + ' to ' + repoDir);
  exec(cmd, function(err, stdout) {
    if(err) utils.errorAndExit('git', err);
    cb(null);
  });
};

Git.prototype.checkout = function(cb) {
  var branch = this._config.args[0] || this._config.source.branch || 'master';
  utils.log.info('git', 'checking out ' + branch);
  exec('git checkout ' + branch, { cwd: this._repoDir }, function(err) {
    if(err) utils.errorAndExit('git', 'failed to checkout ' + branch);
    cb(null);
  });
};

Git.prototype.repoExists = function() {
  return existsSync(this._repoDir + '/.git');
};
