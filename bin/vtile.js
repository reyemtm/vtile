#!/usr/bin/env node

var path = require("path"),
  ext = require("file-extension")
  fs = require("fs-extra"),
  minimist = require("minimist"),
  cliclopts = require("cliclopts"),
  startServer = require("../src/server.js"),
  validate = require("../src/validate"),
  allowedOptions = require("../src/options.js")

var options = cliclopts(allowedOptions);

var opts = minimist(process.argv.slice(2), options.options());
opts.w = (opts.w === true || opts.w === "true" || opts.write === true || opts.write === "true") ? true : false;
opts.write = opts.w;
// console.log(opts);

if (opts.h || opts.help) {
  console.log("vtile creates vector tiles in mvt format from a geojson file(s) \n \n Usage: command [options]");
  options.print();
  process.exit();
}

if (opts.z < 0) {
    throw error
}
if (opts.Z > 20) {
    console.log("Very high zoom level detected, stopping application. A zoom level of 14 to 16 is likely sufficient.");
    throw error
}

// console.log(process.cwd());

var tileDirectory = path.resolve(process.cwd(), opts.t);

// console.log(tileDirectory);

if (!fs.existsSync(tileDirectory)) {
  fs.mkdirSync(tileDirectory);
}else{

}

if (!opts.i) {
  var geojsonDirectory = path.resolve(process.cwd(), opts.d);
}

let previewFile = "";

if (opts.i === "") {
  let name = ""
  fs.readdirSync(geojsonDirectory).forEach(file => {
    if (ext(file) === "geojson" || ext(file) === "json") {
      previewFile = path.resolve(geojsonDirectory, file)
      name = file.replace("." + ext(file), "")
    }
    validate(path.resolve(geojsonDirectory, file), tileDirectory, opts)
  });
  // console.log(previewFile)
  if (opts.p && opts.f === "directory") startServer(tileDirectory, previewFile, name);
}else{
  previewFile = path.resolve(process.cwd(), opts.i)
  validate(opts.i, tileDirectory, opts)
  if (opts.p && opts.f === "directory") startServer(tileDirectory, previewFile, path.basename(previewFile).replace("." + ext(opts.i), ""));
}