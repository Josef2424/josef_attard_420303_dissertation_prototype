import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/App.css";
import { LocationProvider, useLocation } from "./context/LocationContext";
import Header from "./components/header/Header";
import Welcome from "./components/welcome/Welcome";
import LocationInfo from "./LocationInfo";
import NewsSection from "./components/news/NewsSection";
import LandmarksSection from "./components/landmarks/LandmarksSection";
import Navigation from "./components/navigation/Navigation";
import MapsPage from "./pages/MapsPage";
import ARView from "./components/ar/ARView";

const regionColors = {
  "Raħal Ġdid, Malta": {
    primary: "#FF0000", // Red
    secondary: "#0000FF", // Blue
    hover: "#FFFF00", // Yellow
  },
  "Paola, Malta": {
    primary: "#FF0000", // Red
    secondary: "#0000FF", // Blue
    hover: "#FFFF00", // Yellow
  },
  "Valletta, Malta": {
    primary: "#DFC303", // Gold
    secondary: "#C90B0B", // Red
    hover: "#FBF16A", // Light yellow
  },
  "Il-Belt Valletta, Malta": {
    primary: "#DFC303", // Gold
    secondary: "#C90B0B", // Red
    hover: "#FBF16A", // Light yellow
  },
  "Dingli, Malta": {
    primary: "#7FB2EB", // Light blue
    secondary: "#DA2B2B", // Red
    hover: "#EBEBEB", // Silver
  },
  "Ħad-Dingli, Malta": {
    primary: "#7FB2EB", // Light blue
    secondary: "#DA2B2B", // Red
    hover: "#EBEBEB", // Silver
  },
  "Iż-Żurrieq, Malta": {
    primary: "#79A4D7", // Cyan blue
    secondary: "#31479E", // Dark purple
    hover: "#5576BB", // Light purple
  },
  "Żurrieq, Malta": {
    primary: "#79A4D7", // Cyan blue
    secondary: "#31479E", // Dark purple
    hover: "#5576BB", // Light purple
  },
  Default: {
    primary: "#007bff", // Blue
    secondary: "#e1f0ff", // Light blue
    hover: "#57A3FF", // Lighter blue
  },
};

const getContrastRatio = (foreground, background) => {
  const luminance = (color) => {
    const rgb = [
      parseInt(color.slice(1, 3), 16) / 255,
      parseInt(color.slice(3, 5), 16) / 255,
      parseInt(color.slice(5, 7), 16) / 255,
    ].map((channel) =>
      channel <= 0.03928
        ? channel / 12.92
        : Math.pow((channel + 0.055) / 1.055, 2.4)
    );

    return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
  };

  const lum1 = luminance(foreground);
  const lum2 = luminance(background);

  return lum1 > lum2
    ? (lum2 + 0.05) / (lum1 + 0.05)
    : (lum1 + 0.05) / (lum2 + 0.05);
};

function AppContent() {
  const { location } = useLocation();

  useEffect(() => {
    // If location is undefined or empty, you might decide to show the default theme.
    console.log("Current location:", location);
    const theme = regionColors[location] || regionColors.Default;
    console.log("Applying theme:", theme);
    document.documentElement.style.setProperty(
      "--primary-color",
      theme.primary
    );
    document.documentElement.style.setProperty(
      "--secondary-color",
      theme.secondary
    );
    document.documentElement.style.setProperty("--hover-color", theme.hover);

    // Calculate contrast ratio and set text color
    const pcontrastWithBlack = getContrastRatio("#000000", theme.primary);
    const pcontrastWithWhite = getContrastRatio("#ffffff", theme.primary);
    const scontrastWithBlack = getContrastRatio("#000000", theme.secondary);
    const scontrastWithWhite = getContrastRatio("#ffffff", theme.secondary);
    const hcontrastWithBlack = getContrastRatio("#000000", theme.hover);
    const hcontrastWithWhite = getContrastRatio("#ffffff", theme.hover);

    const textColor =
      pcontrastWithBlack >= pcontrastWithWhite ||
      scontrastWithBlack >= scontrastWithWhite ||
      hcontrastWithBlack >= hcontrastWithWhite
        ? "#000"
        : "#fff";

    document.documentElement.style.setProperty("--text-color", textColor);
  }, [location]);

  return (
    <Routes>
      {/* Home Route */}
      <Route
        path="/"
        element={
          <div className="app">
            <Header />
            <section className="bodyContent">
              <Welcome />
              <LocationInfo />
              <NewsSection />
              <LandmarksSection />
              <Navigation />
            </section>
          </div>
        }
      />
      <Route path="/ar" element={<ARView />} />
      {/* Maps Route */}
      <Route
        path="/maps"
        element={
          <div className="app">
            <Header />
            <MapsPage />
            <Navigation />
          </div>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <LocationProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </LocationProvider>
  );
}

export default App;
