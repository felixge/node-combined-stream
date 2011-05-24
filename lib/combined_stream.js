var util = require('util');
var Stream = require('stream').Stream;
var DelayedStream = require('delayed-stream');

module.exports = CombinedStream;
function CombinedStream() {
  this.writable = false;
  this.readable = true;
  this.maxDataSize = 2 * 1024 * 1024;
  this.pauseStreams = true;

  this._streams = [];
  this._currentStream = null;
}
util.inherits(CombinedStream, Stream);

CombinedStream.create = function(options) {
  var combinedStream = new this();
  options = options || combinedStream;

  combinedStream.pauseStreams = options.pauseStreams;
  combinedStream.maxDataSize = options.maxDataSize;

  return combinedStream;
};

CombinedStream.prototype.__defineGetter__('dataSize', function() {
  if (!this._currentStream) {
    return 0;
  }

  return this._currentStream.dataSize;
});

CombinedStream.prototype.append = function(stream) {
  if (typeof stream !== 'function') {
    if (!(stream instanceof DelayedStream)) {
      stream = DelayedStream.create(stream, this.maxDataSize);
    }

    this._register(stream);

    if (this.pauseStreams) {
      stream.pause();
    }
  }

  this._streams.push(stream);
  return this;
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
    this._register(stream);
    this._pipeNext(stream);
  }.bind(this));
};

CombinedStream.prototype._pipeNext = function(stream) {
  this._currentStream = stream;

  stream.on('end', this._getNext.bind(this))
  stream.pipe(this, {end: false});
};

CombinedStream.prototype._register = function(stream) {
  var self = this;
  stream.on('error', function(err) {
    self._reset();
    self.emit('error', err);
  });

  if (!this._currentStream) {
    this._currentStream = stream;
  }
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
  this._reset();
  this.emit('end');
};

CombinedStream.prototype.destroy = function() {
  this._reset();
  this.emit('close');
};

CombinedStream.prototype._reset = function() {
  this.writable = false;
  this._streams = [];
  this._currentStream = null;
};
