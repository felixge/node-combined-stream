var common = require('../common');
var assert = common.assert;
var CombinedStream = common.CombinedStream;

var s = CombinedStream.create();
var recorder = new common.RecorderStream();

var EXPECTED = [
  'foo',
  undefined,
  3,
  null,
  { bar: 'bar' }
];

EXPECTED.forEach(s.append, s);

EXPECTED.push(undefined);
s.append(function(done) {
  done(undefined);
});

s.append(function(done) {
  // don't append anything
  done();
});

EXPECTED.push('foobar');
s.append(function(done) {
  done('foobar');
});

EXPECTED.push(null);
s.append(function(done) {
  done(null);
});

s.pipe(recorder);
s.resume();
assert.deepEqual(recorder.data, EXPECTED);
