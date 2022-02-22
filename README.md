# vtile

A simple Node and command line tool to create vector tiles (directory or mbtiles) in JavaScript from one or more geojson files using geojson2mvt, geojson-vt, and TurfJS.

    npm install vtile -g

Then to create vector tiles for a single file:

    vtile -i "./data/ohio.geojson" -f directory

> For large input files increase the available Node memory ``--max-old-space-size=8192``.

For a directory of files simple call `vtile` in the directory of geojson files or point it to a directory:

    vtile -d "./data/"

## Benchmarks for Formats

**Writing to mbtiles is 10x-70x faster!**

### Directory

``-Z 15 -i ohio.geojson -f directory``

``` 
Done! I made 168030 tiles!
tiles done at 158.639 seconds
```

### MBTiles

``-Z 15 -i ohio.geojson -f mbtiles``

```
Done! I made 168030 tiles!
tiles done at 3.933 seconds
```

---

![](vtile.gif)

**v 1.0.0**
 - **Breaking Changes** `-f is now -i` and `-f` translates to the output format, either `-f mbtiles` or `-f directory`.
 - Added writing vector tiles to mbtiles format using `better-sqlite3`.
 - The `mbtiles` output can be viewed with [mbview](https://github.com/mapbox/mbview) or any mbtiles server.

---

**v 0.2.0** 
 - `vtile` now writes tiles by default, just use the -f option `vtile -f data/ohio.geojson` and tiles will be created in a 'tiles' folder in the working directory.
 - Preview map zooms to the layer extent.
 - Features are given a numeric, ascending feature id to use with the Mapbox GL JS [feature state](https://www.mapbox.com/mapbox-gl-js/example/hover-styles/).
 - geojson-vt has been updated to the latest version.

**v 0.1.7** vtile adds a field called *vtlid* to each feature called vtlid which is a unique identifier for each feature - if this conflicts with a field you already have you will need to edit the vtile.js file

**v 0.1.4** vtile will delete one or more fields from your geojson, and optionally output that geojson file

**v 0.1.3** vtile will tile all geojson files in a folder, with the layer names in the tiles being the file names. If you just want to convert one file, simply add that file ``-f "./data/ohio.geojson"``.

Tiles are created in a '/tiles/your file name/' folder in the current working directory, both of which can be configured. A tilejson is created in the '/tiles/your file name/' folder, and if ``-p`` is added, an index page is created in the '/tiles/' folder and opened to preview the tiles. If tiling all files in a folder, the preview only will add the first file.

For options use ``vtile -h``.

```
Usage: command [options]
    --format, -f          output format, choices are mbtiles or directory (default: directory)
    --input, -i           your geojson file if not using directory option
    --tiles-dir, -t       directory to store the vector tiles (default: "tiles/")
    --geojson-dir, -d     directory of GeoJSON files you want to convert (default './')
    --minzoom, -z         min zoom level to build tiles (default: 0)
    --maxzoom, -Z         max zoom to build tiles (tiles will overzoom in mapbox gl, leaflet and ol3) (default: 5)
    --extract, -x         remove these properties from the geojson file(s), one for each field, i.e -x "COUNTY" -x "Shape_Length"
    --output, -o          output the geojson file(s), useful if using the extract option
    --write, -w           vtile will not write any tiles with -w false (default: true)
    --preview, -p         writes an index.html page in the tiles dir to preview your tiles (default: false)
    --resume, -r          vtile will delete all the files and folders in the tiles directory unless this is true (default: false)
    --help, -h            show help
```

This project uses [TurfJS](https://github.com/Turfjs/turf/) to automate vector tile creation in JavaScript using [geojson2mvt](https://github.com/NYCPlanning/geojson2mvt), which uses [geojson-vt](https://github.com/mapbox/geojson-vt) internally.

Sample GeoJSON file from here - http://eric.clst.org/tech/usgeojson/