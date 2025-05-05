import { useState } from "react";
import "./App.css";
import SampleScene from "./canvas/SampleScene.jsx";
import TogglePanel from "./components/TogglePanel.jsx";
import HUDInfo from "./components/UI/HUDInfo.jsx";
import LogoToggleButton from "./components/UI/LogoToggleButton.jsx";
import { useAppStore } from "./store/useAppStore.js";

function App() {
  const { hudVisible, buttonsVisible } = useAppStore();

  return (
    <div>
      <div className="left-ui-column">
        <div className="panel-wrapper"><TogglePanel /></div>
        <div className="logo-wrapper"><LogoToggleButton /></div>
        <div className="hud-wrapper"><HUDInfo /></div>
        <div className="logo-wrapperMobile"><LogoToggleButton /></div>
      </div>
      <SampleScene />
    </div>
  );
}

export default App;
