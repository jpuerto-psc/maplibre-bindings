// mapbox-gl-draw plugin: https://github.com/mapbox/mapbox-gl-draw
import MapboxDraw from "@mapbox/mapbox-gl-draw";

import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

// @ts-expect-error
MapboxDraw.constants.classes.CONTROL_BASE = "maplibregl-ctrl";

// @ts-expect-error
MapboxDraw.constants.classes.CONTROL_PREFIX = "maplibregl-ctrl-";

// @ts-expect-error
MapboxDraw.constants.classes.CONTROL_GROUP = "maplibregl-ctrl-group";

export default MapboxDraw;
