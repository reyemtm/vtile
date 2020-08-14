const bbox = require("@turf/bbox");
const fs = require("fs-extra");
const getcenter = require("@turf/center");
const geojson2mvt = require("./geojson2mvt");
const path = require("path")

module.exports = function writeTiles(data, name, options) {
  const geojson = data;
  //TIMER 
  const start = Date.now();

  const layerDirectory = path.join(process.cwd(), options.t + name + "/");
  if (!options.r) {
    console.log("removing all files in ", layerDirectory, "!");
    try {
      fs.removeSync(path.join(layerDirectory));
    }catch(e){
      console.log(e)
    }
  }

  if (!fs.existsSync(layerDirectory) && (options.p || options.w)) {
    fs.mkdirSync(layerDirectory);
  }

  const bounds = bbox(geojson);
  const center = getcenter(geojson);

  // console.log("bounds: ", bounds);
  // console.log("center: ", center);
  //console.log([bounds[1], bounds[0], bounds[3], bounds[2]]);

  // write metadata/tilejson and load into map for center and minZoom for tiles
  const tilejson = {
    "name":name,
    "scheme":"xyz",
    "tiles":[
      "http://127.0.0.1/" + name + "/{z}/{x}/{y}.mvt"
    ],
    "vector_layers":[{
        "id":name,
        "minzoom":options.z,
    }],
    "bounds": bounds,
    "minzoom": options.z,
    "maxzoom": options.Z
  };

  if (options.w) {
    // console.log("trying to write tilejson");
    // console.log(layerDirectory + name + "-tilejson.json");
    // console.log(JSON.stringify(tilejson));
    fs.writeFile(layerDirectory + name + "-tilejson.json", JSON.stringify(tilejson, null, 2), function() {
      console.log("successfully wrote tilejson", layerDirectory + name + "-tilejson.json")
    });
  }

  var mvtoptions = {
      rootDir: layerDirectory,
      bbox: [bounds[1], bounds[0], bounds[3], bounds[2]], //[south,west,north,east]
      zoom: {
          min: options.z,
          max: options.Z,
      },
      layerName: name,
      tolerance: options.s
  };

  if (!options.w) {
      console.log(options.w);
      console.log("not writing tiles, script complete");
  }else{
    geojson2mvt(geojson, mvtoptions);
    console.log("tiles done at " + ((Date.now() - start)/1000) + " seconds");
  }
}