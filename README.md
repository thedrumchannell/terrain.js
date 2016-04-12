# Terrain.js

A class for generating random infinite height maps using the diamond-square algorithm.

![terrain.js](http://i.imgur.com/atdiNCA.png?1)

## Basic usage

````javascript
/**
 * Returns a random integer between min and max
 */

var randomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// create a 256 x 256 terrain map
var map = new Terrain(0, 0, 256, randomInt(1000000, 9999999), 12, 1);
```

### Control heights outside of boundries

```javascript
// update the boundries
map.updateBoundries({ x: 0, y: 0, width: 256, height: 256, value: 0.16 });
```

### Add preset heights

```javascript
// add preset values
map.addPresets([{ x: 128, y: 128, value: 0.5 }]);
```
