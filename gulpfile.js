var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var babelify = require('babelify');
var _ = require('lodash');

var sources = [
	'./src/scripts/pages/nutrit/nutrit.js',
	'./src/scripts/components/food_selector/food_selector.js',
	'./src/scripts/components/ingredient_list/ingredient_list.js',
	'./src/scripts/components/pie/pie.js',
	'./src/scripts/components/publisher/publisher.js'
];

function handleError(error) {
	console.error('Error:');
	console.error(error.filename);
	console.error(error.loc);
	this.emit('end');
}

function compile() {
	_.each(sources, function(s) {
		var fileName = s.match(/[^\/]*\.js/)[0];

		browserify(s, { debug: true })
			.transform('babelify', { presets: ['es2015', 'react'], sourceMaps: false })
			.on('error', handleError)
			.bundle()
			.on('error', handleError)
			.pipe(source(fileName))
			.on('error', handleError)
			.pipe(gulp.dest('./public/js/'))
			.on('error', handleError);
	});
}

gulp.task('compile', function() {
	compile();
});

gulp.task('watch', function() {
	compile();
	gulp.watch('./src/scripts/**/*.js', ['compile']);
});

compile();