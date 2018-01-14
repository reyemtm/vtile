# vtile
### Static vector tiles from a single GeoJSON file. 

Install

    npm install -g

Then to create vector tiles.

    vtile -f "sample.geojson" -w -p -Z 8"
    
Tiles are created in a '/tiles/layer/' folder in the current working directory, both of which can be configured. A tilejson is created in the '/tiles/layer/' folder, and if ``-p`` is added, an index page is created in the '/tiles/' folder and opened to preview the tiles.

For options use ``vtile -h``.

This project uses TurfJS to automate static vector tile creation using geojson2mvt.

Still in development. For any issues regarding tile creation see geojson2mvt or geojson-vt. geojson2mvt allows for multiple layers, while this project only allows for one layer at this time.

Sample GeoJSON file from here - http://eric.clst.org/tech/usgeojson/
