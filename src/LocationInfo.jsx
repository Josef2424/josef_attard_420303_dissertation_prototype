import { useLocation } from "./context/LocationContext";

function LocationInfo() {
  // Retrieve the current location from context
  const { location } = useLocation();

  const locationSummaries = {
    "Raħal Ġdid, Malta":
      "Raħal Ġdid, also known as Paola, is famous for its Hypogeum, churches, and vibrant community life.",
    "Paola, Malta":
      "Paola, also known as Raħal Ġdid, is famous for its Hypogeum, churches, and vibrant community life.",
    "Valletta, Malta":
      "Valletta is Malta's capital city, known for its rich history, baroque architecture, and stunning harbors.",
    "Il-Belt Valletta, Malta":
      "Il-Belt Valletta is Malta's capital city, known for its rich history, baroque architecture, and stunning harbors.",
    "Dingli, Malta":
      "Dingli is famous for its majestic cliffs rising 250-300 meters above the Mediterranean Sea, offering spectacular views of Filfla islet and breathtaking sunsets.",
    "Ħad-Dingli, Malta":
      "Ħad-Dingli is famous for its majestic cliffs rising 250-300 meters above the Mediterranean Sea, offering spectacular views of Filfla islet and breathtaking sunsets.",
    "Iż-Żurrieq, Malta":
      "Iż-Żurrieq is one of Malta's oldest towns, famous for the Blue Grotto sea caves, St. Catherine's Church, and historic windmills.",
    "Żurrieq, Malta":
      "Żurrieq is one of Malta's oldest towns, famous for the Blue Grotto sea caves, St. Catherine's Church, and historic windmills.",
  };

  // If location is not defined, do not render any summary
  if (!location) {
    return null;
  }

  // Use the summary for the detected location. If there's no mapping defined, render an empty string.
  const summary = locationSummaries[location] || "";

  return (
    <div id="location-info">
      <p>{summary}</p>
    </div>
  );
}

export default LocationInfo;
