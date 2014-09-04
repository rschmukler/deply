var exec = require('child_process').exec;

var utils = require('../utils.js');

var Shell = module.exports = function Shell(config) {
  this._config = config;
  this._srcDir = config.srcDir;
  this._cmds = config.transform.shell;
  if(!Array.isArray(this._cmds)) this._cmds = [this._cmds];
};

Shell.prototype.run = function(cb) {
  var cmds = this._cmds,
      srcDir = this._srcDir;

  (function runNextCmd(err) {
    if(err) utils.errorAndExit('shell', err);
    var cmd = cmds.shift();
    if(!cmd) return cb();
    utils.log.info('shell', "running " + cmd);
    exec(cmd, { cwd: srcDir, env: process.env }, runNextCmd);
  })();
};
