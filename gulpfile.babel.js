'use strict';
// Import modules
import {src, dest, watch, parallel, series} from 'gulp'
import cssMin from 'gulp-clean-css'
import concat from 'gulp-concat'
import googleWebFonts from 'gulp-google-webfonts'
import gulp from 'gulp'
import imageMin from 'gulp-imagemin'
import merge from 'merge-stream'
import plumber from 'gulp-plumber'
import prefixer from 'gulp-autoprefixer'
import rimraf from 'rimraf'
import sass from 'gulp-sass'
import uglify from 'gulp-uglify-es'
import sourceMaps from 'gulp-sourcemaps'
import browserSync from 'browser-sync'

const reload = browserSync.reload;

const config = {
    server: {
        baseDir: "./build"
    },
    host: 'localhost',
    port: 9000,
    logPrefix: "WebDev"
};

const dir = {
    src: `src`,
    build: `build`,
    nm: `node_modules/` 
};

const path = {
    build: {
        js: `${dir.build}/js/`,
        css: `${dir.build}/css`,
        images: `${dir.build}/images/`,
        fonts: `${dir.build}/fonts/`,
        html: `${dir.build}`
    },
    src: {
        js: [
            `${dir.nm}/jquery/dist/jquery.min.js`,
            `${dir.nm}/owl.carousel/dist/owl.carousel.min.js`,
            `${dir.nm}/bootstrap/dist/js/bootstrap.bundle.js`,
            `${dir.nm}/lightbox2/src/js/lightbox.js`,
            `${dir.nm}/js-cookie/src/js.cookie.js`,
            `${dir.src}/js/partials/**/*.js`,
            `${dir.src}/js/helper.js`
        ],
        scss: [
            `${dir.nm}/bootstrap/scss/bootstrap.scss`,
            `${dir.nm}/owl.carousel/src/scss/owl.carousel.scss`,
            `${dir.nm}/owl.carousel/src/scss/owl.theme.default.scss`,
            `${dir.src}/styles/app.scss`
        ],
        css: [
            `${dir.nm}/lightbox2/dist/css/lightbox.css`
        ],
        html: `${dir.src}/**/*.html`,
        images: `${dir.src}/images/**/*.*`,
        webFonts: 'fonts.list',
        fontAwesome: 'node_modules/@fortawesome/fontawesome-free/webfonts/*.*'
    },
    watch: {
        js: `${dir.src}/js/**/*.js`,
        styles: `${dir.src}/styles/**/*.scss`,
        images: `${dir.src}/images/**/*.*`,
        html: `${dir.src}/**/*.html`,
    },
    clean: `${dir.build}` // path to clear production build
};

const options = {
    fontsDir: 'fonts',
    cssDir: ''
};

export const clean = (cb) => rimraf(path.clean, cb);

export const buildFonts = () => {
    let google = src(path.src.webFonts)
        .pipe(googleWebFonts(options))
        .pipe(dest(`${dir.build}`));

    let fontAwesome = gulp.src(path.src.fontAwesome)
        .pipe(dest(path.build.fonts));

    return merge(google, fontAwesome);
};

export const buildPages = () => src(path.src.html)
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({stream: true}));

export const buildImages = () => src(path.src.images)
    .pipe(imageMin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        interlaced: true
    }))
    .pipe(dest(path.build.images));

export const buildScripts = () => src(path.src.js)
    .pipe(plumber())
    .pipe(sourceMaps.init())
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(sourceMaps.write('.'))
    .pipe(plumber.stop())
    .pipe(dest(path.build.js))
    .pipe(reload({stream: true}));

export const buildStyles = () => {
    let scssFiles = src(path.src.scss)
        .pipe(sass())
        .pipe(concat('styles.scss'));

    let cssFiles = src(path.src.css)
        .pipe(concat('styles.css'));

    return merge(scssFiles, cssFiles)
        .pipe(concat('styles.css'))
        .pipe(plumber())
        .pipe(sourceMaps.init())
        .pipe(prefixer())
        .pipe(cssMin())
        .pipe(sourceMaps.write('.', {debug: true}))
        .pipe(plumber.stop())
        .pipe(dest(path.build.css))
        .pipe(reload({stream: true}));
};

export const webServer = () => {
    browserSync(config);
};

export const devWatch = () => {
    watch(path.watch.html, buildPages);
    watch(path.watch.styles, buildStyles);
    watch(path.watch.images, buildImages);
    watch(path.watch.js, buildScripts);
};

export const build = series(parallel(buildPages, buildStyles, buildScripts));

export const dev = parallel(build, webServer, devWatch);

export default dev;