import { MapboxOverlay } from "@deck.gl/mapbox";
import { JSONConfiguration, JSONConverter } from "@deck.gl/json";
import * as deckLayerCatalog from "./deck-layers";

import MapboxDraw from "./mapbox-draw-plugin";

import geocoder from "../plugins/maplibre-geocoder";

import { getTextFromFeature, getDeckTooltip } from "../utils";

const jsonConverter = new JSONConverter({
  configuration: new JSONConfiguration({ layers: deckLayerCatalog }),
});

function applyMapMethod(map: maplibregl.Map, call: [string, any]): void {
  const [methodName, params] = call;
  console.log(methodName, params);

  // @ts-expect-error
  map[methodName](...params);
}

function _convertDeckLayer(deckLayers: any[]): any[] {
  return deckLayers.map((deckLayer) =>
    jsonConverter.convert(
      Object.assign(deckLayer, {
        onHover: ({ object }: { object: any }) => console.log(object),
      }),
    ),
  );
}

// Custom map methods
function getCustomMapMethods(maplibregl: any, map: maplibregl.Map) {
  let deckOverlay: any = null; // MapboxOverlay | null = null;
  let draw: any = null;

  return {
    addTooltip: function (
      layerId: string,
      property = null,
      template = null,
    ): void {
      const popupOptions = {
        closeButton: false,
        closeOnClick: false,
      };
      const popup = new maplibregl.Popup(popupOptions);

      map.on("mousemove", layerId, (e: any) => {
        const feature = e.features[0];

        // const text = feature.properties[property];
        const text = getTextFromFeature(feature, property, template);
        popup.setLngLat(e.lngLat).setHTML(text).addTo(map);
      });

      map.on("mouseleave", layerId, () => {
        popup.remove();
      });
    },

    addControl: function (
      type: string,
      options: any,
      position: maplibregl.ControlPosition,
    ): void {
      if (type === "GeocodingControl") {
        map.addControl(
          geocoder({ ...options, ...{ maplibregl: maplibregl } }),
          position,
        );
        return;
      }

      if (type === "MapTilerGeocodingControl") {
        // options.maplibregl = maplibregl;
      }

      map.addControl(new maplibregl[type](options), position);
    },

    addPopup: function (
      layerId: string,
      property: string | null = null,
      template: string | null = null,
    ): void {
      const popupOptions = {
        closeButton: false,
      };
      const popup = new maplibregl.Popup(popupOptions);
      map.on("click", layerId, (e: any) => {
        const feature = e.features[0];

        // const text = feature.properties[property];
        const text = getTextFromFeature(feature, property, template);
        popup.setLngLat(e.lngLat).setHTML(text).addTo(map);
      });
    },

    addMarker: function ({
      lngLat,
      popup,
      options,
    }: {
      lngLat: any;
      popup: Popup;
      options: maplibregl.MarkerOptions;
    }): void {
      const marker = new maplibregl.Marker(options).setLngLat(lngLat);
      if (popup) {
        const popup_ = new maplibregl.Popup(popup.options).setHTML(popup.text);
        marker.setPopup(popup_);
      }
      marker.addTo(map);
    },

    setSourceData: function (
      sourceId: string,
      data: GeoJSON.GeoJSON | string,
    ): void {
      const source: maplibregl.GeoJSONSource | undefined =
        map.getSource(sourceId);
      source?.setData(data);
      // map.getSource(sourceId).setData(data);
    },

    addDeckOverlay: function (deckLayers: [], tooltip = null): void {
      const layers = _convertDeckLayer(deckLayers);
      // console.log("deckLayers", layers);
      deckOverlay = new MapboxOverlay({
        interleaved: true,
        layers: layers,
        getTooltip: tooltip ? getDeckTooltip(tooltip) : null,
      });
      map.addControl(deckOverlay);
    },

    setDeckLayers: function (deckLayers: [], tooltip = null): void {
      console.log("Updating Deck.GL layers");
      const layers = _convertDeckLayer(deckLayers);
      // console.log("deckLayers", layers);
      deckOverlay.setProps({
        layers,
        getTooltip: tooltip ? getDeckTooltip(tooltip) : null,
      });
    },

    addMapboxDraw(
      options: any,
      position: maplibregl.ControlPosition,
      geojson = null,
    ): void {
      draw = new MapboxDraw(options);
      map.addControl(draw, position);
      if (geojson) draw.add(geojson);
    },

    getMapboxDraw: function (): MapboxDraw {
      return draw;
    },
  };
}

export { applyMapMethod, getCustomMapMethods };
