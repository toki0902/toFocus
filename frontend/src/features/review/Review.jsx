import React, { useEffect, useRef, useState } from "react";
import "./review.css";
import Sidebar from "./components/sidebar/Sidebar";
import { FlexBox } from "@component";
import Analysis from "./components/analysis/Analysis";
import Track from "./components/track/Track";

const Review = () => {
  const [whichMenuIsOpen, setWhichMenuIsOpen] = useState("analysis");
  const sidebarRef = useRef(null);

  const onMouseMove = (e) => {
    if (e.clientX < 10) {
      sidebarRef.current.classList.add("open");
    }
  };
  const removeOpenClass = () => {
    console.log("over");
    sidebarRef.current.classList.remove("open");
  };

  const currentMenu =
    whichMenuIsOpen === "analysis" ? (
      <Analysis />
    ) : whichMenuIsOpen === "track" ? (
      <Track />
    ) : null;

  return (
    <FlexBox
      className="Review"
      width="100%"
      height="calc(100% - 70px)"
      pd="0 10% 0 10%"
      onMouseMove={(event) => onMouseMove(event)}
    >
      <Sidebar
        whichMenuIsOpen={whichMenuIsOpen}
        setWhichMenuIsOpen={setWhichMenuIsOpen}
        ref={sidebarRef}
      />
      {currentMenu}
    </FlexBox>
  );
};

export default Review;
