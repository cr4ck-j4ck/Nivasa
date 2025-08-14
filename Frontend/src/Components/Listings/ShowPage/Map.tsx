// @ts-nocheck
import "./map.css";
import React from "react";
import { useRef, useEffect } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import "./map.css";
import Nivasa from "/Nivasa-removebg-preview.png";
import { useListingStore } from "@/Store/ListingStore";
import { useShallow } from "zustand/react/shallow";
interface Coordinates {
  lng: number;
  lat: number;
}

interface MapMouseEvent {
  lngLat: maptilersdk.LngLat;
  point: maptilersdk.Point;
  originalEvent: MouseEvent;
}

export default function Map(): React.JSX.Element {
  const {lat , lng} = useListingStore(useShallow(state => ({lat: state.listingObj?.location.latitude , lng:state.listingObj?.location.longitude})))
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const address: Coordinates = { lng,lat };
  const zoom: number = 14;
  maptilersdk.config.apiKey = import.meta.env.VITE_MAPTILER_KEY;
  useEffect(() => {
    if (map.current) return;
    map.current = new maptilersdk.Map({
      container: mapContainer.current as HTMLDivElement,
      style: maptilersdk.MapStyle.STREETS,
      center: [address.lng, address.lat],
      zoom: zoom,
      scrollZoom: false,
    });
    if (!map.current) return;
    map.current.scrollZoom.disable();
    map.current.on("dblclick", (e: MapMouseEvent) => {
      if (map.current) {
        map.current.zoomIn({ around: e.lngLat });
      }
    });
    const canvas: HTMLCanvasElement | null = map.current.getCanvas();

    if (canvas) {
      canvas.addEventListener("contextmenu", (e: MouseEvent) => {
        e.preventDefault();
      });

      canvas.addEventListener("dblclick", (e: MouseEvent) => {
        if (e.button === 2 && map.current) {
          map.current.zoomOut({
            around: map.current.unproject([e.clientX, e.clientY]),
          });
        }
      });

      canvas.addEventListener("contextmenu", (e: MouseEvent) => {
        e.preventDefault();
        if (map.current) {
          const rect = canvas.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          map.current.zoomOut({
            around: map.current.unproject([x, y]),
          });
        }
      });
    }

    const markerEl: HTMLDivElement = document.createElement("div");
    markerEl.className = "custom-marker";
    markerEl.style.backgroundImage = `url(${Nivasa})`;

    if (map.current) {
      new maptilersdk.Marker({ element: markerEl })
        .setLngLat([address.lng, address.lat])
        .addTo(map.current);
    }
  }, [address.lng, address.lat, zoom]);

  return (
    <div className="map-wrap map-wrapper mt-5 max-w-full max-h-[40rem] mx-auto">
      <div ref={mapContainer} className="map max-h-[40rem] max-w-full" />
    </div>
  );
}
