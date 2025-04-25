import { useEffect, useRef, useState } from "react";

// Custom hook to load Woosmap Map JS directly
const useWoosmap = (apiKey) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Create script element
    const script = document.createElement("script");
    script.src = `https://sdk.woosmap.com/map/map.js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    
    // Set callback for when script loads
    script.onload = () => {
      console.log("Woosmap Map JS loaded successfully");
      setIsLoaded(true);
    };
    
    script.onerror = () => {
      console.error("Failed to load Woosmap Map JS");
    };
    
    // Add script to document body
    document.body.appendChild(script);
    
    // Cleanup function
    return () => {
      // Remove script on component unmount if needed
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [apiKey]);
  
  return isLoaded;
};

const Map = () => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  
  // Directly use the Map JS library with your API key
  console.log('Available env vars:', import.meta.env);
  const isWoosmapLoaded = useWoosmap(import.meta.env.VITE_WOOSMAP_API_KEY);
  
  useEffect(() => {
    if (isWoosmapLoaded && mapContainerRef.current && !map) {
      console.log("Initializing map...");
      try {
        // Create the map instance
        const mapInstance = new window.woosmap.map.Map(mapContainerRef.current, {
          center: { lat: 37.7749, lng: -122.4194 },
          zoom: 12
        });
        
        console.log("Map initialized successfully");
        setMap(mapInstance);
        
        // add the assets (store) overlay to the map
        const style = {
          breakPoint: 14,
          rules: [],
          default: {
            color: "#9f2747",
            size: 8,
            minSize: 1,
            icon: {
              url: "https://images.woosmap.com/starbucks-marker.svg",
              scaledSize: {
                height: 40,
                width: 34,
              },
            },
            selectedIcon: {
              url: "https://images.woosmap.com/starbucks-marker-selected.svg",
              scaledSize: {
                height: 50,
                width: 43,
              },
            },
          },
        };

        const storesOverlay = new window.woosmap.map.StoresOverlay(style);
        storesOverlay.setMap(mapInstance);

      } catch (error) {
        console.error("Error initializing map:", error);
      }
    }
  }, [isWoosmapLoaded, map]);
  
  return (
    <div 
      ref={mapContainerRef} 
      style={{ width: '100%', height: '100%' }} 
    />
  );
};

export default Map;