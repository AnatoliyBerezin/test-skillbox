const gulp = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const resolveUrl = require('gulp-resolve-url');
const concatCss = require('gulp-concat-css');
const cleanCss = require('gulp-clean-css');
const htmlMin = require('gulp-htmlmin');
const del = require('del');

const path = require('path');

const DIST_DIRECTORY = path.resolve('docs/');
const SRC_DIRECTORY = path.resolve('src/');

function scss() {
    return gulp.src(`${SRC_DIRECTORY}/scss/style.scss`)
        .pipe(sourcemaps.init())
        .pipe(
            sass({
                includePaths: ['node_modules']
            }).on('error', sass.logError)
        )
        .pipe(
            autoprefixer({
                browsers: ['last 3 versions']
            })
        )
        .pipe(resolveUrl())
        .pipe(concatCss('style.css'))
        .pipe(cleanCss({
            sourceMap: true
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(`${DIST_DIRECTORY}/css`));
}

function js() {
    return gulp.src(`${SRC_DIRECTORY}/js/**/*.js`)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(`${DIST_DIRECTORY}/js`));
}

function html() {
    return gulp.src(`${SRC_DIRECTORY}/*.html`)
        .pipe(
            htmlMin({
                sortAttributes: true,
                sortClassName: true,
                collapseWhitespace: true
            })
        )
        .pipe(gulp.dest(DIST_DIRECTORY));
}

function fonts() {
    return gulp.src(`${SRC_DIRECTORY}/fonts/**/*`)
        .pipe(gulp.dest(`${DIST_DIRECTORY}/fonts`));
}

function reload(done) {
    browserSync.reload();
    done();
}

async function serve() {
    browserSync({
        server: DIST_DIRECTORY
    });

    gulp.watch(`${SRC_DIRECTORY}/**/*`, reload);

    gulp.watch(`${SRC_DIRECTORY}/fonts/**/*`, fonts, {
        ignoreInitial: false
    });

    gulp.watch(`${SRC_DIRECTORY}/scss/**/*.scss`, scss, {
        ignoreInitial: false
    });

    gulp.watch(`${SRC_DIRECTORY}/js/**/*.js`, js, {
        ignoreInitial: false
    });

    gulp.watch(`${SRC_DIRECTORY}/**/*.html`, html, {
      ignoreInitial: false
    });
}

function clean() {
    return del([DIST_DIRECTORY]);
}

exports.build = gulp.series(clean, gulp.parallel(html, js, scss, fonts));
exports.default = gulp.series(clean, exports.build, serve);