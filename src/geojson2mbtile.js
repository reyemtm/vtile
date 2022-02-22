/* from geojson2mvt - https://github.com/NYCPlanning/labs-geojson2mvt stale repo with no signs of updating */
/*https://github.com/mapbox/node-mbtiles*/

var fs = require("fs");
var vtpbf = require("vt-pbf");
var geojsonvt = require("geojson-vt");
var helpers = require("./geojson2mvt-helpers.js");
// var zlib = require("zlib");
const Database = require("better-sqlite3");
/*https://github.com/ChrisLoer/supertiler/blob/master/main.js/*/

var geojson2mbtile = function (options, config) {
  if (arguments.length == 2) {
    var geoJson = options;
    options = arguments[1];
    options.layers = {};
    options.layers[options.layerName] = geoJson;
  }

  const bbox = config.bbox.slice();
  const center = [(bbox[1] + bbox[3]) / 2, (bbox[0] + bbox[2]) / 2, 0];

  var layerNames = Object.keys(options.layers);

  // console.log(options, layerNames)

  var i = 0,
    ii = layerNames.length;
  var tileIndex = new Array(ii);
  for (; i < ii; ++i) {
    tileIndex[i] = geojsonvt(options.layers[layerNames[i]], {
      maxZoom: options.zoom.max,
      indexMaxZoom: options.zoom.max,
      indexMaxPoints: 0,
      tolerance: options.tolerance,
      generateId: true,
    });
  }

  // create the "root directory" to place downloaded tiles in
  try {
    if (!fs.existsSync(options.rootDir)) fs.mkdirSync(options.rootDir, 0777);
  } catch (err) {
    if (err.code !== "EEXIST") callback(err);
  }

  const db = new Database(":memory:")

  if (fs.existsSync(options.rootDir + "/" + layerNames[0] + ".mbtiles")) fs.unlinkSync(options.rootDir + "/" + layerNames[0] + ".mbtiles")

  // const db = new Database(options.rootDir + "/" + layerNames[0] + ".mbtiles", {});

  const migration = fs.readFileSync("src/schema.sql", "utf8");
  db.exec(migration);

  writeTiles(db);
  writeMetadata(db);

  console.log("Serializing the in-memory database...")
  const buffer = db.serialize();
  const fileDb = new Database(buffer)
  fileDb.backup(options.rootDir + "/" + layerNames[0] + ".mbtiles")

  function writeMetadata(db) {
    var data = {
      name: config.layerName,
      description: config.layerName,
      format: "pbf",
      version: 2,
      minzoom: config.zoom.min,
      maxzoom: config.zoom.max,
      center: center.toString(),
      bounds: [
        bbox[1].toString(),
        bbox[0].toString(),
        bbox[3].toString(),
        bbox[2].toString(),
      ].toString(),
      type: "overlay",
      scheme: "tms",
      json: `{
          "vector_layers": [
            {
              "id": "${config.layerName}",
              "description": "",
              "minzoom": ${config.zoom.min},
              "maxzoom": ${config.zoom.max},
              "fields": ${JSON.stringify(config.fields,0,2)}
            }
          ]
        }`,
    };

    var jsondata;
    var stmt = db.prepare("REPLACE INTO metadata (name, value) VALUES (?, ?)");

    for (var key in data) {
      // If a data property is a javascript hash/object, slip it into
      // the 'json' field which contains stringified JSON to be merged
      // in at read time. Allows nested/deep metadata to be recorded.
      var nested =
        typeof data[key] === "object" && key !== "bounds" && key !== "center";
      if (nested) {
        jsondata = jsondata || {};
        jsondata[key] = data[key];
      } else {
        stmt.run(key, String(data[key]));
      }
    }
    if (jsondata) stmt.run("json", JSON.stringify(jsondata));
  }

  async function writeTiles(db) {
    let tileCount = 0

    const smttVT = db.prepare(
      "REPLACE INTO tiles (zoom_level, tile_column, tile_row, tile_data) VALUES (?, ?, ?, ?)"
    );

    for (var z = options.zoom.min; z <= options.zoom.max; z++) {
      console.log(`Processing zoom ${z}`);
      
      // create an array to hold data for the whole zoom level
      const columns = [];

      // get the x and y bounds for the current zoom level
      const tileBounds = helpers.getTileBounds(options.bbox, z);
      // console.log(tileBounds)

      // x loops
      for (var x = tileBounds.xMin; x <= tileBounds.xMax; x++) {
        // console.log(`Processing column ${x}`);

        // y loop
        for (var y = tileBounds.yMin; y <= tileBounds.yMax; y++) {
          var mvt = getTile(z, x, y, tileIndex, layerNames);

          // Flip Y coordinate because MBTiles files are TMS. - see @mapbox/mbtiles
          const Y = (1 << z) - 1 - y;

          // console.log(`Processing row ${Y}`);

          if (mvt) {
            columns.push([z, x, Y, mvt]);
            // const stmt = db.prepare(
            //   "REPLACE INTO tiles (zoom_level, tile_column, tile_row, tile_data) VALUES (?, ?, ?, ?)"
            // );
            // stmt.run(z, x, Y, mvt);

            tileCount++;
          }
        }

        // const insertMany = db.transaction(col => {
        //   col.forEach(c => smttVT.run(c[0],c[1],c[2],c[3]))
        // })
  
        // insertMany(columns)

      }

      const insertMany = db.transaction(col => {
        col.forEach(c => smttVT.run(c[0],c[1],c[2],c[3]))
      })

      insertMany(columns)

    }

    console.log("Done! I made " + tileCount + " tiles!");
  }
  
};

function getTile(z, x, y, tileIndex, layerNames) {
  var pbfOptions = {};
  for (var i = 0, ii = tileIndex.length; i < ii; ++i) {
    var tile = tileIndex[i].getTile(z, x, y);

    if (tile != null) {
      pbfOptions[layerNames[i]] = tile;
    }
  }

  var opts = {
    version: 2
  };

  return Object.keys(pbfOptions).length ?
    vtpbf.fromGeojsonVt(pbfOptions, opts) :
    null;
}

module.exports = geojson2mbtile;