var common = require('../common');
var assert = common.assert;
var CombinedStream = common.CombinedStream;
var fs = require('fs');
var LARGE = common.dir.fixture + '/large.txt';
var FILE1 = common.dir.fixture + '/file1.txt';

var Readable = require('stream').Readable;
var Writable = require('stream').Writable;

var rss = process.memoryUsage().rss;
var ws = Writable();
ws._write = function (chunk, enc, next) {
  setTimeout(function() {
    var rssDiff = process.memoryUsage().rss - rss;
    fs.unlink(LARGE, function(){});
    assert.ok(rssDiff < totalSize);
    process.exit();
    next();
  }, 5000);
  return false;
};

var rs = Readable();
var totalSize = 1024 * 1024 * 500; // 500MB
var readBytes = 0;

rs._read = function(n) {
  var buff = new Buffer(n);
  this.push(buff);
  readBytes += n;
  if (readBytes > totalSize) this.push(null);
};

rs.pipe(fs.createWriteStream(LARGE)).on('finish', function() {
  var combinedStream = CombinedStream.create();
  combinedStream.append(fs.createReadStream(FILE1));
  combinedStream.append(fs.createReadStream(LARGE));

  combinedStream.pipe(ws);
});