// @ts-nocheck

import { useRef, useEffect, useCallback, useState } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { type IlistingObj } from "@/@Types/interfaces";
// import { X, ExternalLink,Users, Bed, Bath, Star } from "lucide-react";
interface SearchResultsMapProps {
  listings: IlistingObj[];
  selectedListing: IlistingObj | null;
  onListingSelect: (listing: IlistingObj) => void;
  onListingClick: (listingId: string) => void;
}

interface MarkerData {
  listing: IlistingObj;
  marker: maptilersdk.Marker;
  element: HTMLElement;
}

const SearchResultsMap: React.FC<SearchResultsMapProps> = ({
  listings,
  selectedListing,
  onListingSelect,
  onListingClick
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const markers = useRef<MarkerData[]>([]);
  const popup = useRef<maptilersdk.Popup | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    maptilersdk.config.apiKey = import.meta.env.VITE_MAPTILER_KEY;

    // Initialize map with default center (will be updated when listings load)
    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [77.216721, 28.6448], // Default: New Delhi
      zoom: 10,
    });

    map.current.addControl(new maptilersdk.NavigationControl(), "top-right");

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Create marker element
  const createMarkerElement = useCallback((listing: IlistingObj, isSelected: boolean = false, isAdjusted: boolean = false) => {
    const el = document.createElement('div');
    el.className = `marker-element ${isSelected ? 'selected' : ''} ${isAdjusted ? 'adjusted' : ''}`;
    
    const price = listing.pricing?.weekdayPrice || 0;
    const formattedPrice = `₹${price.toLocaleString()}`;
    
    // Add a small indicator for adjusted markers
    const adjustedIndicator = isAdjusted ? `
      <div style="
        position: absolute;
        top: -2px;
        right: -2px;
        width: 8px;
        height: 8px;
        background: #ff6b6b;
        border-radius: 50%;
        border: 1px solid white;
        z-index: 1001;
      "></div>
    ` : '';
    
    el.innerHTML = `
      <div class="marker-price ${isSelected ? 'selected' : ''}" style="
        background: ${isSelected ? '#d93553' : 'white'};
        color: ${isSelected ? 'white' : '#333'};
        border: 2px solid ${isSelected ? '#d93553' : (isAdjusted ? '#ff6b6b' : '#ddd')};
        padding: 6px 12px;
        border-radius: 20px;
        font-weight: 600;
        font-size: 14px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
        position: relative;
        z-index: ${isSelected ? '1000' : '100'};
      ">
        ${formattedPrice}
        ${adjustedIndicator}
      </div>
    `;

    // Add hover effects
    el.addEventListener('mouseenter', () => {
      if (!isSelected) {
        const priceEl = el.querySelector('.marker-price');
        if (priceEl) {
          priceEl.style.transform = 'scale(1.1)';
          priceEl.style.zIndex = '999';
        }
      }
    });

    el.addEventListener('mouseleave', () => {
      if (!isSelected) {
        const priceEl = el.querySelector('.marker-price');
        if (priceEl) {
          priceEl.style.transform = 'scale(1)';
          priceEl.style.zIndex = '100';
        }
      }
    });

    return el;
  }, []);

  // Create popup content
  const createPopupContent = useCallback((listing: IlistingObj) => {
    const mainImage = listing.gallery && Object.keys(listing.gallery).length > 0
      ? Object.values(listing.gallery)[0][0]
      : '/placeholder-property.jpg';
    
    const price = listing.pricing?.weekdayPrice || 0;
    const formattedPrice = `₹${price.toLocaleString()}`;

    return `
      <div class="listing-popup" style="width: 280px; font-family: system-ui, -apple-system, sans-serif;">
        <div style="position: relative;">
          <img 
            src="${mainImage}" 
            alt="${listing.title}"
            style="width: 100%; height: 160px; object-fit: cover; border-radius: 8px;"
            onerror="this.src='/placeholder-property.jpg'"
          />
          <button 
            class="popup-close"
            style="
              position: absolute;
              top: 8px;
              right: 8px;
              background: rgba(255,255,255,0.9);
              border: none;
              border-radius: 50%;
              width: 28px;
              height: 28px;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              font-size: 16px;
              color: #666;
            "
          >
            ×
          </button>
        </div>
        
        <div style="padding: 12px 0;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <h3 style="
              margin: 0;
              font-size: 16px;
              font-weight: 600;
              color: #333;
              line-height: 1.3;
              max-width: 200px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            ">
              ${listing.title}
            </h3>
            <div style="display: flex; align-items: center; gap: 2px;">
              <span style="color: #fbbf24; font-size: 14px;">★</span>
              <span style="font-size: 14px; font-weight: 500;">4.8</span>
            </div>
          </div>
          
          <p style="
            margin: 0 0 8px 0;
            color: #666;
            font-size: 14px;
          ">
            ${listing.location?.address?.city}, ${listing.location?.address?.state}
          </p>
          
          <p style="
            margin: 0 0 12px 0;
            color: #666;
            font-size: 14px;
          ">
            ${listing.roomType}
          </p>
          
          <div style="
            display: flex;
            gap: 16px;
            margin-bottom: 12px;
            font-size: 13px;
            color: #666;
          ">
            <span>${listing.capacity?.guests || 0} guests</span>
            <span>${listing.capacity?.bedrooms || 0} bedrooms</span>
            <span>${listing.capacity?.bathrooms || 0} bathrooms</span>
          </div>
          
          <div style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-top: 12px;
            border-top: 1px solid #eee;
          ">
            <div>
              <span style="font-size: 18px; font-weight: 700; color: #333;">
                ${formattedPrice}
              </span>
              <span style="color: #666; font-size: 14px;"> / night</span>
            </div>
            <button 
              class="view-details-btn"
              style="
                background: #d93553;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 4px;
                transition: background-color 0.2s;
              "
              onmouseover="this.style.backgroundColor='#fe3b5f'"
              onmouseout="this.style.backgroundColor='#d93553'"
            >
              View Details
              <span style="font-size: 12px;">↗</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }, []);

  // Function to detect and handle overlapping markers
  const getAdjustedCoordinates = useCallback((listings: IlistingObj[]) => {
    const OVERLAP_THRESHOLD = 0.001; // ~100 meters
    const OFFSET_DISTANCE = 0.002; // ~200 meters
    
    const adjustedListings = listings.map(listing => ({
      ...listing,
      adjustedCoords: {
        longitude: listing.location.coordinates.longitude,
        latitude: listing.location.coordinates.latitude
      }
    }));

    // Group overlapping markers
    const groups: typeof adjustedListings[][] = [];
    const processed = new Set<number>();

    adjustedListings.forEach((listing, index) => {
      if (processed.has(index)) return;

      const group = [listing];
      processed.add(index);

      // Find overlapping markers
      adjustedListings.forEach((otherListing, otherIndex) => {
        if (otherIndex === index || processed.has(otherIndex)) return;

        const latDiff = Math.abs(listing.location.coordinates.latitude - otherListing.location.coordinates.latitude);
        const lngDiff = Math.abs(listing.location.coordinates.longitude - otherListing.location.coordinates.longitude);

        if (latDiff < OVERLAP_THRESHOLD && lngDiff < OVERLAP_THRESHOLD) {
          group.push(otherListing);
          processed.add(otherIndex);
        }
      });

      groups.push(group);
    });

    // Adjust coordinates for overlapping groups
    groups.forEach(group => {
      if (group.length > 1) {
        const centerLat = group[0].location.coordinates.latitude;
        const centerLng = group[0].location.coordinates.longitude;

        group.forEach((listing, index) => {
          if (index === 0) return; // Keep first marker at original position

          // Arrange in circle pattern
          const angle = (2 * Math.PI * index) / group.length;
          const offsetLat = Math.cos(angle) * OFFSET_DISTANCE;
          const offsetLng = Math.sin(angle) * OFFSET_DISTANCE;

          listing.adjustedCoords = {
            latitude: centerLat + offsetLat,
            longitude: centerLng + offsetLng
          };
        });
      }
    });

    return adjustedListings;
  }, []);

  // Update markers when listings change
  useEffect(() => {
    if (!map.current || !mapLoaded || listings.length === 0) return;

    // Clear existing markers
    markers.current.forEach(({ marker }) => marker.remove());
    markers.current = [];

    // Filter valid listings with coordinates
    const validListings = listings.filter(listing => 
      listing.location?.coordinates?.latitude && 
      listing.location?.coordinates?.longitude
    );

    if (validListings.length === 0) return;

    // Get adjusted coordinates to handle overlapping markers
    const adjustedListings = getAdjustedCoordinates(validListings);

    // Add new markers
    adjustedListings.forEach((listing) => {
      const isSelected = selectedListing?._id === listing._id;
      const isAdjusted = listing.adjustedCoords.latitude !== listing.location.coordinates.latitude || 
                        listing.adjustedCoords.longitude !== listing.location.coordinates.longitude;
      const el = createMarkerElement(listing, isSelected, isAdjusted);

      const marker = new maptilersdk.Marker({ element: el })
        .setLngLat([
          listing.adjustedCoords.longitude,
          listing.adjustedCoords.latitude
        ])
        .addTo(map.current);

      // Add click handler to marker
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onListingSelect(listing);

        // Create and show popup (use original coordinates for popup position)
        if (popup.current) {
          popup.current.remove();
        }

        popup.current = new maptilersdk.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: [0, -10]
        })
          .setLngLat([
            listing.adjustedCoords.longitude,
            listing.adjustedCoords.latitude
          ])
          .setHTML(createPopupContent(listing))
          .addTo(map.current);

        // Add event listeners to popup buttons
        setTimeout(() => {
          const closeBtn = document.querySelector('.popup-close');
          const viewDetailsBtn = document.querySelector('.view-details-btn');

          if (closeBtn) {
            closeBtn.addEventListener('click', () => {
              if (popup.current) {
                popup.current.remove();
                popup.current = null;
              }
            });
          }

          if (viewDetailsBtn) {
            viewDetailsBtn.addEventListener('click', () => {
              onListingClick(listing._id);
            });
          }
        }, 100);
      });

      markers.current.push({ listing, marker, element: el });
    });

    // Always fit map to show all markers (use adjusted coordinates for bounds)
    const coordinates = adjustedListings.map(listing => [
      listing.adjustedCoords.longitude,
      listing.adjustedCoords.latitude
    ]);

    if (coordinates.length === 1) {
      // Single marker - center on it with appropriate zoom
      map.current.flyTo({
        center: coordinates[0],
        zoom: 14,
        duration: 1000
      });
    } else if (coordinates.length > 1) {
      // Multiple markers - fit bounds to show all
      const bounds = coordinates.reduce((bounds, coord) => {
        return bounds.extend(coord);
      }, new maptilersdk.LngLatBounds(coordinates[0], coordinates[0]));

      map.current.fitBounds(bounds, {
        padding: 80,
        maxZoom: 15,
        duration: 1000
      });
    }
  }, [listings, mapLoaded, createMarkerElement, createPopupContent, onListingSelect, onListingClick, getAdjustedCoordinates]);

  // Update marker styles when selection changes
  useEffect(() => {
    markers.current.forEach(({ listing, element }) => {
      const isSelected = selectedListing?._id === listing._id;
      const priceEl = element.querySelector('.marker-price');
      
      if (priceEl) {
        priceEl.style.background = isSelected ? '#d93553' : 'white';
        priceEl.style.color = isSelected ? 'white' : '#333';
        priceEl.style.borderColor = isSelected ? '#d93553' : '#ddd';
        priceEl.style.transform = isSelected ? 'scale(1.1)' : 'scale(1)';
        priceEl.style.zIndex = isSelected ? '1000' : '100';
      }
    });
  }, [selectedListing]);

  return (
    <div className="h-full relative">
      <div ref={mapContainer} className="w-full h-full rounded-lg overflow-hidden" />
      
      {/* Map overlay info */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 z-10">
        <p className="text-sm font-medium text-gray-900">
          {listings.length} properties
        </p>
        <p className="text-xs text-gray-600">
          Click markers to see details
        </p>
      </div>
    </div>
  );
};

export default SearchResultsMap;