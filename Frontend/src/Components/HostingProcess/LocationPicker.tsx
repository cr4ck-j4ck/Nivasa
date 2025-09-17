// @ts-nocheck
import { useEffect, useRef, useCallback } from "react";
import * as maptilersdk from "@maptiler/sdk";
import { GeocodingControl } from "@maptiler/geocoding-control/maptilersdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import "@maptiler/geocoding-control/style.css";
import Nivasa from "/Nivasa-removebg-preview.png";
import { useHostingProcessStore } from "@/Store/HostingProcessStore";
import { useShallow } from "zustand/react/shallow";

interface MaptilerContext {
  id: string;
  text: string;
}

interface MaptilerFeature {
  text?: string;
  context?: MaptilerContext[];
  center?: [number, number];
}

interface StructuredAddress {
  streetAddress: string;
  landmark: string;
  postalCode: string;
  district: string;
  city: string;
  state: string;
  country: string;
}

export default function LocationPickerMap() {
  const defaultLat = 28.6448; // Default: New Delhi
  const defaultLng = 77.216721;
  const {setAddress,setCoordinates} = useHostingProcessStore(useShallow(state => ({setAddress: state.setAddress,setCoordinates: state.setCoordinates})));
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const marker = useRef<maptilersdk.Marker | null>(null);

  maptilersdk.config.apiKey = import.meta.env.VITE_MAPTILER_KEY;

function parseMaptilerFeature(feature: MaptilerFeature): StructuredAddress {
  const context = feature.context || [];
  const getFromContext = (prefix: string) => {
    return context.find((c: MaptilerContext) => c.id.startsWith(prefix))?.text || "";
  };

  return {
    streetAddress: feature.text || "",
    landmark: getFromContext("place"), // e.g. Patnipura Square
    postalCode: getFromContext("postal_code").replace(/\s+/g, ""), // e.g. 452001
    district: getFromContext("municipal_district"), // e.g. Indore City
    city: getFromContext("subregion"), // e.g. Indore
    state: getFromContext("region"), // e.g. Madhya Pradesh
    country: getFromContext("country"), // e.g. India
  };
}

  // Helper: Reverse geocode to get location name
  const getStructuredAddress = useCallback(async (lat: number, lng: number): Promise<StructuredAddress | null> => {
    try {
      const res = await fetch(
        `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${
          import.meta.env.VITE_MAPTILER_KEY
        }`
      );
      const data = await res.json();
      if (!data.features || data.features.length === 0) {
        return null;
      }

      return parseMaptilerFeature(data.features[0]);
    } catch (error) {
      console.error('Error fetching address:', error);
      return null;
    }
  }, []);

  // Helper: Update marker position & get location name
  const updateMarker = useCallback(async (lat: number, lng: number) => {
    if (!marker.current || !map.current) return;
    
    marker.current.setLngLat([lng, lat]);
    const addressDetails = await getStructuredAddress(lat, lng);
    setAddress(addressDetails);
    setCoordinates({ lat, lng });

    map.current.flyTo({
      center: [lng, lat],
      zoom: map.current.getZoom(),
    });
  }, [getStructuredAddress, setAddress, setCoordinates]);

  useEffect(() => {
    if (map.current) return;

    // Init map
    map.current = new maptilersdk.Map({
      container: mapContainer.current as HTMLDivElement,
      style: maptilersdk.MapStyle.STREETS,
      center: [defaultLng, defaultLat],
      zoom: 5,
    });

    // Add zoom & compass controls
    map.current.addControl(new maptilersdk.NavigationControl(), "top-right");

    // Add search control
    const geocodingControl = new GeocodingControl({
      apiKey: import.meta.env.VITE_MAPTILER_KEY,
      map: map.current,
      placeholder: "🔍 Search for a location...",
      marker: false,
      flyTo: true,
    });
    map.current.addControl(geocodingControl, "top-left");

    // When user selects from search
    geocodingControl.on("result", (e: { center: [number, number] }) => {
      const [lngRes, latRes] = e.center;
      updateMarker(latRes, lngRes);
    });

    // Create custom marker
    const markerEl = document.createElement("div");
    markerEl.className = "custom-marker";
    markerEl.style.backgroundImage = `url(${Nivasa})`;
    markerEl.style.width = "45px";
    markerEl.style.height = "45px";
    markerEl.style.backgroundSize = "contain";
    markerEl.style.backgroundRepeat = "no-repeat";
    markerEl.style.filter = "drop-shadow(0 0 8px rgba(255, 0, 0, 0.6))";

    marker.current = new maptilersdk.Marker({
      element: markerEl,
      draggable: true,
    })
      .setLngLat([defaultLng, defaultLat])
      .addTo(map.current);

    // When marker dragged
    marker.current.on("dragend", () => {
      const pos = marker.current!.getLngLat();
      updateMarker(pos.lat, pos.lng);
    });

    // Click on map to move marker
    map.current.on("click", (e) => {
      setCoordinates({lat: e.lngLat.lat,lng: e.lngLat.lng});
      updateMarker(e.lngLat.lat, e.lngLat.lng);
    });
  }, [setCoordinates, updateMarker]);

  return (
    <div className="relative flex justify-center items-center top-40 mb-40">
      <div className="map-wrap mt-5 mx-auto locationPickerMap rounded-2xl overflow-hidden border border-gray-300 shadow-lg">
        <div ref={mapContainer} className="map w-full h-full" />
      </div>
    </div>
  );
}
