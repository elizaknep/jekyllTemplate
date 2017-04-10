module.exports = function(grunt) {

  // Load Grunt Tasks
  require('load-grunt-tasks')(grunt);

  // Variables & Tasks
  const buildDev = ['shell:jekyllDev', 'sass:dev', 'postcss:dev', 'browserify', 'concat:dev', 'clean:dev'],
        build    = ['shell:jekyllProd', 'sass:prod', 'postcss:prod', 'browserify', 'concat:prod', 'uglify', 'htmlmin', 'clean:prod'],
        zen      = require('./zen.json');

  // Grunt Project Configuration
  grunt.initConfig({

    // Read package.json
    pkg: grunt.file.readJSON('package.json'),

    // Project Settings & Options
    prj: {
      src: {
        dir: '../src/',
        style: '../src/sass/',
        script: '../src/js/'
      },
      site: {
        dir: '../_site/',
        style: '../_site/css/',
        script: '../_site/js/'
      },
      config: {
        dev: grunt.file.readYAML('_config.yml'),
        prod: grunt.file.readYAML('_config-prod.yml')
      },
      bp: '../../config/node_modules/babel-preset-'
    },

    // JEKYLL
    //
    // Build the Jekyll Project
    shell: {
      jekyllDev: {
        command: 'jekyll build'
      },
      jekyllProd: {
        command: 'jekyll build --config "_config.yml,_config-prod.yml"'
      }
    },

    // SASS/CSS
    //
    // Sass Processes. Allows for img paths to be set for local and prod environments.
    sass: {
      options: {
        includePaths: ['<%= prj.src.style %>', '<%= prj.src.style %>modules'],
      },
      dev: {
        options: {
          sourceMap: true,
          data: '$baseurl: "<%= prj.config.dev.baseurl %>"; @import "style"'
        },
        files: {
          '<%= prj.site.style %>style.css': '<%= prj.src.style %>'
        }
      },
      prod: {
        options: {
          sourceMap: false,
          data: '$baseurl: "<%= prj.config.prod.baseurl %>"; @import "style"'
        },
        files: {
          '<%= prj.site.style %>style.css': '<%= prj.src.style %>'
        }
      }
    },
    // PostCSS Processes (Autoprefixer, CSS Sorting, Minification (Prod Only))
    postcss: {
      options: { map: false },
      dev: {
        options: {
          processors: [
            require('autoprefixer')({browsers: ['last 2 versions']}),
            require('postcss-sorting')(zen)
          ]
        },
        files: {
          '<%= prj.site.style %>style.min.css': '<%= prj.site.style %>style.css'
        }
      },
      prod: {
        options: {
          processors: [
            require('autoprefixer')({browsers: ['last 2 versions']}),
            require('postcss-sorting')(zen),
            require('cssnano')()
          ]
        },
        files: {
          '<%= prj.site.style %>style.min.css': '<%= prj.site.style %>style.css'
        }
      }
    },

    // JS
    //
    // Babel via Browserify
    browserify: {
      options: {
        transform: [[ 'babelify', {presets: ['<%= prj.bp %>es2015', '<%= prj.bp %>stage-0']} ]]
      },
      all: {
        expand: true,
        cwd:  '<%= prj.src.script %>',
        src:  ['*.js', '!vendor/*'],
        dest: '<%= prj.site.script %>'
      }
    },
    // Concatenate JS (Step 1/2)
    concat: {
      options: {
        separator: ';'
      },
      dev: {
        src: ['<%= prj.src.script %>vendor/**/*.js', '<%= prj.site.script %>script.js'],
        dest: '<%= prj.site.script %>script.min.js'
      },
      prod: {
        src: ['<%= prj.src.script %>vendor/**/*.js', '<%= prj.site.script %>script.js'],
        dest: '<%= prj.site.script %>script.js'
      }
    },
    // Minify JS (Step 2/2, prod only)
    uglify: {
      prod: {
        src: '<%= prj.site.script %>script.js',
        dest: '<%= prj.site.script %>script.min.js'
      }
    },

    // HTML
    //
    // Minify HTML
    htmlmin: {
      options: {
        removeComments: true,
        collapseWhitespace: true
      },
      prod: {
        files: [{
          expand: true,
          cwd: '<%= prj.site.dir %>',
          src: ['**/*.html'],
          dest: '<%= prj.site.dir %>'
        }]
      }
    },

    // CLEANUP
    //
    // Remove unnecessary files
    clean: {
      options: { force: true },
      dev: [
        '<%= prj.site.style %>**/*',
        '<%= prj.site.script %>**/*',
        '!<%= prj.site.style %>style.min.css',
        '!<%= prj.site.style %>*.map',
        '!<%= prj.site.script %>script.min.js'
      ],
      prod: [
        '<%= prj.site.style %>**/*',
        '<%= prj.site.script %>**/*',
        '!<%= prj.site.style %>style.min.css',
        '!<%= prj.site.script %>script.min.js'
      ]
    },

    // BROWSER SYNC
    //
    // Server task
    browserSync: {
      files: {
        src: ['<%= prj.site.dir %>**/*']
      },
      options: {
        watchTask: true,
        server: {
          baseDir: '<%= prj.site.dir %>',
        }
      }
    },

    // WATCH
    //
    // Watch task for development
    watch: {
      options: {
        livereload: true,
        interupt: true,
        spawn: false
      },
      jekyll: {
        files: ['<%= prj.src.dir %>**/*.{html,md}','<%= prj.src.dir %>img/*'],
        tasks: ['shell:jekyllDev'],
      },
      styles: {
        files: ['<%= prj.src.style %>**/*'],
        tasks: ['sass', 'postcss:dev', 'clean'],
      },
      scripts: {
        files: ['<%= prj.src.script %>**/*'],
        tasks: ['concat:dev', 'clean'],
      }
    }
  });

  // Register Tasks
  grunt.registerTask('buildDev',   buildDev);
  grunt.registerTask('ws',       ['buildDev', 'browserSync', 'watch']);
  grunt.registerTask('default',    build);
};