import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom/dist/react-router-dom.development.js";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
