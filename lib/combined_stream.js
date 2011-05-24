var util = require('util');
var Stream = require('stream').Stream;
var DelayedStream = require('delayed-stream');

module.exports = CombinedStream;
function CombinedStream() {
  this.writable = false;
  this.readable = true;
  this.pauseStreams = true;

  this._streams = [];
}
util.inherits(CombinedStream, Stream);

CombinedStream.create = function(options) {
  var combinedStream = new this();
  options = options || combinedStream;

  combinedStream.pauseStreams = options.pauseStreams;

  return combinedStream;
};

CombinedStream.prototype.append = function(stream) {
  if (typeof stream !== 'function') {
    if (!(stream instanceof DelayedStream)) {
      stream = DelayedStream.create(stream);
    }

    if (this.pauseStreams) {
      stream.pause();
    }
  }

  this._streams.push(stream);
};

CombinedStream.prototype.pipe = function(dest, options) {
  Stream.prototype.pipe.call(this, dest, options);
  this.release();
};

CombinedStream.prototype.release = function() {
  this.writable = true;
  this._getNext();
};

CombinedStream.prototype._getNext = function() {
  var stream = this._streams.shift();
  if (!stream) {
    this.end();
    return;
  }

  if (typeof stream !== 'function') {
    this._pipeNext(stream);
    return;
  }

  var getStream = stream;
  getStream(function(stream) {
    this._pipeNext(stream);
  }.bind(this));
};

CombinedStream.prototype._pipeNext = function(stream) {
  stream.on('end', function() {
    this._getNext();
  }.bind(this));

  stream.pipe(this, {end: false});
};

CombinedStream.prototype.write = function(data) {
  this.emit('data', data);
};

CombinedStream.prototype.pause = function() {
  if (!this.pauseStreams) {
    return;
  }

  this.emit('pause');
};

CombinedStream.prototype.resume = function() {
  this.emit('resume');
};

CombinedStream.prototype.end = function() {
  this.writable = false;
  this._streams = [];
  this.emit('end');
};
