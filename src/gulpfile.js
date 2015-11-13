var gulp = require('gulp');

var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var gulpif = require('gulp-if');
var markdox = require('gulp-markdox');
var del = require('del');

var paths = {
    sources: ['./threeder/**/*.coffee', './mi/**/*.coffee'],
    dependencies: ['./libs/threejs/build/three.js'],
    destination: '../public/javascripts/libs/threeder',
    documentation: './doc'
};

gulp.task('clean', function(cb) {
    del([paths.destination], {force: true}, cb);
});

gulp.task('build', ['clean'], function() {
    gulp.src(paths.dependencies.concat(paths.sources))
        .pipe(gulpif(/[.]coffee$/, coffee({bare: true})))
        .pipe(gulp.dest(paths.destination));
});



gulp.task("doc", function(){
    gulp.src(paths.sources)
        .pipe(markdox())
        .pipe(gulp.dest(paths.documentation));
});



gulp.task('default', ['build']);
