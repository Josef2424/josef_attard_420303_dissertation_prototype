import './header.css';
import IonIcon from '@reacticons/ionicons';

function Header() {
  return (
    <section className="myHeader">
      <div id="appName">
        <h1>GeoGuide</h1>
      </div>
      {/*<div id="userProfile">
        <div id="icons-container">
          <IonIcon name="chevron-down-outline"></IonIcon>
          <IonIcon name="person-circle-outline" size="large"></IonIcon>
        </div>
        <div id="userNameContainer">
          <p id="userName">Josef</p>
        </div>
      </div>*/}
    </section>
  );
}

export default Header;