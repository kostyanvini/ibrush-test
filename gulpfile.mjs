import gulp from 'gulp';
import gulpSccs from 'gulp-sass';
import browserSync from 'browser-sync';
import del from 'del';
import imagemin, { gifsicle, mozjpeg, optipng, svgo } from 'gulp-imagemin';
import pngquant from 'gulp-pngquant';
import notify from 'gulp-notify';
import nodeSass from "node-sass";
import sourcemaps from 'gulp-sourcemaps';
import rename from 'gulp-rename';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import gcmq from 'gulp-group-css-media-queries';
import svgSprite from 'gulp-svg-sprite';
const sass = gulpSccs(nodeSass);
import webpackConfig from './webpack.config.mjs';
import webpackStream from 'webpack-stream';


function js() {
    return gulp.src('app/js/**/*.js')
        .pipe(sourcemaps.init({
            largeFile: true
        }))
        .pipe(webpackStream(webpackConfig))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.reload({ stream: true }));
}

function scss() {
    return gulp.src('app/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on("error", notify.onError()))
        .pipe(gcmq())
        .pipe(autoprefixer({
            cascade: true,
            overrideBrowserslist: ['last 15 versions', '> 1%', 'ie 8', 'ie 7']
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({ stream: true }));
}

function server() {
    browserSync({
        server: {
            baseDir: 'dist',
            directory: true
        },
        notify: true,
    });
}

function png() {
    return gulp.src('app/pic/**/*.png')
        .pipe(pngquant({
            quality: '80-90'
        }))
        .pipe(gulp.dest('dist/pic'));
}

function img() {
    return gulp.src('app/pic/**/*.{svg,gif,jpg,jpeg,ico}')
        .pipe(imagemin([
            gifsicle({ interlaced: true }),
            mozjpeg({ quality: 75, progressive: true }),
        ], {
            verbose: true,
        }))
        .pipe(gulp.dest('dist/pic'));
}

function svg() {
    return gulp.src('app/pic/**/*.svg')
        .pipe(svgSprite({
            dest: '.',
            mode: {
                symbol: {
                    sprite: "../sprite.svg"
                }
            }
        }))
        .pipe(gulp.dest('app/pic'))
        .pipe(gulp.dest('dist/pic'))
}

const images = gulp.parallel(img, svg, png);

function html() {
    return gulp.src('app/*.html')
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({ stream: true }));
}

function watchFiles() {
    gulp.watch('app/js/**/*.js', js);
    gulp.watch('app/scss/**/*.scss', scss);
    gulp.watch('app/*.html', html);
    gulp.watch('app/pic/*', function () {
        return gulp.src('app/pic/**/*.{svg,png,jpg,jpeg,gif,webp}')
            .pipe(gulp.dest('dist/pic'));
    });
}

function fonts() {
    return gulp.src('app/fonts/*')
        .pipe(gulp.dest('dist/fonts'))
}

const cleanDist = () => del('dist');

export default gulp.parallel(html, scss, js, watchFiles, server);
export const build = gulp.series(cleanDist, gulp.parallel(images, html, scss, js, fonts));
export const buildImages = images;
export const buildJs = js;
export const buildCss = scss;
export const buildSvg = svg;