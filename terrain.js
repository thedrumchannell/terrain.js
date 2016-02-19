/**
 * Terrain.js 1.0.1
 * @copyright (c) 2015-2016 Brandon Channell
 * @license MIT License
 */

(function() {
    
    /**
     * A class for generating random infinite height maps using the diamond-square algorithm
     * @param {Number} x1 The x starting position
     * @param {Number} y1 The y starting position
     * @param {Number} dimension The width and height of this map, Ex: 256
     * @param {Number} seed The unique identifier value
     * @param {Number} roughness The amount of roughness used during generation
     * @param {Number} scale The amount of scaling used during generation
     */
    
    window.Terrain = function(x1, y1, dimension, seed, roughness, scale) {
        
        // array of height values
        var heights = [],
        
            // extended map size
            size = dimension * Math.pow(2, scale) / 2 * 3 + 1,
        
            // set scaling
            scale = scale || 1;
    
        /**
         * Generates an array of heights for this terrain map
         */
        
        this.generateHeights = function() {
            
            // step size
            var step = dimension * Math.pow(2, scale) / 2,
                
                // step half (center)
                half = step / 2,
                
                // starting x position
                sx = Math.floor(x1 / step) * step - step,
                
                // starting y position
                sy = Math.floor(y1 / step) * step - step,
                
                // ending x position
                ex = step * 3 + sx,
    
                // ending y position
                ey = step * 3 + sy;
            
            // generate the base heights
            for (var y = sy; y <= ey; y += step) {
                for (var x = sx; x <= ex; x += step) {
                    this.setHeight(x, y, this.normalize(this.displace(x, y, step)));
                }
            }
            
            while (half > 1) {
                
                // update half step
                half = step / 2;
                
                // only generate heights required for dimension
                if (step <= dimension) {
                    
                    // update start positions
                    sx = x1 - half;
                    sy = y1 - half;
                    
                    // update end positions
                    ex = x1 + dimension + half;
                    ey = y1 + dimension + half;
                } else {
                    
                    // update start positions
                    sx += half;
                    sy += half;
                    
                    // update end positions
                    ex -= half;
                    ey -= half;
                }
                
                // generate diamonds
                for (var y = sy; y <= ey; y += step) {
                    for (var x = sx; x <= ex; x += step) {
                        this.generateDiamond(x, y, half, this.displace(x, y, step));
                    }
                }
                
                // generate squares
                for (var y = sy; y <= ey; y += step) {
                    for (var x = sx; x < ex; x += step) {
                        this.generateSquare(x + half, y, half, this.displace(x + half, y, step));
                    }
                }
                
                // generate squares
                for (var y = sy; y < ey; y += step) {
                    for (var x = sx; x <= ex; x += step) {
                        this.generateSquare(x, y + half, half, this.displace(x, y + half, step));
                    }
                }
                
                // update the step
                step /= 2;
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
            this.setHeight(x, y,
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
            this.setHeight(x, y,
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
         * Sets a value for given x and y position
         * @param {Number} x The x position
         * @param {Number} y The y position
         * @param {Number} value The updated value
         */
        
        this.setHeight = function(x, y, value) {
            heights[x] = heights[x] || [];
            heights[x][y] = value;
        };
        
        /**
         * Returns the array of heights
         * @return {Array} heights
         */
        
        this.getHeights = function() {
            return heights;
        };
        
        /**
         * Returns the terrain scale value
         * @return {Number} scale
         */
        
        this.getScale = function() {
            return scale;
        };
        
        /**
         * Returns the terrain size value
         * @return {Number} size
         */
        
        this.getSize = function() {
            return size;
        };
    
        /**
         * Returns a random number to offset the center
         * @param {Number} x The x position
         * @param {Number} y The y position
         * @param {Number} range The current step value
         * @return {Number} A displaced (or "error") value
         */
        
        this.displace = function(x, y, range) {
            return (this.random(x, y) - 0.5) * (range / (size * 2) * roughness);
        };
        
        /**
         * Normalizes value to ensure its within bounds
         * @param {Number} n The value to normalize
         * @return {Number} A normalized value
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
            x = Math.sin(x + 0.5 + (y || 0.5) * seed) * 1000;
            return x - Math.floor(x);
        };
    };  
})();