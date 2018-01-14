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
import path from "path";
import kebabCase from "lodash.kebabcase";
import tomlify from "tomlify-j0.4";

const browserSync = BrowserSync.create();
const platform = getPlatform(process.platform);
const hugoBin = `./bin/hugo_0.26_${platform}_amd64${platform === "windows" ? ".exe" : ""}`;
const defaultArgs = ["-s", "site", "-v"];
const buildArgs = ["-d", "../dist"];

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
    validate: (value) => {
      if (value.length > 0) {
        return true;
      }

      return "You must have a cause title!";
    }
  }, {
    type: "list",
    name: "severity",
    message: "What is the severity of the incident?",
    choices: ["under-maintenance", "degraded-performance", "partial-outage", "major-outage"]
  }, {
    type: "checkbox",
    name: "affected",
    message: "What are the affected systems?",
    choices: config.params.systems,
    validate: (value) => {
      if (value.length > 0) {
        return true;
      }

      return "You must have an affected system?!";
    }
  }, {
    type: "input",
    name: "description",
    message: "Add a terse description of the incident"
  }, {
    type: "confirm",
    name: "open",
    message: "Open the incident for editing?",
    default: false
  }];

  inquirer.prompt(questions).then((answers) => {
    let args = ["new", `incidents${path.sep}${kebabCase(answers.name)}.md`];
    args = args.concat(defaultArgs);

    const hugo = cp.spawn(hugoBin, args, {stdio: "pipe"});
    hugo.stdout.on("data", (data) => {
      const message = data.toString();

      if (message.indexOf(" created") === -1) {
        return;
      }

      const path = message.split(" ")[0];

      const incident = fs.readFileSync(path).toString();
      const frontMatter = toml(incident);

      frontMatter.severity = answers.severity;
      frontMatter.affectedsystems = answers.affected;
      frontMatter.title = answers.name.replace(/-/g, " ");

      const content = generateFrontMatter(frontMatter, answers);

      fs.writeFileSync(path, content);

      if (!answers.open) {
        return;
      }

      let cmd = "xdg-open";
      switch (platform) {
        case "darwin": {
          cmd = "open";
          break;
        }
        case "windows": {
          cmd = "start";
          break;
        }
        default: {
          cmd = "xdg-open";
          break;
        }
      }

      cp.exec(`${cmd} ${path}`);
    });

    hugo.on("close", (code) => {
      if (code === 0) {
        cb();
      } else {
        cb("new incident creation failed");
      }
    });
  });
});

function getPlatform(platform) {
  switch (platform) {
    case "win32":
    case "win64": {
      return "windows";
    }
    default: {
      return platform;
    }
  }
}

function generateFrontMatter(frontMatter, answers) {
  return `+++
${tomlify(frontMatter, null, 2)}
+++
${answers.description}`;
}

function buildSite(cb, options) {
  let args = options ? defaultArgs.concat(options) : defaultArgs;
  args = args.concat(buildArgs);

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
