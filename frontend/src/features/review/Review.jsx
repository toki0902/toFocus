import React, { useEffect, useRef, useState } from "react";
import "./review.css";
import Sidebar from "./components/sidebar/Sidebar";
import { FlexBox } from "@component";
import Analysis from "./components/analysis/Analysis";
import Track from "./components/track/Track";

const Review = () => {
  const sampleData = [
    {
      dateString: "2024/06/26",
      year: 2024,
      month: 6,
      day: 26,
      completeTasks: ["出材カンプを作成する。", "VSCodeのインストール"],
      focusTime: [
        { start: "15:00", end: "22:23" },
        { start: "10:00", end: "13:30" },
      ],
    },
    {
      dateString: "2024/06/23",
      year: 2024,
      month: 6,
      day: 23,
      completeTasks: ["出材カンプを作成する。", "VSCodeのインストール"],
      focusTime: [
        { start: "15:00", end: "16:00" },
        { start: "17:00", end: "18:30" },
      ],
    },
  ];

  const [whichMenuIsOpen, setWhichMenuIsOpen] = useState("analysis");
  const sidebarRef = useRef(null);

  const onMouseMove = (e) => {
    if (e.clientX < 10) {
      sidebarRef.current.classList.add("open");
    }
  };

  const currentMenu =
    whichMenuIsOpen === "analysis" ? (
      <Analysis sampleData={sampleData} />
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
