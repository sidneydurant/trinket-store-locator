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
          center: { lat: 39.828, lng: -98.5795 },
          zoom: 5
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
              url: "/marker.svg",
              scaledSize: {
                height: 20,
                width: 20,
              },
              anchor: {
                x: 10,
                y: 10,
              },
            },
            selectedIcon: {
              url: "/marker.svg",
              scaledSize: {
                height: 20,
                width: 20,
              },
              anchor: {
                x: 10,
                y: 10,
              },
            },
          },
        };
        const storesOverlay = new window.woosmap.map.StoresOverlay(style);
        storesOverlay.setMap(mapInstance);



        // Configure the click listener
        window.woosmap.map.event.addListener(
          mapInstance,
          "store_selected",
          (storeGeoJSON) => {
            const getAddress = (store) =>
              store.address.lines ? `${store.address.lines}, ${store.address.city}` : '';
            const getPhone = (store) =>
              store.contact.phone ? `Phone: ${store.contact.phone}` : '';

            function getStoreHTML(store) {
              return `<div class="info-bubble">
                        <span><strong>${store.name}</strong></span>
                        <p>${getAddress(store)}</p>
                        <p>${getPhone(store)}</p>
                      </div>`;
            }

            let infoWindow;
            infoWindow = new window.woosmap.map.InfoWindow();
            infoWindow.setContent(getStoreHTML(storeGeoJSON.properties));
            infoWindow.open(mapInstance, {lng: storeGeoJSON.geometry.coordinates[0], lat: storeGeoJSON.geometry.coordinates[1]});

            mapInstance.addListener('click', () => {
              infoWindow.close();
            });

          },
        );

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