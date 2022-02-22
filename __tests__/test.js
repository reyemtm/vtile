const vtile = require("../index.js");

vtile({
  file: '',
  'geojson-dir': './data',
  'tiles-dir': 'tiles/',
  minzoom: 5,
  maxzoom: 6,
  tolerance: 3,
  extract: [],
  output: false,
  write: true,
  preview: false,
  resume: false
});

vtile({
  file: '',
  'geojson-dir': './data',
  'tiles-dir': 'tiles-mbtiles/',
  format: "mbtiles",
  minzoom: 5,
  maxzoom: 6,
  tolerance: 3,
  extract: [],
  output: false,
  write: true,
  preview: false,
  resume: false
})