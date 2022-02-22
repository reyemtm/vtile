
module.exports = [
  {
    name: "input",
    abbr: "i",
    default: "",
    help: "your geojson file if not using a directory, path must be relative, layer name will be the name of the file (no spaces please)"
  },
  {
    name: "geojson-dir",
    type: "string",
    abbr: "d",
    default: "./",
    help: "directory of geojson you want to convert"
  },
  {
    name: "tiles-dir",
    type: "string",
    abbr: "t",
    default: "tiles/",
    help: "directory to store the vector tiles"
  },
  {
    name: "minzoom",
    type: "integer",
    abbr: "z",
    default: 0,
    help: "min zoom level to build tiles"
  },
  {
    name: "maxzoom",
    type: "integer",
    abbr: "Z",
    default: 7,
    help: "max zoom to build tiles (tiles will overzoom in mapbox gl, leaflet and ol3)"
  },
  {
    name: "tolerance",
    type: "integer",
    abbr: "s",
    default: 3,
    help: "simplification tolerance setting for geojson-vt"
  },
  {
    name: "extract",
    type: "string",
    abbr: "x",
    default: [""],
    help: "remove these properties from the geojson data, one entry for each field ie -x ID -x Name"
  },
  {
    name: "output",
    type: "boolean",
    abbr: "o",
    default: false,
    help: "output the geojson, useful if using the extract option"
  },
  {
    name: "write",
    type: "boolean",
    abbr: "w",
    help: "CHANGED default true, vtile will not write tiles if set to false",
    default: true
  },
  {
    name: "preview",
    type: "boolean",
    abbr: "p",
    help: "writes an index page in the tiles dir to preview your tiles (only the first layer in the directory if specified)",
    default: false
  },
  {
    name: "resume",
    type: "boolean",
    abbr: "r",
    help: "whether or not to delete the tile[s] directory before writing new tiles - default is to delete the tiles dir",
    default: false
  },
  {
    name: "help",
    abbr: "h",
    help: "show help",
    boolean: true
  },
  {
    name: "format",
    abbr: "f",
    help: "Format can be either directory or mbtiles",
    default: "directory"
  }
];