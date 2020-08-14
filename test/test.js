const vtile = require("../vtile.js");

vtile({
  file: '',
  'geojson-dir': './data',
  'tiles-dir': 'tiles/',
  minzoom: 0,
  maxzoom: 7,
  tolerance: 3,
  extract: [ '' ],
  output: false,
  write: true,
  preview: false,
  resume: false
})