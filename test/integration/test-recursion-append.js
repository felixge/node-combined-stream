var common = require('../common');
var assert = common.assert;
var CombinedStream = common.CombinedStream;

var s = CombinedStream.create();

for (var i = 0; i < 1e4; i++)
    s.append('test');

// Shouldn't throw "RangeError: Maximum call stack size exceeded"
s.resume();
