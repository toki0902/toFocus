import React, { useRef, useState } from "react";
import "./review.css";
import Sidebar from "./components/sidebar/Sidebar";
import { FlexBox } from "@component";
import Analysis from "./components/analysis/Analysis";
import Track from "./components/track/Track";

const Review = ({ userProfile }) => {
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
      tracks: [
        [
          { type: "h1", children: [{ text: "タイトル1" }] },
          {
            type: "paragraph",
            children: [{ text: "見出しこれはテキストサンプルです" }],
          },
          {
            type: "paragraph",
            children: [
              {
                text: "これはテキストサンプルですこれはテキストサンプルですこれはテキストサンプルですこれはテ",
              },
              { text: "キストサ", bold: true },
              { text: "ンプル", underline: true, bold: true },
              { underline: true, text: "ですこれはテキストサンプルですこれ" },
              {
                text: "はテキストサンプルですこれはテキストサンプルですこれはテキストサンプルです",
              },
              { text: "これはテキストサンプルですこれはテキスト", bold: true },
              {
                text: "サンプルですこれはテキストサンプルですこれはテキストサンプル",
              },
              { text: "ですこれはテキストサンプルで", italic: true },
            ],
          },
          { type: "paragraph", children: [{ italic: true, text: "" }] },
          {
            type: "list",
            children: [{ italic: true, text: "これはリストです" }],
          },
          {
            type: "paragraph",
            children: [{ italic: true, text: "colaについての講義なう" }],
          },
          { type: "paragraph", children: [{ italic: true, text: "" }] },
        ],
        [
          {
            type: "h1",
            children: [{ text: "" }],
          },
          {
            type: "paragraph",
            children: [{ text: "" }],
          },
        ],
        [
          {
            type: "h1",
            children: [{ text: "" }],
          },
          {
            type: "paragraph",
            children: [{ text: "" }],
          },
        ],
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

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [whichMenuIsOpen, setWhichMenuIsOpen] = useState("analysis");
  const sidebarRef = useRef(null);

  const onMouseMove = (e) => {
    if (e.clientX < 10) {
      sidebarRef.current.classList.add("open");
    }
  };

  const currentMenu =
    whichMenuIsOpen === "analysis" ? (
      <Analysis
        sampleData={sampleData}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
    ) : whichMenuIsOpen === "track" ? (
      <Track
        sampleData={sampleData}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
    ) : null;

  return (
    <div className="Review" onMouseMove={(event) => onMouseMove(event)}>
      <Sidebar
        whichMenuIsOpen={whichMenuIsOpen}
        setWhichMenuIsOpen={setWhichMenuIsOpen}
        ref={sidebarRef}
      />
      {currentMenu}
    </div>
  );
};

export default Review;
