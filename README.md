# Terrain.js

A class for generating random infinite height maps using the diamond-square algorithm

## Basic usage

```javascript
// create a 512 x 512 terrain map
var map = new Terrain(0, 0, 512, randomInt(1000000, 9999999), 12, 1);
```

```javascript
// optional: update the boundries
map.updateBoundries({ x: 0, y: 0, width: 512, height: 512, value: 0.2 });

// optional: add preset values
map.addPresets([{ x: 256, y: 256, value: 0.5 }]);
```