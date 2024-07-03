import React from "react";
import {
  Route,
  Routes,
} from "react-router-dom/dist/react-router-dom.development";
import Explain from "./features/explain/Explain";
import Work from "./features/work/Work";
import Review from "./features/review/Review";
import Authenticate from "./features/authenticate/Authenticate";

const Router = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Explain />}></Route>
      <Route path="/work" element={<Work />}></Route>
      <Route path="/review" element={<Review />}></Route>
      <Route path="/auth" element={<Authenticate />}></Route>
    </Routes>
  );
};

export default Router;
