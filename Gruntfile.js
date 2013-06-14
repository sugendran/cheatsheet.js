module.exports = function(grunt) {

  var cheatsheets = grunt.file.readJSON('templates/cheatsheets.json');

  // Project configuration.
  var gruntconfig = {
    pkg: grunt.file.readJSON('package.json'),
    files: ['src/core.js', 'src/renderer.js', 'src/filter.js'],
    clean: ['build'],
    watch: {
      scripts: {
        files: ['src/**/*.js', 'spec/**/*.js'],
        tasks: ['test', 'concat']
      }
    },
    concat: {
      options: {
        separator: '\n'
      },
      all: {
        src: '<%= files %>',
        dest: 'build/lib/cheatsheet-<%= pkg.version %>.js'
      },
      styles: {
        src: 'templates/default.css',
        dest: 'build/lib/cheatsheet-<%= pkg.version %>.css'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      all: {
        src: 'build/lib/cheatsheet-<%= pkg.version %>.js',
        dest: 'build/lib/cheatsheet-<%= pkg.version %>.min.js'
      }
    },
    jasmine: {
      all: {
        src: '<%= files %>',
        options: {
          specs: 'spec/**/*spec.js'
        }
      }
    },
    jade: {
      index: {
        options: {
          data: {
            cheatsheets: cheatsheets
          }
        },
        files: {
          "build/index.html": ["templates/index.jade"]
        }
      }
    },
    s3: {
      options: {
        key: process.env.AWS_S3_KEY,
        secret: process.env.AWS_S3_SECRET,
        bucket: 'cheatsheetjs.com',
        access: 'public-read'
      },
      all: {
        upload: [{
          src: 'build/**/*',
          dest: '/'
        }]
      }
    }
  };
  // add a config for every template
  Object.keys(cheatsheets).forEach(function(sheetname) {
    var sheet = cheatsheets[sheetname];
    var dest = 'build/' + sheet.slug + '.html';
    gruntconfig.jade[sheetname] = {
      options: {
        data: {
          info: grunt.file.readJSON(sheet.info),
          version: gruntconfig.pkg.version,
          debug: false
        }
      },
      files: { }
    };
    gruntconfig.jade[sheetname].files[dest] = ["templates/cheatsheet.jade"];
  });

  grunt.initConfig(gruntconfig);

  // Modules
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-s3');

  // Default task(s).
  grunt.registerTask('default', ['clean', 'jasmine', 'concat', 'uglify', 'jade']);
  grunt.registerTask('test', ['jasmine']);
  grunt.registerTask('deploy', ['default', 'bump']);

};