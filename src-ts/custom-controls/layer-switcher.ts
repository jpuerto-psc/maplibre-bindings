import "../css/custom-layer-switcher-control.css";

const THEMES: any = {
  default: "layer-switcher-ctrl",
  simple: "layer-switcher-ctrl-simple",
};

function createLayerLink(map: any, layerId: string) {
  const link = document.createElement("a");
  link.id = layerId;
  link.href = "#";
  link.textContent = layerId;
  const visibility = map.getLayoutProperty(layerId, "visibility");
  if (typeof visibility === "undefined" || visibility === "visible") {
    link.className = "active";
  }

  link.onclick = function (e) {
    // const layerIdClicked = this.textContent;
    const layerIdClicked = link.textContent;
    const visibility = map.getLayoutProperty(layerIdClicked, "visibility");
    console.log(layerIdClicked, visibility);
    if (typeof visibility === "undefined" || visibility === "visible") {
      map.setLayoutProperty(layerIdClicked, "visibility", "none");
      // this.className = "";
      link.className = "";
      return;
    }

    map.setLayoutProperty(layerIdClicked, "visibility", "visible");
    // this.className = "active";
    link.className = "active";
  };
  return link;
}

function createMenu(map: any, layerIds: [string]) {
  const menu = document.createElement("div");
  menu.id = "layer-switcher-menu";
  for (const layerId of layerIds) {
    const link = createLayerLink(map, layerId);
    menu.appendChild(link);
  }
  return menu;
}

export default class LayerSwitcherControl {
  _container: HTMLElement | null = null;
  _options: LayerSwitcherControlOptions;
  _map: any;

  constructor(options: LayerSwitcherControlOptions) {
    this._options = options;
  }

  onAdd(map: any) {
    this._map = map;
    this._container = document.createElement("div");
    this._container.classList.add("maplibregl-ctrl");
    this._container.classList.add(THEMES[this._options.theme || "default"]);
    this._container.style.cssText = this._options.cssText || "";
    const layerIds = this._options.layerIds;
    this._container.appendChild(createMenu(map, layerIds));
    return this._container;
  }

  onRemove() {
    this._container?.parentNode?.removeChild(this._container);
    this._map = undefined;
  }

  getDefaultPosition() {
    return "top-left";
  }
}
