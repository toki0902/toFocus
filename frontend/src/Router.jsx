import React from "react";
import {
  Route,
  Routes,
} from "react-router-dom/dist/react-router-dom.development";
import Explain from "./features/explain/Explain";
import Work from "./features/work/Work";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Explain />}></Route>
      <Route path="/work" element={<Work />}></Route>
    </Routes>
  );
};

export default Router;
