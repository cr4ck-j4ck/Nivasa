import "./map.css";
import React, { useRef, useEffect } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import "./map.css";
import Nivasa from "/Nivasa-removebg-preview.png";

export default function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  22.735;
  const tokyo = { lng: 75.877783, lat: 22.735499 };
  const zoom = 14;
  maptilersdk.config.apiKey = "gK4Q7BnveK2c58RGmTDU";
  useEffect(() => {
    if (map.current) return;

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [tokyo.lng, tokyo.lat],
      zoom: zoom,
      scrollWheelZoom: false,
    });
    map.current.scrollZoom.disable();
    map.current.on("dblclick", (e) => {
      map.current.zoomIn({ around: e.lngLat });
    });

    map.current.getCanvas().addEventListener("contextmenu", (e) => {
      e.preventDefault(); // prevent default right-click menu
    });

    map.current.getCanvas().addEventListener("dblclick", (e) => {
      if (e.button === 2) {
        // Right double-click → zoom out
        map.current.zoomOut({
          around: map.current.unproject([e.clientX, e.clientY]),
        });
      }
    });

    const markerEl = document.createElement("div");
    markerEl.className = "custom-marker";
    markerEl.style.backgroundImage = `url(${Nivasa})`;

    new maptilersdk.Marker({ element: markerEl })
      .setLngLat([tokyo.lng, tokyo.lat])
      .addTo(map.current);
  }, [tokyo.lng, tokyo.lat, zoom]);

  return (
    <div className="map-wrap mt-10 max-w-[70rem] max-h-[40rem] mx-auto">
      <div ref={mapContainer} className="map max-h-[40rem] max-w-[70rem]" />
    </div>
  );
}
