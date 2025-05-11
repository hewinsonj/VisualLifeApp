import React from 'react';
import { useState, useEffect } from "react";
import "./App.css";
import SampleScene from "./canvas/SampleScene.jsx";
import TogglePanel from "./components/TogglePanel.jsx";
import HUDInfo from "./components/UI/HUDInfo.jsx";
import LogoToggleButton from "./components/UI/LogoToggleButton.jsx";
import DebugPanel from './components/DebugPanel';
import useDetectDeviceProfile from "./hooks/useDetectDeviceProfile";
import { useAppStore } from "./store/useAppStore.js";

// function App() {
//   useEffect(() => {
//     const preventZoom = (e) => {
//       if (e.ctrlKey || e.metaKey || e.touches?.length > 1) {
//         e.preventDefault();
//       }
//     };

//     const preventGesture = (e) => e.preventDefault();

//     document.addEventListener("wheel", preventZoom, { passive: false });
//     document.addEventListener("gesturestart", preventGesture, { passive: false });
//     document.addEventListener("gesturechange", preventGesture, { passive: false });
//     document.addEventListener("gestureend", preventGesture, { passive: false });

//     return () => {
//       document.removeEventListener("wheel", preventZoom);
//       document.removeEventListener("gesturestart", preventGesture);
//       document.removeEventListener("gesturechange", preventGesture);
//       document.removeEventListener("gestureend", preventGesture);
//     };
//   }, []);

//   const { hudVisible, buttonsVisible } = useAppStore();
  
//   useDetectDeviceProfile();


//   return (
//     <div>
//       <div className="left-ui-column">
//         <div className="panel-wrapper"><TogglePanel /></div>
//         <div className="logo-wrapper"><LogoToggleButton /></div>
//         <div className="hud-wrapper"><HUDInfo /></div>
//         <div className="logo-wrapperMobile"><LogoToggleButton /></div>
//         <div><DebugPanel /></div>
        
//       </div>
//       <SampleScene />
//     </div>
//   );
// }
import CameraSandbox from './sandbox/CameraSandbox';

function App() {
  return (
    <div style={{ width: "100vw", height: "100vh", margin: 0, padding: 0, overflow: "hidden" }}>
      <CameraSandbox />
    </div>
  );
}


export default App;
