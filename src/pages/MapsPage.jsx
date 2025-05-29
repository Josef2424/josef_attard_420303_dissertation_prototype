"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import "../styles/App.css";
import "./mapsPage.css";
import { useLocation } from "../context/LocationContext";

function MapsPage() {
  const { setLocation } = useLocation();
  const [error, setError] = useState(null);
  const watchIdRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const googleInitAttempts = useRef(0);
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [accuracy, setAccuracy] = useState(null);
  const [mapStatus, setMapStatus] = useState("loading"); // loading, error, loaded
  const mapInitTimerRef = useRef(null);
  const MAX_INIT_ATTEMPTS = 3;

  // Calculate distance between two coordinate points
  const calculateDistance = (coord1, coord2) => {
    if (!coord1 || !coord2) return Infinity;

    const R = 6371000; // Earth's radius in meters
    const φ1 = (coord1.lat * Math.PI) / 180;
    const φ2 = (coord2.lat * Math.PI) / 180;
    const Δφ = ((coord2.lat - coord1.lat) * Math.PI) / 180;
    const Δλ = ((coord2.lng - coord1.lng) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  // Process position update
  const processPosition = useCallback(
    (pos) => {
      const { latitude, longitude, accuracy: currentAccuracy } = pos.coords;
      const newCoords = { lat: latitude, lng: longitude };

      // Update accuracy and coords
      setAccuracy(currentAccuracy);
      setCoords(newCoords);

      // Attempt to initialize map if we have coords but map not loaded
      if (mapStatus !== "loaded" && !mapRef.current) {
        attemptInitMap(newCoords);
      }
    },
    [mapStatus]
  );

  // Setup geolocation watching
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    // Try to get a high accuracy position first
    navigator.geolocation.getCurrentPosition(
      processPosition,
      (err) => {
        console.warn("High accuracy position failed:", err);
        // Fall back to lower accuracy
        navigator.geolocation.getCurrentPosition(
          processPosition,
          (secondErr) => {
            console.error("Geolocation error:", secondErr);
            setError(`Could not get your location: ${secondErr.message}`);
          },
          { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    // Start watching position
    watchIdRef.current = navigator.geolocation.watchPosition(
      processPosition,
      (err) => console.warn("Watch position error:", err),
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 5000 }
    );

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (mapInitTimerRef.current) {
        clearTimeout(mapInitTimerRef.current);
      }
    };
  }, [processPosition]);

  // Check if Google Maps is available
  const isGoogleMapsAvailable = () => {
    return window.google && window.google.maps;
  };

  // Load Google Maps script manually if needed
  const loadGoogleMapsScript = () => {
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      console.log("Google Maps script already being loaded");
      return new Promise((resolve) => {
        const checkGoogleMaps = () => {
          if (isGoogleMapsAvailable()) {
            resolve();
          } else {
            setTimeout(checkGoogleMaps, 500);
          }
        };
        checkGoogleMaps();
      });
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyAEvfYtxVHkbKT2D45Rj8gbfJ6nPedLKCY&libraries=places,marker&v=weekly";
      script.async = true;
      script.defer = true;

      script.onload = () => {
        console.log("Google Maps script loaded successfully");
        resolve();
      };

      script.onerror = () => {
        console.error("Failed to load Google Maps script");
        reject(new Error("Failed to load Google Maps script"));
      };

      document.head.appendChild(script);
    });
  };

  // Initialize map with retries
  const attemptInitMap = async (coordinates) => {
    if (googleInitAttempts.current >= MAX_INIT_ATTEMPTS) {
      setMapStatus("error");
      setError(
        "Failed to initialize Google Maps after multiple attempts. Please refresh the page."
      );
      return;
    }

    googleInitAttempts.current += 1;
    console.log(`Map initialization attempt ${googleInitAttempts.current}`);

    try {
      // Make sure we have coordinates
      const mapCoords = coordinates || coords;
      if (!mapCoords.lat || !mapCoords.lng) {
        console.log("No coordinates available yet");
        return;
      }

      // Make sure the map container exists and has dimensions
      const mapContainer = document.getElementById("map");
      if (!mapContainer) {
        console.error("Map container not found");
        setMapStatus("error");
        setError("Map container not found. Please refresh the page.");
        return;
      }

      // Ensure container has height
      if (mapContainer.clientHeight === 0) {
        mapContainer.style.height = "calc(100vh - 130px)";
      }

      // Ensure Google Maps is available, load if not
      if (!isGoogleMapsAvailable()) {
        console.log("Google Maps not available, loading script");
        await loadGoogleMapsScript();
      }

      // Make sure Google Maps libraries are loaded
      const { Map } = await google.maps.importLibrary("maps");
      const { AdvancedMarkerElement } = await google.maps.importLibrary(
        "marker"
      );

      // Create the map
      mapRef.current = new Map(mapContainer, {
        center: mapCoords,
        zoom: 15,
        mapId: "MAP_ID_HERE",
      });

      // Add marker
      markerRef.current = new AdvancedMarkerElement({
        map: mapRef.current,
        position: mapCoords,
        title: "Your location",
        gmpDraggable: true,
      });

      // Handle marker drag
      markerRef.current.addListener("dragend", () => {
        const position = markerRef.current.position;
        setCoords({ lat: position.lat, lng: position.lng });
        performReverseGeocoding({ lat: position.lat, lng: position.lng });
      });

      // Listen for map loaded event
      google.maps.event.addListenerOnce(mapRef.current, "tilesloaded", () => {
        console.log("Map tiles loaded successfully");
        setMapStatus("loaded");
        setError(null);

        // Do geocoding once map is loaded
        performReverseGeocoding(mapCoords);
      });

      console.log("Map initialization complete");
    } catch (err) {
      console.error("Map initialization error:", err);

      // If failed, retry after a delay
      console.log(`Will retry map initialization in 2 seconds`);
      mapInitTimerRef.current = setTimeout(() => {
        attemptInitMap(coordinates);
      }, 2000);
    }
  };

  // Separate function for reverse geocoding
  const performReverseGeocoding = (coordinates) => {
    if (!isGoogleMapsAvailable()) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: coordinates }, (results, status) => {
      if (status === "OK" && results && results.length > 0) {
        const addressComponents = results[0].address_components;
        const sublocality = addressComponents.find(
          (comp) =>
            comp.types.includes("sublocality") ||
            comp.types.includes("neighborhood")
        );
        const locality = addressComponents.find((comp) =>
          comp.types.includes("locality")
        );
        const country = addressComponents.find((comp) =>
          comp.types.includes("country")
        );

        if (sublocality && country) {
          setLocation(`${sublocality.long_name}, ${country.long_name}`);
        } else if (locality && country) {
          setLocation(`${locality.long_name}, ${country.long_name}`);
        } else {
          setLocation(results[0].formatted_address);
        }
      } else {
        console.warn("Reverse geocoding failed:", status);
      }
    });
  };

  // Handle refresh button click
  const handleRefresh = () => {
    setError(null);
    setMapStatus("loading");
    googleInitAttempts.current = 0;

    // If map exists, try to recover it first
    if (mapRef.current) {
      try {
        google.maps.event.trigger(mapRef.current, "resize");
        if (coords.lat && coords.lng) {
          mapRef.current.setCenter(coords);
          if (markerRef.current) {
            markerRef.current.position = coords;
          }
          setMapStatus("loaded");
        }
      } catch (e) {
        console.warn("Error recovering map, will reinitialize:", e);
        mapRef.current = null;
        markerRef.current = null;
        attemptInitMap(coords);
      }
    } else {
      // Otherwise try to initialize from scratch
      attemptInitMap(coords);
    }

    // Get a fresh location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        processPosition,
        (err) => console.error("Refresh position error:", err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  };

  // Render accuracy display with appropriate class
  const renderAccuracyDisplay = () => {
    if (!accuracy) return null;

    let accuracyClass = "accuracy-poor";
    if (accuracy <= 20) accuracyClass = "accuracy-excellent";
    else if (accuracy <= 50) accuracyClass = "accuracy-good";
    else if (accuracy <= 100) accuracyClass = "accuracy-fair";

    return (
      <div className={`accuracy-display ${accuracyClass}`}>
        Accuracy: {Math.round(accuracy)}m
        {accuracy > 100 && (
          <span className="accuracy-warning"> (Low accuracy)</span>
        )}
      </div>
    );
  };

  return (
    <div className="maps-page">
      {/* Accuracy indicator */}
      {renderAccuracyDisplay()}

      {/* Map container */}
      <div
        id="map"
        className={mapStatus === "loading" ? "map-loading" : ""}
      ></div>

      {/* Loading overlay */}
      {mapStatus === "loading" && (
        <div className="map-loading-overlay">
          <div className="loading-spinner"></div>
          <p>Loading map...</p>
        </div>
      )}

      {/* Error overlay */}
      {(error || mapStatus === "error") && (
        <div className="map-error-overlay">
          <p>{error || "Failed to load map"}</p>
          <button onClick={handleRefresh} className="refresh-button">
            Refresh Map
          </button>
        </div>
      )}

      {/* Floating refresh button - always visible */}
      <button onClick={handleRefresh} className="refresh-map-button">
        Refresh Map
      </button>
    </div>
  );
}

export default MapsPage;
