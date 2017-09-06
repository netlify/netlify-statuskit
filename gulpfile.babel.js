import gulp from "gulp";
import cp from "child_process";
import gutil from "gulp-util";
import postcss from "gulp-postcss";
import cssImport from "postcss-import";
import cssnext from "postcss-cssnext";
import BrowserSync from "browser-sync";
import webpack from "webpack";
import webpackConfig from "./webpack.conf";
import inquirer from "inquirer";
import toml from "tomljs";
import fs from "fs";
import kebabCase from "lodash.kebabcase";

const browserSync = BrowserSync.create();
const hugoBin = `./bin/hugo_0.26_${process.platform}_amd64${process.platform === "windows" ? ".exe" : ""}`;
const defaultArgs = ["-d", "../dist", "-s", "site", "-v"];
const newIncidentArgs = ["new", "incidents"];

gulp.task("hugo", (cb) => buildSite(cb));
gulp.task("hugo-preview", (cb) => buildSite(cb, ["--buildDrafts", "--buildFuture"]));

gulp.task("build", ["css", "js", "hugo"]);
gulp.task("build-preview", ["css", "js", "hugo-preview"]);

gulp.task("css", () => (
  gulp.src("./src/css/*.css")
    .pipe(postcss([cssnext(), cssImport({from: "./src/css/main.css"})]))
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream())
));

gulp.task("js", (cb) => {
  const myConfig = Object.assign({}, webpackConfig);

  webpack(myConfig, (err, stats) => {
    if (err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      colors: true,
      progress: true
    }));
    browserSync.reload();
    cb();
  });
});

gulp.task("server", ["hugo", "css", "js"], () => {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });
  gulp.watch("./src/js/**/*.js", ["js"]);
  gulp.watch("./src/css/**/*.css", ["css"]);
  gulp.watch("./site/**/*", ["hugo"]);
});

gulp.task("new-incident", (cb) => {
  const file = fs.readFileSync("site/config.toml").toString();
  const config = toml(file);

  const questions = [{
    type: "input",
    name: "name",
    message: "What is the cause of the incident?",
    filter: ((name) => kebabCase(name) + ".md")
  }, {
    type: "list",
    name: "severity",
    message: "What is the severity of the incident?",
    choices: ["under-maintenance", "degraded-performance", "partial-outage", "major-outage"]
  }, {
    type: "checkbox",
    name: "affected",
    message: "What are the affected systems?",
    choices: config.params.systems
  }, {
    type: "confirm",
    name: "open",
    message: "Open incident for editing?",
    default: false
  }];

  inquirer.prompt(questions).then(_ => {

      cb();
  });
});

function buildSite(cb, options) {
  const args = options ? defaultArgs.concat(options) : defaultArgs;

  // cp needs to be in site directory
  return cp.spawn(hugoBin, args, {stdio: "inherit"}).on("close", (code) => {
    if (code === 0) {
      browserSync.reload();
      cb();
    } else {
      browserSync.notify("Hugo build failed :(");
      cb("Hugo build failed");
    }
  });
}
