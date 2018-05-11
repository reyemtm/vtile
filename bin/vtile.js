#!/usr/bin/env node

var bbox = require('@turf/bbox'),
  path = require('path'),
  getcenter = require('@turf/center'),
  geojson2mvt = require('geojson2mvt'),
  fs = require('fs-extra'),
  minimist = require('minimist'),
  preview = require('./preview.js'),
  cliclopts = require('cliclopts'),
  opener = require('opener'),
  geojsonTest = require('geojson-validation'),
  ext = require('file-extension'),
  uuidv1 = require('uuid/v1');


var allowedOptions = [
  {
    name: "file",
    abbr: 'f',
    default: '',
    help: 'your geojson file'
  },
  {
    name: 'layer',
    type: 'string',
    abbr: 'l',
    default: '',
    help: 'the name of your layer in your vector tile'
  },
  {
    name: "geojson-dir",
    type: "string",
    abbr: "d",
    default: "./",
    help: "directory of geojson files you want to convert"
  },
  {
    name: "tiles-dir",
    type: 'string',
    abbr: 't',
    default: 'tiles/',
    help: 'directory to store the vector tiles'
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
    default: 7,
    help: "max zoom to build tiles (tiles will overzoom in mapbox gl, leaflet and ol3)"
  },
  {
    name: 'extract',
    type: 'string',
    abbr: 'x',
    default: [''],
    help: 'remove these properties from the geojson data, one entry for each field ie -x ID -x Name'
  },
  {
    name: 'output',
    type: 'boolean',
    abbr: 'o',
    default: false,
    help: 'output the geojson, useful if using the extract option'
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
    help: 'writes an index page in the tiles dir to preview your tiles (only the first layer in the directory if specified)',
    default: false
  },
  {
    name: 'resume',
    type: 'boolean',
    abbr: 'r',
    help: 'whether or not to delete the tile[s] directory before writing new tiles - default is to delete the tiles dir',
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

var opts = minimist(process.argv.slice(2), options.options());
console.log(opts);

if (opts.h) {
  console.log('vtile creates vector tiles in mvt format from a geojson file \n \n Usage: command [options]')
  options.print()
  process.exit()
}

if (opts.z < 0) {
    throw error
}
if (opts.Z > 20) {
    console.log('Very high zoom level detected, stopping application. A zoom level of 14 to 16 is likely sufficient.');
    throw error
}

console.log(process.cwd());

var tileDirectory = path.join(process.cwd(), opts.t);

console.log(tileDirectory);

if (!fs.existsSync(tileDirectory)) {
  fs.mkdirSync(tileDirectory);
}else{

}

var tileLayerName = "";

var start = Date.now();
/**/

if (!opts.f) {
  var geojsonDirectory = path.join(process.cwd(), opts.d);
}
var geojsonFiles = [];

var mapCenter = [];

/*
check if a single file is specified, else run through the default or specified directory
*/

/*
validate geojson
*/

function validateGeoJSON(gj, i) {
  console.log(gj)
  if (ext(gj) === 'geojson' || ext(gj) === 'json') {
    console.log('trying to read ' + gj);
    var tileLayerName = (path.basename(gj)).replace(/\..+$/,'');
    console.log(tileLayerName);
    try {
      if (!opts.f) {
        var tmpFile = fs.readFileSync(geojsonDirectory + gj)
        var tmpGeoJSON = JSON.parse(tmpFile)
       }else{
        var gjFile = path.join(process.cwd(), gj);
        var tmpFile = fs.readFileSync(gjFile);
        var tmpGeoJSON = JSON.parse(tmpFile)
      }
      try {
        if (opts.x) {
          tmpGeoJSON.features.forEach(feature => {
            for (var p in feature.properties) {
              if (opts.x.indexOf(p) > -1) {
                delete feature.properties[p];
              }
            }
            feature.properties["vtlid"] = uuidv1(); /*generate unique id for each feature*/
            return feature;
          });
        }else{
          tmpGeoJSON.features.forEach(feature => {
            feature.properties["vtlid"] = uuidv1();
            return feature
          })
        }
        geojsonTest.valid(tmpGeoJSON);
        console.log('valid geojson found!');
        geojsonFiles.push(tileLayerName);
        if (opts.o) {
          fs.writeFileSync(tileDirectory + tileLayerName + ".geojson", JSON.stringify(tmpGeoJSON));
        }
        writeTiles(tmpGeoJSON, tileLayerName)
      }catch(err){
        console.log(err)
      }
    }catch(err){
      console.log('Something went wrong with ' + gj + '\n' + err + '\n' + 'Exiting vtile :(');
      process.exit();
    }
  }
}

function writeTiles(data, name) {

  var layerDirectory = path.join(process.cwd(), opts.t + name + "/");
  if (!opts.r) {
    console.log('removing all files in ', layerDirectory, '!');
    try {
      fs.removeSync(path.join(layerDirectory));
    }catch(e){
      console.log(e)
    }
  }

  if (!fs.existsSync(layerDirectory) && (opts.p || opts.w)) {
    fs.mkdirSync(layerDirectory);
  }

  var geojson = data;

  var bounds = bbox(geojson);
  var center = getcenter(geojson);

  if (geojsonFiles.length === 1) {
    mapCenter = center;
  }

  console.log("bounds: ", bounds);
  console.log("center: ", center);
  //console.log([bounds[1], bounds[0], bounds[3], bounds[2]]);
  var boundstime = Date.now();

  // write metadata/tilejson and load into map for center and minZoom for tiles


  var tilejson = {
    "name":name,
    "scheme":"tms",
    "tiles":[
      'http://127.0.0.1/' + name + '/{z}/{x}/{y}.mvt'
    ],
    "vector_layers":[{
        "id":name,
        "minzoom":opts.z,
    }],
    "bounds": bounds,
    "minzoom": opts.z
  };

  if (opts.w) {
    console.log('trying to write tilejson');
    console.log(layerDirectory + name + "-tilejson.json");
    console.log(JSON.stringify(tilejson));
    fs.writeFile(layerDirectory + name + "-tilejson.json", JSON.stringify(tilejson), function() {
      console.log('successfully wrote tilejson')
    });
  }

  var mvtoptions = {
      rootDir: layerDirectory,
      bbox: [bounds[1], bounds[0], bounds[3], bounds[2]], //[south,west,north,east]
      zoom: {
          min: opts.z,
          max: opts.Z,
      },
      layerName: name
  };
  console.log(mvtoptions)

  if (!opts.w) {
      console.log(opts.w);
      console.log('not writing tiles, script complete');
  }else{
    geojson2mvt(geojson, mvtoptions);
    var tiled = Date.now();
    console.log("tiles done at " + ((tiled - start)/1000) + ' seconds');
  }
}

if (opts.f === '') {
  fs.readdirSync(geojsonDirectory).forEach(file => {
    validateGeoJSON(file)
  });
  console.log(geojsonFiles)
  startServer();
}else{
  validateGeoJSON(opts.f);
  startServer();
}

/*
write an index.html file and start web server if asked
*/

function startServer() {
  if (!opts.p) {
      console.log(opts.p)
  }else
  {
    if (opts.f === '') {
      fs.writeFileSync(tileDirectory + 'index.html', preview(geojsonFiles[0],mapCenter.geometry.coordinates,8));
    }else{
      fs.writeFileSync(tileDirectory + 'index.html', preview(tileLayerName,mapCenter.geometry.coordinates,8));
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
  }
}
