// @ts-nocheck
import "./map.css";
import React, { useRef, useEffect, useCallback } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import Nivasa from "/Nivasa-removebg-preview.png";
import { useListingStore } from "@/Store/ListingStore";

interface Coordinates {
  lng: number;
  lat: number;
}

interface MapMouseEvent {
  lngLat: maptilersdk.LngLat;
  point: maptilersdk.Point;
  originalEvent: MouseEvent;
}

interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

interface Location {
  coordinates?: LocationCoordinates;
  latitude?: number;
  longitude?: number;
}

export default function Map(): React.JSX.Element {
  const location = useListingStore(state => state.listingObj?.location) as Location | undefined;
  
  // Safely extract coordinates with fallback
  const getCoordinates = useCallback((): Coordinates => {
    if (!location) {
      return { lng: 0, lat: 0 }; // Default coordinates
    }
    
    if (location.coordinates) {
      return {
        lat: location.coordinates.latitude,
        lng: location.coordinates.longitude
      };
    }
    
    return {
      lat: location.latitude || 0,
      lng: location.longitude || 0
    };
  }, [location]);

  const { lng, lat } = getCoordinates();

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const address: Coordinates = { lng, lat };
  const zoom: number = 14;

  // Initialize map
  const initializeMap = useCallback(() => {
    if (map.current || !mapContainer.current) return;

    maptilersdk.config.apiKey = import.meta.env.VITE_MAPTILER_KEY;
    
    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [address.lng, address.lat],
      zoom: zoom,
      scrollZoom: false,
    });

    if (!map.current) return;

    map.current.scrollZoom.disable();
    
    // Add double-click zoom handler
    map.current.on("dblclick", (e: MapMouseEvent) => {
      if (map.current) {
        map.current.zoomIn({ around: e.lngLat });
      }
    });

    const canvas: HTMLCanvasElement | null = map.current.getCanvas();

    if (canvas) {
      // Prevent context menu
      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        if (map.current) {
          const rect = canvas.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          map.current.zoomOut({
            around: map.current.unproject([x, y]),
          });
        }
      };

      // Handle right-click zoom out
      const handleDoubleClick = (e: MouseEvent) => {
        if (e.button === 2 && map.current) {
          map.current.zoomOut({
            around: map.current.unproject([e.clientX, e.clientY]),
          });
        }
      };

      canvas.addEventListener("contextmenu", handleContextMenu);
      canvas.addEventListener("dblclick", handleDoubleClick);
    }

    // Add custom marker
    const markerEl: HTMLDivElement = document.createElement("div");
    markerEl.className = "custom-marker";
    markerEl.style.backgroundImage = `url(${Nivasa})`;

    if (map.current) {
      new maptilersdk.Marker({ element: markerEl })
        .setLngLat([address.lng, address.lat])
        .addTo(map.current);
    }
  }, [address.lng, address.lat, zoom]);

  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  return (
    <div className="map-wrap map-wrapper mt-5 max-w-full max-h-[40rem] mx-auto">
      <div ref={mapContainer} className="map max-h-[40rem] max-w-full" />
    </div>
  );
}
