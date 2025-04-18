// python3 -m http.server

"use strict";

const CARTO_THEME = "dark-matter";

console.log("test");

const layer = {
    id: "earthquakes",
    type: "circle",
    source: {
        type: "geojson",
        data: "https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson"
    },
    paint: {
        "circle-color": "yellow"
    }
};

const mapData = {
    mapOptions: {
        style: `https://basemaps.cartocdn.com/gl/${CARTO_THEME}-gl-style/style.json`,
        center: [-87.61694, 41.86625],
        zoom: 4, // 17 to see fly move
        pitch: 40,
        bearing: 20,
        antialias: true,
    },
    calls: [
        ["addLayer", [layer]],
        ["flyTo", [{ "center": [-87.61694, 41.7] }]],
        ["addControl", ["NavigationControl"]],
        ["addControl", ["LayerSwitcherControl", { layerIds: ["earthquakes"] }]],
        ["addControl", ["InfoBoxControl", { content: "Hi there!", cssText: "background: yellow; padding: 20px; color: blue;" }, "top-left"]],
        // ["addControl", ["MapTilerGeocodingControl", { apiKey: "maptiler-api-key" }]],
    ]
};

pymaplibregl(mapData);
