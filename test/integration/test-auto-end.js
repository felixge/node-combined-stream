var common = require('../common');
var assert = common.assert;
var CombinedStream = common.CombinedStream;
var fs = require('fs');

var FILE1 = common.dir.fixture + '/file1.txt';
var FILE2 = common.dir.fixture + '/file2.txt';
var EXPECTED = fs.readFileSync(FILE1) + fs.readFileSync(FILE2);

(function testAutoEnd() {
  var combinedStream = CombinedStream.create({autoEnd: false});
  var stream = fs.createReadStream(FILE1);
  combinedStream.append(stream);

  var ended = false;
  combinedStream.on('end', function() {
    ended = true;
  });

  stream.on('end', () => {
    setImmediate(() => {
        assert.ok(!ended);

        var stream2 = fs.createReadStream(FILE2);
        stream2.on('end', () => {
          assert.ok(!ended);

          combinedStream.end();
        });
        combinedStream.append(stream2);
    });
  });

  var tmpFile = common.dir.tmp + '/combined.txt';
  var dest = fs.createWriteStream(tmpFile);
  combinedStream.pipe(dest);

  dest.on('end', function() {
    var written = fs.readFileSync(tmpFile, 'utf8');
    assert.strictEqual(written, EXPECTED);
  });

  process.on('exit', () => {
    assert.ok(ended);
  });
})();
