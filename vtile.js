#!/usr/bin/env node

var path = require("path"),
  fs = require("fs-extra"),
  validate = require("./src/validate");
  const params = require("./src/options.js")

module.exports = function vtile(args) {

  const opts = createOptionsObject(params)

  if (args) {
    var pkeys = Object.keys(opts);
    for (var k in args) {
      opts[k] = args[k];
      opts[pkeys[pkeys.indexOf(k) + 1]] = args[k]
    }
  }

  opts.w = (opts.w === true || opts.w === "true" || opts.write === true || opts.write === "true") ? true : false;
  opts.write = opts.w;
  console.log(opts);

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

  var tileDirectory = path.join(process.cwd(), opts.t);

  console.log(tileDirectory);

  if (!fs.existsSync(tileDirectory)) {
    fs.mkdirSync(tileDirectory);
  }

  if (!opts.f) {
    var geojsonDirectory = path.resolve(process.cwd(), opts.d);
  }

  if (opts.f === "") {
    fs.readdirSync(geojsonDirectory).forEach(file => {
      validate(path.resolve(geojsonDirectory, file), tileDirectory, opts)
    });
  }else{
    validate(opts.f, tileDirectory, opts)
  }
}

function createOptionsObject(array) {

  const options = {};

  array.forEach(a => {
    
    if (a.name != "help") options[a.name] = a.default;
    if (a.name != "help") options[a.abbr] = a.default;
  })

  return options
}