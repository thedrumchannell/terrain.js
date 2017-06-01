/**
 * Terrain.js 1.2.2
 * @copyright Copyright (c) 2015-2016 Brandon Channell
 * @license MIT License
 */

(function() {
    
    /**
     * A class for generating random infinite height maps using the diamond-square algorithm
     * @param {Number} x1 The x starting position
     * @param {Number} y1 The y starting position
     * @param {Number} size The width and height of this map, Ex: 256
     * @param {Number} seed The unique identifier value
     * @param {Number} roughness The amount of roughness used during generation
     * @param {Number} scale The amount of scaling used during generation
     */
    
    window.Terrain = function(x1, y1, size, seed, roughness, scale) {
        
        // extended map size
        var extended = size * Math.pow(2, scale) / 2 * 3 + 1,
            
            // array of height values
            heights = [],
        
            // array of preset values
            presets = [],
            
            // the boundaries object
            boundaries = {
                x: -Infinity,
                y: -Infinity,
                width: Infinity,
                height: Infinity
            };
    
        /**
         * Generates an array of heights for this terrain map
         * @return {Array} heights
         */
        
        this.generateHeights = function() {
            
            // step size
            var step = size * Math.pow(2, scale || 1) / 2,
                
                // step half (center)
                half = step / 2,
                
                // starting x position
                sx = Math.floor(x1 / step) * step - step,
                
                // starting y position
                sy = Math.floor(y1 / step) * step - step,
                
                // ending x position
                ex = step * 3 + sx,
    
                // ending y position
                ey = step * 3 + sy,

                // axis values
                x, y;
            
            // generate the base heights
            for (y = sy; y <= ey; y += step) {
                for (x = sx; x <= ex; x += step) {
                    this.generateHeight(x, y, this.normalize(this.displace(x, y, step)));
                }
            }
            
            while (half > 1) {
                
                // update half step
                half = step / 2;
                
                // only generate heights required for size
                if (step <= size) {
                    
                    // update start positions
                    sx = x1 - half;
                    sy = y1 - half;
                    
                    // update end positions
                    ex = x1 + size + half;
                    ey = y1 + size + half;
                } else {

                    // update start positions
                    sx += half;
                    sy += half;
                    
                    // update end positions
                    ex -= half;
                    ey -= half;
                }
                
                // generate diamonds
                for (y = sy; y <= ey; y += step) {
                    for (x = sx; x <= ex; x += step) {
                        this.generateDiamond(x, y, half, this.displace(x, y, step));
                    }
                }
                
                // generate squares
                for (y = sy; y <= ey; y += step) {
                    for (x = sx; x < ex; x += step) {
                        this.generateSquare(x + half, y, half, this.displace(x + half, y, step));
                    }
                }
                
                // generate squares
                for (y = sy; y < ey; y += step) {
                    for (x = sx; x <= ex; x += step) {
                        this.generateSquare(x, y + half, half, this.displace(x, y + half, step));
                    }
                }
                
                // update the step
                step /= 2;
            }
            
            return heights;
        };
         
        /**
         * Sets a generated value for given x and y position
         * @param {Number} x The x position
         * @param {Number} y The y position
         * @param {Number} value The generated value
         */
        
        this.generateHeight = function(x, y, value) {
            if (presets[x] && presets[x][y]) {
                this.setHeight(x, y, presets[x][y]);
            } else if (!this.inBoundaries(x, y)) {
                this.setHeight(x, y, boundaries.value);
            } else {
                this.setHeight(x, y, value);
            }
        };
        
        /**
         * Generates center points to create diamond patterns
         * @param {Number} x The x position
         * @param {Number} y The y position
         * @param {Number} half The half position
         * @param {Number} error The random offset value
         */
        
        this.generateDiamond = function(x, y, half, error) {
            this.generateHeight(x, y,
                this.normalize(((
                    this.getHeight(x - half, y - half) +
                    this.getHeight(x + half, y - half) +
                    this.getHeight(x - half, y + half) +
                    this.getHeight(x + half, y + half)
                ) / 4) + error)
            );
        };
        
        /**
         * Generates side points to create diamond patterns
         * @param {Number} x The x position
         * @param {Number} y The y position
         * @param {Number} half The half position
         * @param {Number} error The random offset value
         */
        
        this.generateSquare = function(x, y, half, error) {
            this.generateHeight(x, y,
                this.normalize(((
                    this.getHeight(x - half, y) +
                    this.getHeight(x + half, y) +
                    this.getHeight(x, y - half) +
                    this.getHeight(x, y + half)
                ) / 4) + error)
            );
        };
        
        /**
         * Returns a value for given x and y position
         * @param {Number} x The x position
         * @param {Number} y The y position
         * @return {Number} The value at x and y position
         */
        
        this.getHeight = function(x, y) {
            return heights[x][y];
        };
        
        /**
         * Returns the array of heights
         * @return {Array} heights
         */
        
        this.getHeights = function() {
            return heights;
        };
        
        /**
         * Sets a value for given x and y position
         * @param {Number} x The x position
         * @param {Number} y The y position
         * @param {Number} value The assigned value
         * @return {Terrain} Reference to this object for method chaining
         */
        
        this.setHeight = function(x, y, value) {
            (heights[x] = heights[x] || [])[y] = value;
            return this;
        };
         
        /**
         * Sets a preset value for x and y position
         * @param {Number} x The x position
         * @param {Number} y The y position
         * @param {Number} value The assigned value
         * @return {Terrain} Reference to this object for method chaining
         */
        
        this.addPreset = function(x, y, value) {
            (presets[x] = presets[x] || [])[y] = value;
            return this;
        };
         
        /**
         * Sets properties for the boundaries object
         * @param {Number} x The x position
         * @param {Number} y The y position
         * @param {Number} width The boundaries width
         * @param {Number} height The boundaries height
         * @param {Number} value The value assigned to heights outside boundaries
         * @return {Terrain} Reference to this object for method chaining
         */
        
        this.setBoundaries = function(x, y, width, height, value) {
            boundaries.x = x;
            boundaries.y = y;
            boundaries.width = width;
            boundaries.height = height;
            boundaries.value = value;
            return this;
        };
        
        /**
         * Returns true if given x and y position are inside the boundaries
         * @param {Number} x The x position
         * @param {Number} y The y position
         */
        
        this.inBoundaries = function(x, y) {
            return !(
                x <= boundaries.x || x >= boundaries.x + boundaries.width ||
                y <= boundaries.y || y >= boundaries.y + boundaries.height
            );
        };
    
        /**
         * Returns a random number to offset the center
         * @param {Number} x The x position
         * @param {Number} y The y position
         * @param {Number} range The current step value
         * @return {Number} A displaced (or "error") value
         */
        
        this.displace = function(x, y, range) {
            return (this.random(x, y) - 0.5) * (range / (extended * 2) * roughness);
        };
        
        /**
         * Normalizes value to ensure its within bounds
         * @param {Number} n The value to normalize
         * @return {Number} A normalized value between 0 and 1
         */
        
        this.normalize = function(n) {
            return n > 1 ? 1 : n < 0 ? 0 : n;
        };
        
        /**
         * Returns a deterministic random number given x and y position
         * @param {Number} x The x position
         * @param {Number} y The y position
         * @return {Number} A random number between 0 and 1
         */
        
        this.random = function(x, y) {
            return (x = Math.sin(x + 0.5 + (y || 0.5) * seed) * 1000) - Math.floor(x);
        };
    };  
})();