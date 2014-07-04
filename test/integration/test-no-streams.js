var common = require('../common');
var assert = common.assert;
var CombinedStream = common.CombinedStream;

var s
var recorder;

var EXPECTED = [];

// no append calls
s = CombinedStream.create();
recorder = new common.RecorderStream();
s.pipe(recorder);
s.resume();
assert.deepEqual(recorder.data, EXPECTED);

s.pipe(recorder);
s.resume();
assert.deepEqual(recorder.data, EXPECTED);

// append call w/o arguments
s = CombinedStream.create();
recorder = new common.RecorderStream();
s.append();
s.pipe(recorder);
s.resume();
assert.deepEqual(recorder.data, EXPECTED);

s.pipe(recorder);
s.resume();
assert.deepEqual(recorder.data, EXPECTED);

// failed append call
s = CombinedStream.create();
recorder = new common.RecorderStream();
s.append(function(next) {
  // don't append a stream:
  next();
});

s.pipe(recorder);
s.resume();
assert.deepEqual(recorder.data, EXPECTED);

