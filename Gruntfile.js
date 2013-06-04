module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    files: ['src/core.js', 'src/renderer.js', 'src/filter.js'],
    watch: {
      scripts: {
        files: ['src/**/*.js', 'spec/**/*.js'],
        tasks: ['test', 'concat']
      },
    },
    concat: {
      options: {
        separator: '\n'
      },
      default: {
        src: '<%= files %>',
        dest: 'lib/cheatsheet-<%= pkg.version %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      default: {
        src: 'lib/cheatsheet-<%= pkg.version %>.js',
        dest: 'lib/cheatsheet-<%= pkg.version %>.min.js'
      }
    },
    jasmine: {
      default: {
        src: '<%= files %>',
        options: {
          specs: 'spec/**/*spec.js'
        }
      }
    }
  });

  // Modules
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  
  // Default task(s).
  grunt.registerTask('default', ['jasmine', 'concat', 'uglify']);
  grunt.registerTask('test', ['jasmine']);

};