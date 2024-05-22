import React from "react";
import {
  Route,
  Routes,
} from "react-router-dom/dist/react-router-dom.development";

const Router = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<h1 style={{ width: "100%", height: "200px" }}>element 1</h1>}
      ></Route>
      <Route path="/1" element={<h1>element 2</h1>}></Route>
      <Route path="/2" element={<h1>element 3</h1>}></Route>
    </Routes>
  );
};

export default Router;
