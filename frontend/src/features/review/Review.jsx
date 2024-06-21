import React, { useState } from "react";
import "./review.css";
import Sidebar from "./components/sidebar/Sidebar";
import { FlexBox } from "@component";

const Review = () => {
  const [whichMenuIsOpen, setWhichMenuIsOpen] = useState("analysis");
  return (
    <FlexBox className="Review" width="100%" height="calc(100% - 70px)">
      <Sidebar
        whichMenuIsOpen={whichMenuIsOpen}
        setWhichMenuIsOpen={setWhichMenuIsOpen}
      ></Sidebar>
    </FlexBox>
  );
};

export default Review;
