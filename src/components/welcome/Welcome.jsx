import { useLocation } from "../../context/LocationContext";
import PaolaCOA from '../../assets/images/COA_Paola.jpg';
import VallettaCOA from '../../assets/images/COA_Valletta.png';
import DingliCOA from '../../assets/images/COA_Dingli.png';
import ZurrieqCOA from '../../assets/images/COA_Zurrieq.png';
import placeholderImage from '../../assets/images/placeholder.jpg';
import "./welcome.css";

const locationCoaMapping = {
  "Raħal Ġdid, Malta": {
    COA: PaolaCOA,
  },
  "Paola, Malta": {
    COA: PaolaCOA,
  },
  "Valletta, Malta": {
    COA: VallettaCOA,
  },
  "Il-Belt Valletta, Malta": {
    COA: VallettaCOA,
  },
  "Dingli, Malta": {
    COA: DingliCOA,
  },
  "Ħad-Dingli, Malta": {
    COA: DingliCOA,
  },
  "Iż-Żurrieq, Malta": {
    COA: ZurrieqCOA,
  },
  "Żurrieq, Malta": {
    COA: ZurrieqCOA,
  },
  Default: {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
    COA: placeholderImage,
  },
};

function Welcome() {
  const { location } = useLocation();
  const defaultCOA = placeholderImage;
  const { COA } = locationCoaMapping[location] || { COA: defaultCOA };

  return (
    <div id="welcome-container">
      <img src={COA} alt="Coat of Arms" id="coa" />
      <h1 id="welcometxt">
        Welcome to <span id="location-name">{location}</span>!
      </h1>
      <div id="line"></div>
    </div>
  );
}

export default Welcome;
