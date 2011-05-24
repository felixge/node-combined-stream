# stream-sequence

A stream that emits multiple other streams one after another.

## Installation

This module is not ready yet.

## Usage

Here is a simple example that shows how you can use stream-sequence to combine
two files into one:

``` javascript
var StreamSequence = require('stream-sequence');
var fs = require('fs');

var streamSequence = StreamSequence.create();
streamSequence.append(fs.createReadStream('file1.txt'));
streamSequence.append(fs.createReadStream('file2.txt'));

streamSequence.pipe(fs.createWriteStream('combined.txt'));
```

While the example above works great, it will buffer any `'data'` events emitted
by the second file, until the first file has finished emitting. So a more
efficient way is to provide the streams via a callback:

``` javascript
var StreamSequence = require('stream-sequence');
var fs = require('fs');

var streamSequence = StreamSequence.create();
streamSequence.append(function() {
  // You can either return streams directly
  return fs.createReadStream('file1.txt');
});
streamSequence.append(function(next) {
  setTimeout(function() {
    // Or provide them to the next() function in an async fashion
    next(fs.createReadStream('file2.txt'));
  }, 100);
});

streamSequence.pipe(fs.createWriteStream('combined.txt'));
```

Last but not least, you can also ask stream-sequence to apply back pressure
to the queued streams as neccesary to minimize buffering:

``` javascript
var StreamSequence = require('stream-sequence');
var fs = require('fs');

var streamSequence = StreamSequence.create({pauseStreams: true});
streamSequence.append(fs.createReadStream('file1.txt'));
streamSequence.append(fs.createReadStream('file2.txt'));

streamSequence.pipe(fs.createWriteStream('combined.txt'));
```

In the case of files that is probably the best of the 3 approaches. But if you
are dealing with streams that you don't want to slow down, you should consider
either approach #1 or #2.
