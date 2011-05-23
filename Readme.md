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
streamSequence.append(function(cb) {
  cb(null, fs.createReadStream('file1.txt'));
});
streamSequence.append(function() {
  cb(null, fs.createReadStream('file2.txt'));
});

streamSequence.pipe(fs.createWriteStream('combined.txt'));
```


