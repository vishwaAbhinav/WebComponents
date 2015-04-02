module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
      concat: {
        html: {
          src : ['components/*.html','components/!(ArcComponents).html'],
          dest : 'components/ArcComponents.html'
        },
        js: {
          src : ['components/*.js','components/!(ArcComponents).js'],
          dest : 'components/ArcComponents.js'
        },
        css: {
          src : ['components/*.css','components/!(ArcComponents).css'],
          dest : 'components/ArcComponents.css'
        }
      },
      clean: ['components/ArcComponents.*'],
      vulcanize : {
        default : {
          options : {
            inline : true,
            excludes : {
              scripts : [
                '.*'
              ]
            }
          },
          files : {
            'ArcComponentsBuild.html': 'components/custom-filter.html'
          }
        }
      }

    });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-vulcanize');

  grunt.registerTask('default', ['clean', 'vulcanize']);
}