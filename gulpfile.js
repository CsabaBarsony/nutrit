var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var babelify = require('babelify');
var _ = require('lodash');
//var jasmine = require('gulp-jasmine');

var sources = [
	'./src/scripts/components/food_selector/food_selector.js',
	'./src/scripts/components/ingredient_list/ingredient_list.js',
	'./src/scripts/components/publisher/publisher.js'
];

function compile() {
	_.each(sources, function(s) {
		var fileName = s.match(/[^\/]*\.js/)[0];

		browserify(s, { debug: true })
			.transform('babelify', { presets: ['es2015', 'react'], sourceMaps: false })
			.bundle()
			.pipe(source(fileName))
			.pipe(gulp.dest('./public/js/'));
	});
	
	//gulp.src('spec/test.js').pipe(jasmine);
}

gulp.task('compile', function() {
	compile();
});

gulp.task('watch', function() {
	compile();
	gulp.watch('./src/scripts/**/*.js', ['compile']);
});

compile();