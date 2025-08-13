// @ts-nocheck
import React, { useEffect, useRef } from "react";
import * as maptilersdk from "@maptiler/sdk";
import { GeocodingControl } from "@maptiler/geocoding-control/maptilersdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import "@maptiler/geocoding-control/style.css";
import Nivasa from "/Nivasa-removebg-preview.png";
import { useListingStore } from "@/Store/ListingStore";
import { useShallow } from "zustand/react/shallow";

export default function LocationPickerMap() {
  const { lat, lng, setLocation } = useListingStore(
    useShallow((state) => ({
      lat: state.listingObj?.location?.latitude || 28.6448,
      lng: state.listingObj?.location?.longitude || 77.216721,
      setLocation: state.setLocation,
    }))
  );

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const marker = useRef<maptilersdk.Marker | null>(null);

  maptilersdk.config.apiKey = import.meta.env.VITE_MAPTILER_KEY;

  useEffect(() => {
    if (map.current) return;

    map.current = new maptilersdk.Map({
      container: mapContainer.current as HTMLDivElement,
      style: maptilersdk.MapStyle.STREETS,
      center: [lng, lat],
      zoom: 5,
    });

    // Add zoom & compass controls
    map.current.addControl(new maptilersdk.NavigationControl({ visualizePitch: true }), "top-right");

    // Custom styled search box
    const geocodingControl = new GeocodingControl({
      apiKey: import.meta.env.VITE_MAPTILER_KEY,
      map: map.current,
      placeholder: "🔍 Search for a location...",
      marker: false,
      flyTo: true,
    });
    map.current.addControl(geocodingControl, "top-left");

    // Handle search result
    geocodingControl.on("result", (e: any) => {
      const [lngRes, latRes] = e.center;
      updateMarker(latRes, lngRes);
    });

    // Custom glowing marker
    const markerEl = document.createElement("div");
    markerEl.className = "custom-marker";
    markerEl.style.backgroundImage = `url(${Nivasa})`;
    markerEl.style.width = "45px";
    markerEl.style.height = "45px";
    markerEl.style.backgroundSize = "contain";
    markerEl.style.backgroundRepeat = "no-repeat";
    markerEl.style.filter = "drop-shadow(0 0 8px rgba(255, 0, 0, 0.6))";

    marker.current = new maptilersdk.Marker({ element: markerEl, draggable: true })
      .setLngLat([lng, lat])
      .addTo(map.current);

    marker.current.on("dragend", () => {
      const pos = marker.current!.getLngLat();
      setLocation({ latitude: pos.lat, longitude: pos.lng });
    });

    map.current.on("click", (e) => {
      updateMarker(e.lngLat.lat, e.lngLat.lng);
    });
  }, []);

 const updateMarker = (lat: number, lng: number) => {
  marker.current!.setLngLat([lng, lat]);
  map.current!.flyTo({
    center: [lng, lat],
    zoom: map.current!.getZoom(), // keep existing zoom level
  });
  setLocation({ latitude: lat, longitude: lng });
};


  return (
    <div className="relative flex justify-center items-center w-full">
      <div
        className="map-wrap mt-5 mx-auto max-w-4xl w-full h-[35rem] rounded-2xl overflow-hidden border border-gray-300 shadow-lg"
      >
        <div ref={mapContainer} className="map w-full h-full" />
      </div>
    </div>
  );
}
