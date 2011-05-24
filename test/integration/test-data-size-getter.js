var common = require('../common');
var assert = common.assert;
var CombinedStream = common.CombinedStream;

(function testDataSizeGetter() {
  var combinedStream = CombinedStream.create();

  assert.strictEqual(combinedStream.dataSize, 0);

  combinedStream._currentStream = {dataSize: 10};
  assert.strictEqual(combinedStream.dataSize, 10);
})();
