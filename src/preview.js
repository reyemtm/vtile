var fs = require('fs');

const createMap = function(lyr, cntr, bounds) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8" />
        <title>${lyr} Preview Map</title>
        <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
        <script src='https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.js'></script>
        <link href='https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css' rel='stylesheet' />
        <script src='https://github.com/lukasmartinelli/mapbox-gl-inspect/releases/download/v1.3.1/mapbox-gl-inspect.js'></script>
        <style>
            body { margin:0; padding:0; }
            #map { position:absolute; top:0; bottom:0; width:100%; }
            .mapbox-gl-inspect_popup {
              color: #333;
              display: table;
            }
            
            .mapbox-gl-inspect_feature:not(:last-child) {
              border-bottom: 1px solid #ccc;
            }
            
            .mapbox-gl-inspect_layer:before {
              content: '#';
            }
            
            .mapbox-gl-inspect_layer {
              display: block;
              font-weight: bold;
            }
            
            .mapbox-gl-inspect_property {
              display: table-row;
            }
            
            .mapbox-gl-inspect_property-value {
              display: table-cell;
            
            }
            
            .mapbox-gl-inspect_property-name {
              display: table-cell;
              padding-right: 10px;
            }
            
            .mapboxgl-ctrl-inspect {
              background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23333333' preserveAspectRatio='xMidYMid meet' viewBox='-10 -10 60 60'%3E%3Cg%3E%3Cpath d='m15 21.6q0-2 1.5-3.5t3.5-1.5 3.5 1.5 1.5 3.5-1.5 3.6-3.5 1.4-3.5-1.4-1.5-3.6z m18.4 11.1l-6.4-6.5q1.4-2.1 1.4-4.6 0-3.4-2.5-5.8t-5.9-2.4-5.9 2.4-2.5 5.8 2.5 5.9 5.9 2.5q2.4 0 4.6-1.4l7.4 7.4q-0.9 0.6-2 0.6h-20q-1.3 0-2.3-0.9t-1.1-2.3l0.1-26.8q0-1.3 1-2.3t2.3-0.9h13.4l10 10v19.3z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E");
            }
            
            .mapboxgl-ctrl-map {
              background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23333333' viewBox='-10 -10 60 60' preserveAspectRatio='xMidYMid meet'%3E%3Cg%3E%3Cpath d='m25 31.640000000000004v-19.766666666666673l-10-3.511666666666663v19.766666666666666z m9.140000000000008-26.640000000000004q0.8599999999999923 0 0.8599999999999923 0.8600000000000003v25.156666666666666q0 0.625-0.625 0.783333333333335l-9.375 3.1999999999999993-10-3.5133333333333354-8.906666666666668 3.4383333333333326-0.2333333333333334 0.07833333333333314q-0.8616666666666664 0-0.8616666666666664-0.8599999999999994v-25.156666666666663q0-0.625 0.6233333333333331-0.7833333333333332l9.378333333333334-3.198333333333334 10 3.5133333333333336 8.905000000000001-3.4383333333333344z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E");
            }
            
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
      showInspectMap: false
    }));
    console.log("bounds", ${bounds})
    map.on('load', function() {
      map.fitBounds([[${bounds[0]}],[${bounds[1]}]])
    });
    </script>

    </body>
    </html>
    `
};

module.exports = createMap
