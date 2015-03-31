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
      clean: ['components/ArcComponents.*']
    });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', ['clean', 'concat']);
}