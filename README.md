# vtile
### Static vector tiles from a single GeoJSON file. 

    npm install -g

    vtile -f "sample.geojson" -w -p -Z 8"``

This is project relies heavily on TurfJS and geojson2mvt.

For options use ``vtile -h``.

Still in development. For any issues regarding tile creation see geojson2mvt or geojson-vt. geojson2mvt allows for multiple layers, while this project only allows for one layer at this time.

Sample GeoJSON file from here - http://eric.clst.org/tech/usgeojson/
