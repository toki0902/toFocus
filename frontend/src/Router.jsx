import React from "react";
import {
  Route,
  Routes,
} from "react-router-dom/dist/react-router-dom.development";
import Explain from "./features/explain/Explain";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Explain />}></Route>
    </Routes>
  );
};

export default Router;
