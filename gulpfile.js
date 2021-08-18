const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("postcss-csso");
const rename = require("gulp-rename");
const sync = require("browser-sync").create();
const htmlmin = require("gulp-htmlmin");
const terser = require("gulp-terser");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const del = require("del");

// Styles

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

//Html

const html = () => {
  return gulp.src("source/*.html")
    .pipe(htmlmin({collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
}

exports.html = html;

// Scripts

const scripts = () => {
  return gulp.src("source/js/main.js")
    .pipe(terser())
    .pipe(rename(function (path) {
      path.basename += ".min"
    }))
    .pipe(gulp.dest("build/js"))
    .pipe(sync.stream());
}

exports.scripts = scripts;

// Image

const optimizeImages = () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.mozjpeg({progressive: true}),
      imagemin.svgo()
  ]))
    .pipe(gulp.dest("build/img"));
}

exports.images = optimizeImages;

const copyImages = () => {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(gulp.dest("build/img"));
}

exports.images = copyImages;

//WebP

const createWebp = () => {
  return gulp.src("source/img/**/*.{jpg,png}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img"));
}

exports.createWebp = createWebp;

//Sprite

const sprite = () => {
  return gulp.src("source/img/icon/icon-sprite/*.svg")
    .pipe(svgstore())
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
 }

exports.sprite = sprite;

// CopyFavicon

 /*const copyFavicon = (done) => {
   gulp.src([
     "source/*.{ico,svg,png}",
     "source/manifest.json",
   ])
   .pipe(gulp.dest("build"))
   done();
 }

 exports.copyFavicon = copyFavicon;*/
// Copy

const copy = (done) => {
  gulp.src([
    "source/fonts/*.{woff2,woff}",
    "source/img/**/*.svg",
    //"!source/img/sprite-icon/*.svg",
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"))
  done();
}

exports.copy = copy;

// Clean

const clean = () => {
  return del("build");
};

exports.clean = clean;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: "build"
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

//Reload

const reload = done => {
  sync.reload();
  done();
};

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/js/script.js", gulp.series(scripts));
  gulp.watch("source/*.html", gulp.series(html, reload));
}

//Build

const build = gulp.series(
  clean,
  copy,
  //copyFavicon,
  optimizeImages,
  gulp.parallel(
   styles,
    html,
    scripts,
    sprite,
    createWebp
  ),
);

exports.build = build;

// Default

exports.default = gulp.series(
  clean,
  copy,
 // copyFavicon,
  copyImages,
  gulp.parallel(
   styles,
    html,
    scripts,
   sprite,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  ),
);
