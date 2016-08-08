### Describe-loader


`describe-loader` auto-magically wrap the body of the describe expression in a describe with the path of the file (`__filename`).

#### Install | Getting started

- __Install describe-loader__
`npm install --save-dev describe-loader`

- First you need to ensure that [__filename](https://webpack.github.io/docs/api-in-modules.html#__filename) is set to true otherwise `__filename` will always be `index.js`.

```javascript
// in webpack.config

node: {
  __filename: true
}
```

- Apply loader for `.jsx?$` or whatever extension you have

```javascript
// in webpack.config

module: {
  preLoaders: [{}],
  loaders: [{}],
  postLoaders: [{
    test: /\.jsx?$/,
    include: /src/,
    exclude: /node_modules/,
    loader: 'describe'
  }]
}
```


### The output

_before:_
```javascript
var Component = require('component_name.jsx');
var $ = require('jquery');

describe('First describe', function() {
  describe('Deep describe', function() {
    beforeEach(function() {
      // do something
    });

    it('should be ok', function() {
      expect(1).to.equal(1);
    });
  });
});
```
_after:_
```javascript
var Component = require('component_name.jsx');
var $ = require('jquery');

describe('First describe', function() {
  describe('Path ' + __filename, function() {
    describe('Deep describe', function() {
      beforeEach(function() {
        // do something
      });

      it('should be ok', function() {
        expect(1).to.equal(1);
      });
    });
  });
});
```
