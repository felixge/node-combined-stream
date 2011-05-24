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

While the example above works great, it will pause all source streams until
they are needed. If you don't want that to happen, you can set `pauseStreams`
to `false`:

``` javascript
var CombinedStream = require('combined-stream');
var fs = require('fs');

var combinedStream = CombinedStream.create({pauseStreams: false});
combinedStream.append(fs.createReadStream('file1.txt'));
combinedStream.append(fs.createReadStream('file2.txt'));

combinedStream.pipe(fs.createWriteStream('combined.txt'));
```

However, what if you don't have all the source streams yet, or you don't want
to allocate the resources (file descriptors, memory, etc.) for them right away?
Well, in that case you can simply provide a callback that supplies the stream
by calling a `next()` function:

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

## License

combined-stream is licensed under the MIT license.
