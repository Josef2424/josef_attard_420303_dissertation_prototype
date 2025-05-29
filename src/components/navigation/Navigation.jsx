import { useNavigate } from "react-router-dom";
import "./navigation.css";
import IonIcon from "@reacticons/ionicons";

function Navigation() {
  const navigate = useNavigate();

  const showSettings = () => {
    navigate("/settings");
  };

  const showHome = () => {
    navigate("/");
  };

  const showMaps = () => {
    navigate("/maps");
  };

  return (
    <section className="navBar-container">
      <nav id="navBar">
        <div>
          <button className="btn" onClick={showSettings}>
            <IonIcon name="settings-outline"></IonIcon>
            Settings
          </button>
        </div>
        <div>
          <button className="btn" onClick={showHome}>
            <IonIcon name="home-outline"></IonIcon>
            Home
          </button>
        </div>
        <div>
          <button className="btn" onClick={showMaps}>
            <IonIcon name="map-outline"></IonIcon>
            Maps
          </button>
        </div>
      </nav>
    </section>
  );
}

export default Navigation;
