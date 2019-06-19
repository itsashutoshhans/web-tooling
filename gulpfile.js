const gulp = require('gulp');
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const eslint = require('gulp-eslint');
const jasmineBrowser = require('gulp-jasmine-browser');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('default',['styles','lint','copy-html','copy-images'], () => {
    // code for the default goes here
    gulp.watch('sass/**/*.scss', ['styles']);
    gulp.watch('js/**.*.js', ['lint']);
    gulp.watch('./index.html',['copy-html']).on('change', browserSync.reload);
    browserSync.init({
        server: './dist'
    });
});

// linting 
gulp.task('lint', function() {
    return (
        gulp
            .src(['js/**/*.js'])
            // eslint() executes the eslint to the all files mapped
            .pipe(eslint())
            // eslint.format() outputs the lint results to the console.
            // Alternatively use eslint.formatEach() (see Docs).
            .pipe(eslint.format())
            // To have the process exit with an error code (1) on
            // lint error, return the stream and pipe to failOnError last.
            .pipe(eslint.failOnError())
    );
});

// sass 
gulp.task('styles', () => {

    gulp.src('sass/**/*.scss')
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(
            autoprefixer({
                browsers: ['last 2 versions']
            })
        )
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream());
});

// tests
gulp.task('tests', function() {
    return (
        gulp
            .src('tests/spec/extraSpec.js')
            .pipe(jasmineBrowser.specRunner({console: true}))
            .pipe(jasmineBrowser.headless({driver: 'chrome'}))
    );
});

// JS concatenation
gulp.task('scripts', function() {
    gulp.src('js/**/*.js')
        .pipe(babel())
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./dist/js'))
});

// for production
gulp.task('scripts-dist', function() {
    gulp.src('js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/js'))
});

// copy files for production
gulp.task('copy-html', function() {
    gulp.src('./index.html')
        .pipe(gulp.dest('./dist'))
});

gulp.task('copy-images', function() {
    gulp.src('./img/*')
        .pipe(gulp.dest('./dist/img'))
});

gulp.task('dist',[
    'copy-html',
    'copy-images',
    'styles',
    'lint',
    'scripts-dist'
]);