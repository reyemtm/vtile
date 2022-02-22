const bbox = require("@turf/bbox").default;
const fs = require("fs-extra");
const geojson2mvt = require("./geojson2mvt");
const geojson2mbtile = require("./geojson2mbtile")
const path = require("path")

module.exports = function writeTiles(data, name, options, fields) {
  const geojson = data;

  //TIMER 
  const start = Date.now();

  const layerDirectory = path.resolve(process.cwd(), options.t, name + "/");
  if (!options.r) {
    console.log("removing all files in ", layerDirectory, "!");
    try {
      fs.removeSync(layerDirectory);
    } catch (e) {
      console.log(e)
    }
  }

  if (!fs.existsSync(layerDirectory) && (options.p || options.w)) {
    fs.mkdirSync(layerDirectory);
  }

  const bounds = bbox(geojson);

  const tilejson = {
    "name": name,
    "scheme": "xyz",
    "tiles": [
      "http://127.0.0.1/" + name + "/{z}/{x}/{y}.mvt"
    ],
    "vector_layers": [{
      "id": name,
      "minzoom": options.z,
      "fields": fields
    }],
    "bounds": bounds,
    "minzoom": options.z,
    "maxzoom": options.Z
  };

  if (options.w && options.f === "directory") {
    fs.writeFile(layerDirectory + "/" + name + "-tilejson.json", JSON.stringify(tilejson, null, 2), function () {
      // console.log("successfully wrote tilejson", name + "-tilejson.json")
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
    tolerance: options.s,
    fields: fields
  };

  if (!options.w) {
    console.log("not writing tiles, script complete");
  } else {
    if (options.f === "directory") {
      geojson2mvt(geojson, mvtoptions);
    }else{
      geojson2mbtile(geojson, mvtoptions);
    }
    console.log("tiles done at " + ((Date.now() - start) / 1000) + " seconds");
  }
}