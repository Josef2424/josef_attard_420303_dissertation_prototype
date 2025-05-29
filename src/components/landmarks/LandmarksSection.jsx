import React from "react";
import "./landmarksSection.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "../../context/LocationContext";
import PlaceHolderImage from "../../assets/images/placeholder.jpg";

const landmarks = [
  //----------------VALLETTA/ IL-BELT VALLETTA------------------//
  {
    name: "St. John's Co-Cathedral",
    location: "Valletta, Malta",
    image: "/images/valletta/st-johns.jpg",
    model: "/models/valletta/John_Co_Cathedral.glb",
  },
  {
    name: "Valletta City Gate",
    location: "Valletta, Malta",
    image: "/images/valletta/valletta-city-gate.jpg",
    model: "/models/test.glb",
  },
  {
    name: "St. George's Square",
    location: "Valletta, Malta",
    image: "/images/valletta/valletta-st-george-square.jpg",
    model: "/models/test.glb",
  },
  {
    name: "Waterfront",
    location: "Valletta, Malta",
    image: "/images/valletta/valletta-waterfront.jpg",
    model: "/models/test.glb",
  },
  {
    name: "Grandmaster's Palace",
    location: "Valletta, Malta",
    image: "/images/valletta/valletta-grandmaster-palace.jpg",
    model: "/models/test.glb",
  },
  {
    name: "St. John's Co-Cathedral",
    location: "Il-Belt Valletta, Malta",
    image: "/images/valletta/st-johns.jpg",
    model: "/models/valletta/John_Co_Cathedral.glb",
  },
  {
    name: "Valletta City Gate",
    location: "Il-Belt Valletta, Malta",
    image: "/images/valletta/valletta-city-gate.jpg",
    model: "/models/test.glb",
  },
  {
    name: "St. George's Square",
    location: "Il-Belt Valletta, Malta",
    image: "/images/valletta/valletta-st-george-square.jpg",
    model: "/models/test.glb",
  },
  {
    name: "Waterfront",
    location: "Il-Belt Valletta, Malta",
    image: "/images/valletta/valletta-waterfront.jpg",
    model: "/models/test.glb",
  },
  {
    name: "Grandmaster's Palace",
    location: "Il-Belt Valletta, Malta",
    image: "/images/valletta/valletta-grandmaster-palace.jpg",
    model: "/models/test.glb",
  },
  //----------------PAOLA/RAĦAL ĠDID------------------//
  {
    name: "Church of St. Ubaldeska",
    location: "Paola, Malta",
    image: "/images/paola/church-of-st-ubaldeska-paola.jpg",
    model: "/models/paola/St_Ubaldeska.glb",
  },
  {
    name: "Parroċċa Kristu Re Paola",
    location: "Paola, Malta",
    image: "/images/paola/parrocca-paola.jpg",
    model: "/models/test.glb",
  },
  {
    name: "Knisja ta' Sant' Antnin f'Għajn Dwieli",
    location: "Paola, Malta",
    image: "/images/paola/paola-ghajn-dwieli.jpg",
    model: "/models/test.glb",
  },
  {
    name: "Ħal Saflieni Hypogeum",
    location: "Paola, Malta",
    image: "/images/paola/hal-saflieni-hypogeum.jpg",
    model: "/models/test.glb",
  },
  {
    name: "Church of St. Ubaldeska",
    location: "Raħal Ġdid, Malta",
    image: "/images/paola/church-of-st-ubaldeska-paola.jpg",
    model: "/models/paola/St_Ubaldeska.glb",
  },
  {
    name: "Parroċċa Kristu Re Paola",
    location: "Raħal Ġdid, Malta",
    image: "/images/paola/parrocca-paola.jpg",
    model: "/models/test.glb",
  },
  {
    name: "Knisja ta' Sant' Antnin f'Għajn Dwieli",
    location: "Raħal Ġdid, Malta",
    image: "/images/paola/paola-ghajn-dwieli.jpg",
    model: "/models/test.glb",
  },
  {
    name: "Ħal Saflieni Hypogeum",
    location: "Raħal Ġdid, Malta",
    image: "/images/paola/hal-saflieni-hypogeum.jpg",
    model: "/models/test.glb",
  },
  //----------------DINGLI/ĦAD-DINGLI------------------//
  {
    name: "Madalena Chapel",
    location: "Dingli, Malta",
    image: "/images//dingli/chapel-of-mary-magdalene-dingli.jpg",
    model: "/models/dingli/Chapel_of_mary_magdalene.glb",
  },
  {
    name: "St Dominica Chapel",
    location: "Dingli, Malta",
    image: "/images/dingli/chapel-of-st-domenika-dingli.jpg",
    model: "/models/test.glb",
  },
  {
    name: "Dingli Parish Church",
    location: "Dingli, Malta",
    image: "/images/dingli/st-mary-church-dingli.jpg",
    model: "/models/test.glb",
  },
  {
    name: "Madalena Chapel",
    location: "Ħad-Dingli, Malta",
    image: "/images/dingli/chapel-of-mary-magdalene-dingli.jpg",
    model: "/models/dingli/Chapel_of_mary_magdalene.glb",
  },
  {
    name: "St Dominica Chapel",
    location: "Ħad-Dingli, Malta",
    image: "/images/dingli/chapel-of-st-domenika-dingli.jpg",
    model: "/models/test.glb",
  },
  {
    name: "Dingli Parish Church",
    location: "Ħad-Dingli, Malta",
    image: "/images/dingli/st-mary-church-dingli.jpg",
    model: "/models/test.glb",
  },
  //-----------------ŻURRIEQ/IŻ-ŻURRIEQ---------------------//
  {
    name: "Xutu Tower",
    location: "Żurrieq, Malta",
    image: "/images/zurrieq/zurrieq-xutu-tower.webp",
    model: "/models/zurrieq/Xutu_Tower.glb",
  },
  {
    name: "Blue Grotto",
    location: "Żurrieq, Malta",
    image: "/images/zurrieq/zurrieq-blue-grotto.webp",
    model: "/models/test.glb",
  },
  {
    name: "Xarolla Windmill",
    location: "Żurrieq, Malta",
    image: "/images/zurrieq/zurrieq-xarolla-windmill.webp",
    model: "/models/test.glb",
  },
  {
    name: "Madonna tal-Karmnu.",
    location: "Żurrieq, Malta",
    image: "/images/zurrieq/zurrieq-madonna-tal-karmnu.jpg",
    model: "/models/test.glb",
  },
  {
    name: "Xutu Tower",
    location: "Iż-Żurrieq, Malta",
    image: "/images/zurrieq/zurrieq-xutu-tower.webp",
    model: "/models/zurrieq/Xutu_Tower.glb",
  },
  {
    name: "Blue Grotto",
    location: "Iż-Żurrieq, Malta",
    image: "/images/zurrieq/zurrieq-blue-grotto.webp",
    model: "/models/test.glb",
  },
  {
    name: "Xarolla Windmill",
    location: "Iż-Żurrieq, Malta",
    image: "/images/zurrieq/zurrieq-xarolla-windmill.webp",
    model: "/models/test.glb",
  },
  {
    name: "Modonna tal-Karmnu.",
    location: "Iż-Żurrieq, Malta",
    image: "/images/zurrieq/zurrieq-madonna-tal-karmnu.jpg",
    model: "/models/test.glb",
  },
];

function LandmarksSection() {
  const navigate = useNavigate();
  const { location } = useLocation();

  const filteredLandmarks = landmarks.filter(
    (landmark) => landmark.location === location
  );

  const handleViewAR = (modelUrl) => {
    // Ensure any currently playing videos are stopped
    const videos = document.querySelectorAll("video");
    videos.forEach((video) => {
      if (video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    });

    // Navigate to the AR page while passing the model URL via state
    navigate("/ar", { state: { model: modelUrl } });
  };

  if (filteredLandmarks.length === 0) {
    return (
      <section id="landmarks-section">
        <h2>Landmarks</h2>
        <div id="landmarks-container">
          <p>No landmarks available for this location.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="landmarks-section">
      <h2>Landmarks</h2>
      <div id="landmarks-container">
        <div className="landmarks-scroll">
          {filteredLandmarks.map((landmark, index) => (
            <div className="landmark-card" key={index}>
              <img
                src={landmark.image}
                alt={landmark.name}
                className="landmark-image"
                onError={(e) => {
                  e.target.src = "/images/placeholder.jpg"; // Fallback image
                }}
              />
              <h3>{landmark.name}</h3>
              <p>{landmark.location}</p>
              <button
                className="view-ar-btn"
                onClick={() => handleViewAR(landmark.model)}
              >
                View in AR
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LandmarksSection;
