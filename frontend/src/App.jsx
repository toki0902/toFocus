import React from "react";
import Router from "./Router";

function App() {
  return (
    <div
      className="App"
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#333",
      }}
    >
      <Router />
      <div style={{ width: "100%", height: "100%", backgroundColor: "#fff" }} />
      <div style={{ width: "100%", height: "100%", backgroundColor: "#333" }} />
      <div style={{ width: "100%", height: "100%", backgroundColor: "#fff" }} />
    </div>
  );
}

export default App;
