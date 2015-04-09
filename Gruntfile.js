module.exports = function(grunt) {

  grunt.initConfig({
    vulcanize: {
      main: {
        options: {
          inline: true,
          excludes : {
            scripts : [
                '.*'
            ]
          },
        },
        files: {
          'dist/allComponentsVulcanized.html': 'components/custom-filter.html'
        },
      },
    },
    dom_munger: {
      main: {
        options: {
          read: [
            {selector:'script', attribute:'src', writeto:'jsRefs', isPath:true},
          ],
          remove: ['script[src]'],
          append: [
            {selector:'head',html:'<script src="js/allComponents.min.js"></script>'}
          ]
        },
        src: 'dist/allComponentsVulcanized.html',
        dest: 'dist/allComponents.html'
      },
      secondary: {
        options: {
          read: [
            {selector:'link[rel=import]', attribute:'href', writeto:'htmlRefs', isPath:true}
          ]
        },
        src: 'components/custom-filter.html',
      }
    },
    uglify: {
      main: {
        src: '<%= dom_munger.data.jsRefs %>',
        dest:'dist/js/allComponents.min.js',
        options: {
          mangle:false,
          sourceMap: true
        }
      }
    },
    htmllint: {
      // The files that we want to check.
      dist: {
        options: {
          path: false,
          force: false,
          reportpath: false // Turns logging to a file off, output will show in the CLI.
        },

        // The files that we want to check.
        src: [
          '<%= dom_munger.data.htmlRefs %>'
        ]
      }
    },
    htmlmin: {                                     // Task
      dist: {                                      // Target
        options: {    
          minifyCSS : true,                           // Target options
          minifyJS : true,
          removeComments: true,
          collapseWhitespace: true
        },
        files: {                                   // Dictionary of files
          'dist/allComponents.html': 'dist/allComponents.html',     // 'destination': 'source'
        }
      }
    }
  });
 
  //require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-dom-munger');
  grunt.loadNpmTasks('grunt-vulcanize');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-htmllint');

  grunt.registerTask('build', ['vulcanize','dom_munger:main', 'uglify','htmlmin']);
  grunt.registerTask('lint', ['dom_munger:secondary','htmllint']);
};