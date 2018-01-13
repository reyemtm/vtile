#!/usr/bin/env node

var bbox = require('@turf/bbox'),
  path = require('path'),
  getcenter = require('@turf/center'),
  geojson2mvt = require('geojson2mvt'),
  fs = require('fs'),
  minimist = require('minimist'),
  preview = require('./preview.js'),
  cliclopts = require('cliclopts'),
  opener = require('opener');

var allowedOptions = [
  {
    name: "file",
    abbr: 'f',
    default: 'sample.geojson',
    help: 'your geojson file'
  },
  {
    name: "dir",
    type: 'string',
    abbr: 'd',
    default: 'tiles/',
    help: 'directory to store the vector tiles'
  },
  {
    name: 'layer',
    type: 'string',
    abbr: 'l',
    default: 'layer',
    help: 'the name of your layer in your vector tile'
  },
  {
    name: "minzoom",
    type: 'integer',
    abbr: 'z',
    default: 0,
    help: "min zoom level to build tiles"
  },
  {
    name: "maxzoom",
    type: 'integer',
    abbr: 'Z',
    default: 10,
    help: "max zoom to build tiles (tiles will overzoom in mapbox gl, leaflet and ol3)"
  },
  {
    name: "write",
    type: 'boolean',
    abbr: 'w',
    help: "vtile will not write tiles unless -w or -w true",
    default: false
  },
  {
    name: 'preview',
    type: 'boolean',
    abbr: 'p',
    help: 'writes an index page in the tiles dir to preview your tiles, open at port 80 in tiles dir',
    default: false
  },
  {
    name: 'help',
    abbr: 'h',
    help: 'show help',
    boolean: true
  }
]
var options = cliclopts(allowedOptions);

var opts = minimist(process.argv.slice(2), options.options())

if (opts.help) {
  console.log('vtile creates vector tiles in mvt format from a geojson file \n \n Usage: command [options]')
  options.print()
  process.exit()
}

if (opts.z < 0) {
    throw error
}
if (opts.Z > 20) {
    console.log('Very high zoom level detected, stopping application.');
    throw error
}
console.log(process.cwd());
var tileDirectory = path.join(process.cwd(), opts.d);
console.log(tileDirectory);
if (!fs.existsSync(tileDirectory)) {
  fs.mkdirSync(tileDirectory);
}

var layerDirectory = tileDirectory + opts.l;

if (!fs.existsSync(layerDirectory) && (opts.p || opts.w)) {
  fs.mkdirSync(layerDirectory);
}

var start = Date.now();

console.log("starting to read " + opts.f + " at " + start);

var geojson = JSON.parse(fs.readFileSync((opts.f), 'utf8'));

var read = Date.now();

console.log('done reading geojson in ' + (read - start));

var bounds = bbox(geojson);
var center = getcenter(geojson);

console.log("bounds: ", bounds);
console.log("center: ", center);
//console.log([bounds[1], bounds[0], bounds[3], bounds[2]]);
var boundstime = Date.now();
console.log('bounds and center finished in ' + (boundstime - read));

// write metadata/tilejson and load into map for center and minZoom for tiles


var tilejson = {
  "name":opts.l,
  "scheme":"tms",
  "tiles":[
    'http://127.0.0.1/' + opts.l + '/{z}/{x}/{y}.mvt'
  ],
  "vector_layers":[{
      "id":opts.l,
      "minzoom":opts.z,
  }],
  "bounds": bounds,
  "minzoom": opts.z
};

fs.writeFile(layerDirectory + "/" + opts.l + "-tilejson.json", JSON.stringify(tilejson));

var mvtoptions = {
    rootDir: layerDirectory,
    bbox: [bounds[1], bounds[0], bounds[3], bounds[2]], //[south,west,north,east]
    zoom: {
        min: opts.z,
        max: opts.Z,
    },
    layerName: opts.l
};
console.log(mvtoptions)

if (!opts.w) {
    console.log(opts.w);
    console.log('not writing tiles, script complete');
}else{
    geojson2mvt(geojson, mvtoptions);
    var tiled = Date.now();
    console.log("tiles done at " + ((tiled - boundstime)/1000) + ' seconds');
}
if (!opts.p) {
    console.log(opts.p)
}else{
    fs.writeFileSync(tileDirectory + 'index.html', preview(opts.l,center.geometry.coordinates,8));
}
var StaticServer = require('static-server');
var server = new StaticServer({
  rootPath: tileDirectory,            // required, the root of the server file tree
  name: 'my-http-server',   // optional, will set "X-Powered-by" HTTP header
  port: 80,               // optional, defaults to a random port
  host: '127.0.0.1',       // optional, defaults to any interface
  cors: '*',                // optional, defaults to undefined
  followSymlink: true,      // optional, defaults to a 404 error
  templates: {
    index: 'index.html',      // optional, defaults to 'index.html'
    notFound: '404.html'    // optional, defaults to undefined
  }
});

server.start(function () {
  console.log('Server listening to', server.port);
});
opener('http://127.0.0.1/')
