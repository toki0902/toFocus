import React from "react";
import "./track.css";
import { FlexBox } from "@component";
import Calender from "./components/calender/Calender";

const Track = ({ sampleData, selectedDate, setSelectedDate }) => {
  return (
    <FlexBox className="Track" width="100%" height="100%" top column>
      <h2 className="track__title">
        「」さんの<span className="track__title--sub-color">足跡</span>を辿る
      </h2>
      <Calender
        sampleData={sampleData}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
    </FlexBox>
  );
};

export default Track;
