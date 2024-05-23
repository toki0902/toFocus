import React from "react";
import Router from "./Router";
import Header from "./components/header/Header";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Header />
      <Router />
    </div>
  );
}

export default App;
