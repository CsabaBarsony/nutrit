var browserify	= require('browserify');
var gulp		= require('gulp');
var source		= require('vinyl-source-stream');
var babelify	= require('babelify');
var _			= require('lodash');
var pug			= require('gulp-pug');
var data		= require('gulp-data');
var sass		= require('gulp-sass');
var scripts 	= [
	'./src/scripts/pages/nutrit/nutrit.js',
	'./src/scripts/components/food_selector/food_selector.js',
	'./src/scripts/components/ingredient_list/ingredient_list.js',
	'./src/scripts/components/pie/pie.js',
	'./src/scripts/components/publisher/publisher.js'
];
var views		= [
	'./src/views/index'
];

function handleError(error) {
	console.error(error);
	this.emit('end');
}

function compile() {
	_.each(scripts, function(s) {
		var fileName = s.match(/[^\/]*\.js/)[0];

		browserify(s, { debug: true })
			.transform('babelify', { presets: ['es2015', 'react'], sourceMaps: false })	.on('error', handleError)
			.bundle()																	.on('error', handleError)
			.pipe(source(fileName))														.on('error', handleError)
			.pipe(gulp.dest('./public/js/'))											.on('error', handleError);
	});

	gulp.src('src/styles/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('public/css'));
	
	delete require.cache[require.resolve('./src/views/data.js')];

	gulp.src(['src/views/**/*.pug', '!src/views/includes/*.*'])
		.pipe(data(require('./src/views/data.js')))	.on('error', handleError)
		.pipe(pug({ pretty: true }))				.on('error', handleError)
		.pipe(gulp.dest('public/'))					.on('error', handleError);
}

gulp.task('compile', function() {
	compile();
});

gulp.task('watch', function() {
	compile();
	gulp.watch('src/**/*.*', ['compile']);
});

compile();