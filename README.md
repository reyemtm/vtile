# vtile
### Static vector tiles from a single GeoJSON file.

Install (Size installed - 10.5 MB, ``tylr`` size installed 112 MB)

    npm install vtile -g

Then to create vector tiles for a single file:

    vtile -f "sample.geojson" -l ohio -w -p -Z 8

Or a directory of files:

    vtile -w -z 0 Z 14

**v 0.1.7** vtile adds a field to each feature called vtlid which is a unique identifier for each feature - if this conflicts with a field you already have you will need to edit the vtile.js file

**v 0.1.4** vtile will delete one or more fields from your geojson, and optionally output that geojson file

**v 0.1.3** vtile will tile all geojson files in a folder, with the layer names in the tiles being the file names. If you just want to convert one file, simply add that file ``-f "./data/ohio.geojson"``.

Tiles are created in a '/tiles/your file name/' folder in the current working directory, both of which can be configured. A tilejson is created in the '/tiles/your file name/' folder, and if ``-p`` is added, an index page is created in the '/tiles/' folder and opened to preview the tiles. If tiling all files in a folder, the preview only will add the first file.

![](vtile.gif)

For options use ``vtile -h``.

```
Usage: command [options]
    --file, -f            your geojson file (default: "sample.geojson")
    --tiles-dir, -t       directory to store the vector tiles (default: "tiles/")
    --layer, -l           the name of your layer in your vector tile (default: filename) *only if using the -f option
    --geojson-dir, -d     directory of geojson you want to convert (default './')
    --minzoom, -z         min zoom level to build tiles (default: 0)
    --maxzoom, -Z         max zoom to build tiles (tiles will overzoom in mapbox gl, leaflet and ol3) (default: 7)
    --extract, -x         remove these propertiesfrom the geojson file, one for each field, i.e -x "COUNTY" -x "Shape_Length"
    --output, -o          output the geojson, useful if using the extract option
    --write, -w           vtile will not write tiles unless -w or -w true (default: false)
    --preview, -p         writes an index page in the tiles dir to preview your tiles (default: false)
    --resume, -r          vtile will delete all the files and folders in the tiles directory unless this is true (default: false)
    --help, -h            show help
```

This project uses [TurfJS](https://github.com/Turfjs/turf/) to automate static vector tile creation using [geojson2mvt](https://github.com/NYCPlanning/geojson2mvt). Only turf/center and turf/bbox are used.

Still in development. For any issues regarding tile creation see geojson2mvt or [geojson-vt](https://github.com/mapbox/geojson-vt).

Sample GeoJSON file from here - http://eric.clst.org/tech/usgeojson/
