var util = require('util');
var Stream = require('stream').Stream;
var DelayedStream = require('delayed-stream');

module.exports = StreamSequence;
function StreamSequence() {
  this.writable = true;
  this.readable = true;
  this._streams = [];
}
util.inherits(StreamSequence, Stream);

StreamSequence.create = function() {
  var streamSequence = new this();
  return streamSequence;
};

StreamSequence.prototype.append = function(stream) {
  //if (typeof stream !== 'function') {
    stream = DelayedStream.create(stream);
  //}

  this._streams.push(stream);
};

StreamSequence.prototype.pipe = function(dest, options) {
  Stream.prototype.pipe.call(this, dest, options);
  this.release();
};

StreamSequence.prototype.release = function() {
  this._pipeNext();
};

StreamSequence.prototype._pipeNext = function() {
  var stream = this._streams.shift();
  if (!stream) {
    this.end();
    return;
  }

  stream.on('end', function() {
    this._pipeNext();
  }.bind(this));

  stream.pipe(this, {end: false});
};

StreamSequence.prototype.write = function(data) {
  this.emit('data', data);
};

StreamSequence.prototype.pause = function() {
  this.emit('pause');
};

StreamSequence.prototype.resume = function() {
  this.emit('resume');
};

StreamSequence.prototype.end = function() {
  this.emit('end');
};
