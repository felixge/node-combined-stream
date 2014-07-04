var common = module.exports;

var path = require('path');
var fs = require('fs');
var util = require('util');
var Stream = require('stream').Stream;
var root = path.join(__dirname, '..');

common.dir = {
  fixture: root + '/test/fixture',
  tmp: root + '/test/tmp',
};

// Create tmp directory if it does not exist
// Not using fs.exists so as to be node 0.6.x compatible
try {
  fs.statSync(common.dir.tmp);
}
catch (e) {
  // Dir does not exist
  fs.mkdirSync(common.dir.tmp);
}

common.CombinedStream = require(root);
common.assert = require('assert');


function RecorderStream() {
  if (!(this instanceof RecorderStream)) {
    return new RecorderStream();
  }
  this.writable = true;
  this.data = [];
}
util.inherits(RecorderStream,Stream);

RecorderStream.prototype.write = function(chunk,encoding) {
  this.data.push(chunk);
  this.emit('data',chunk);
}

RecorderStream.prototype.end = function(chunk,encoding) {
  this.emit('end');
}

RecorderStream.prototype.toString = function(){
  return this.data;
}

common.RecorderStream = RecorderStream;
