# combined-stream

A stream that emits multiple other streams one after another.

## Installation

This module is not ready yet.

## Usage

Here is a simple example that shows how you can use combined-stream to combine
two files into one:

``` javascript
var CombinedStream = require('combined-stream');
var fs = require('fs');

var combinedStream = CombinedStream.create();
combinedStream.append(fs.createReadStream('file1.txt'));
combinedStream.append(fs.createReadStream('file2.txt'));

combinedStream.pipe(fs.createWriteStream('combined.txt'));
```

While the example above works great, it will buffer any `'data'` events emitted
by the second file, until the first file has finished emitting. So a more
efficient way is to provide the streams via a callback:

``` javascript
var CombinedStream = require('combined-stream');
var fs = require('fs');

var combinedStream = CombinedStream.create();
combinedStream.append(function(next) {
  next(fs.createReadStream('file1.txt'));
});
combinedStream.append(function(next) {
  next(fs.createReadStream('file2.txt'));
});

combinedStream.pipe(fs.createWriteStream('combined.txt'));
```

Last but not least, you can also ask combined-stream to apply back pressure
to the queued streams as neccesary to minimize buffering:

``` javascript
var CombinedStream = require('combined-stream');
var fs = require('fs');

var combinedStream = CombinedStream.create({pauseStreams: true});
combinedStream.append(fs.createReadStream('file1.txt'));
combinedStream.append(fs.createReadStream('file2.txt'));

combinedStream.pipe(fs.createWriteStream('combined.txt'));
```

In the case of files that is probably the best of the 3 approaches. But if you
are dealing with streams that you don't want to slow down, you should consider
either approach #1 or #2.
