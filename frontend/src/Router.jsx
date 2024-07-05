import React from "react";
import {
  Route,
  Routes,
} from "react-router-dom/dist/react-router-dom.development";
import Explain from "./features/explain/Explain";
import Work from "./features/work/Work";
import Review from "./features/review/Review";
import Authenticate from "./features/authenticate/Authenticate";

const Router = ({ userProfile, setUserProfile }) => {
  return (
    <Routes>
      <Route
        exact
        path="/"
        element={
          <Explain userProfile={userProfile} setUserProfile={setUserProfile} />
        }
      ></Route>
      <Route path="/work" element={<Work userProfile={userProfile} />}></Route>
      <Route
        path="/review"
        element={<Review userProfile={userProfile} />}
      ></Route>
      <Route
        path="/auth"
        element={<Authenticate userProfile={userProfile} />}
      ></Route>
    </Routes>
  );
};

export default Router;
