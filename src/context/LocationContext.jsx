import { createContext, useState, useContext, useEffect } from "react";

const LocationContext = createContext();
export const useLocation = () => useContext(LocationContext);

export function LocationProvider({ children }) {
  // Initialize state from localStorage or fallback to "[Location]"
  const [location, setLocation] = useState(() => {
    try {
      return localStorage.getItem("geoGuideLocation") || "[Location]";
    } catch {
      return "[Location]";
    }
  });

  // Update localStorage every time location changes
  useEffect(() => {
    try {
      localStorage.setItem("geoGuideLocation", location);
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [location]);

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
}
