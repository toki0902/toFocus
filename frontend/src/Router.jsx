import React from "react";
import {
  Route,
  Routes,
} from "react-router-dom/dist/react-router-dom.development";
import Explain from "./features/explain/Explain";
import Work from "./features/work/Work";
import Review from "./features/review/Review";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Explain />}></Route>
      <Route path="/work" element={<Work />}></Route>
      <Route path="/review" element={<Review />}></Route>
    </Routes>
  );
};

export default Router;
