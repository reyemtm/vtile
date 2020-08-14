const opener = require("opener");
const preview = require("./preview.js");
const fs = require("fs");
const bbox = require("@turf/bbox");
const getCenter = require("@turf/center");
const StaticServer = require("static-server");

module.exports = function startServer(a,f,name) {

  const tileDirectory = a;

  console.log(a, name)

  var geojsonData;
  try {
    geojsonData = fs.readFileSync(f);
  }
  catch(err) {
    console.log(err);
  }
  const geojson = JSON.parse(geojsonData);
  const bounds = bbox(geojson);
  const mapBounds = [ [bounds[0], bounds[1]], [bounds[2], bounds[3]] ];
  const center = getCenter(geojson);
  fs.writeFileSync(tileDirectory + "index.html", preview(name,center.geometry.coordinates, mapBounds));

  const server = new StaticServer({
    rootPath: tileDirectory,            // required, the root of the server file tree
    name: "my-http-server",   // optional, will set "X-Powered-by" HTTP header
    port: 80,               // optional, defaults to a random port
    host: "127.0.0.1",       // optional, defaults to any interface
    cors: "*",                // optional, defaults to undefined
    followSymlink: true,      // optional, defaults to a 404 error
    templates: {
      index: "index.html",      // optional, defaults to "index.html"
      notFound: "404.html"    // optional, defaults to undefined
    }
  });

  server.start(function () {
    console.log("Server listening to", server.port);
  });
  opener("http://127.0.0.1/")
}