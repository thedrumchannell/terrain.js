module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
        dist: {
          files: [{
            src: 'terrain.js',
            dest: 'build/'
          }]
        }
      },
    uglify: {
      options: {
        banner: '/*! Terrain.js v<%= pkg.version %> */\n',
        report: 'min',
        preserveComments: false
      },
      dist: {
        files: {
          'build/terrain-min.js': [
            'build/terrain.js'
          ]
        }
      }
    },
    connect: {
      server: {
        options: {
          port: 8000,
          keepalive: true
        }
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['copy', 'uglify']);
};