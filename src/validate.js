const ext = require("file-extension");
const geojsonTest = require("geojson-validation");
const fs = require("fs");
const path = require("path");
const write = require("./write.js")
const uuidv1 = require("uuid/v1");
const rewind = require("@mapbox/geojson-rewind")

module.exports = function validate(gj, tileDirectory, options) {
    // console.log(gj)
    if (ext(gj) === "geojson" || ext(gj) === "json") {
      const tileLayerName = (path.basename(gj)).replace(/\..+$/,"");
      // console.log(tileLayerName);
      try {
          console.log("trying to read " + gj);
          // var gjFile = path.join(process.cwd(), gj);
          var tmpFile = fs.readFileSync(gj);
          var tmpGeoJSON = JSON.parse(tmpFile)
        try {
          if (options.x) {
            tmpGeoJSON.features.forEach(feature => {
              for (var p in feature.properties) {
                if (options.x.indexOf(p) > -1) {
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
          const rewound = rewind(tmpGeoJSON)
          geojsonTest.valid(rewound);
          console.log("valid geojson found!");
          if (options.o) {
            fs.writeFileSync(tileDirectory + tileLayerName + ".geojson", JSON.stringify(rewound));
          }
          write(rewound, tileLayerName, options)
        }catch(err){
          console.log(err)
        }
      }catch(err){
        console.log("Something went wrong with " + gj + "\n" + err + "\n" + "Exiting vtile :(");
        process.exit();
      }
    }
  }