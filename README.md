# Terrain.js

A class for generating random infinite height maps using the diamond-square algorithm.

![terrain.js](http://i.imgur.com/atdiNCA.png?1)

## Basic usage

    /**
     * Returns a random integer between min and max
     */

    var randomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // create a 256 x 256 terrain map
    var map = new Terrain(0, 0, 256, randomInt(1000000, 9999999), 12, 1);

## Control heights outside of boundaries

    // set the boundaries
    map.setBoundaries(0, 0, 256, 256, 0.16);

## Add preset heights

    // add preset values
    map.addPreset(128, 128, 0.5);

## License

See the [LICENSE](https://github.com/thedrumchannell/terrain.js/blob/master/LICENSE) file.
