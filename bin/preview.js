var fs = require('fs');

const createMap = function(lyr, cntr, zoom) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8" />
        <title>${lyr} Preview Map</title>
        <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
        <script src="https://api.tiles.mapbox.com/mapbox-gl-js/v0.43.0/mapbox-gl.js"></script>
        <link href="https://api.tiles.mapbox.com/mapbox-gl-js/v0.43.0/mapbox-gl.css" rel="stylesheet" />
        <script src="https://cdn.jsdelivr.net/npm/mapbox-gl-inspect@1.2.5/dist/mapbox-gl-inspect.min.js"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/mapbox-gl-inspect@1.2.5/dist/mapbox-gl-inspect.min.css">
        <style>
            body { margin:0; padding:0; }
            #map { position:absolute; top:0; bottom:0; width:100%; }
        </style>
    </head>
    <body>

    <div id="map"></div>
    <script>
    var map = new mapboxgl.Map({
        container: "map",
        style: {
            "version": 8,
            "name": "blank",
            "sources": {
                "${lyr}preview": {
                    "type": "vector",
                    "url": "${lyr}/${lyr}-tilejson.json"
                }
            },
            "layers": [{
                "id": "background",
                "type": "background",
                "paint": {
                    "background-color": "whitesmoke"
                }
            },{
                "id": "${lyr}1",
                "type": "fill-extrusion",
                "source": "${lyr}preview",
                "source-layer": "${lyr}",
                "paint": {
                    "fill-extrusion-color": "whitesmoke",
                    "fill-extrusion-height": {
                    "type": "identity",
                    "property": "render_height"
                    },
                    "fill-extrusion-opacity": 1
                },
                "visibility": "visible",
                "filter": ["has", "render_height"]
                },
            {
                "id": "${lyr}2",
                "type": "fill",
                "source": "${lyr}preview",
                "source-layer": "${lyr}",
                "paint": {
                "fill-color": "whitesmoke",
                "fill-outline-color": "orange"
                },
                "visibility": "visible",
                "filter": ["==", "$type", "Polygon"]
            },
            {
                "id": "${lyr}3",
                "type": "line",
                "source": "${lyr}preview",
                "source-layer": "${lyr}",
                "paint": {
                "line-color": "orange"
                },
                "visibility": "visible",
                "filter": ["==", "$type", "LineString"]
            },
            {
                "id": "${lyr}4",
                "type": "circle",
                "source": "${lyr}preview",
                "source-layer": "${lyr}",
                "paint": {
                "circle-radius": {
                    "stops": [
                    [0,1],
                    [4, 2],
                    [14,6]
                    ]
                },
                "circle-color": "orange",
                "circle-stroke-color":"white"
                },
                "visibility": "visible"
            }
        ]
        },
        center: [${cntr}],
        zoom: 4,
        hash: true
    });

    map.addControl(new mapboxgl.NavigationControl());
    map.addControl(new MapboxInspect({
      showInspectMap: true
    }));
    </script>

    </body>
    </html>
    `
};
/*var writePreview = function (dir, p) {
    try{fs.mkdirSync(dir, 0777)}
    catch(err){};
    fs.writeFileSync(dir + 'index.html', writePreview(p));
}*/

module.exports = createMap
