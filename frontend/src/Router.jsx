import React from "react";
import {
  Route,
  Routes,
} from "react-router-dom/dist/react-router-dom.development";
import Explain from "./features/explain/Explain";
import Work from "./features/work/Work";
import Review from "./features/review/Review";
import Authenticate from "./features/authenticate/Authenticate";
import Config from "./features/config/Config";

const Router = ({ userProfile, setUserProfile }) => {
  return (
    <Routes>
      <Route
        exact
        path="/"
        element={
          <Explain userProfile={userProfile} setUserProfile={setUserProfile} />
        }
      />
      <Route path="/work" element={<Work userProfile={userProfile} />} />
      <Route path="/review" element={<Review userProfile={userProfile} />} />
      <Route
        path="/auth"
        element={<Authenticate userProfile={userProfile} />}
      />
      <Route path="/config" element={<Config userProfile={userProfile} />} />
    </Routes>
  );
};

export default Router;
