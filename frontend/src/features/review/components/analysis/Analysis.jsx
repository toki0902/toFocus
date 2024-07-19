import React, { useEffect, useState, useRef } from "react";
import "./analysis.css";
import { FlexBox } from "@component";
import { eachDayOfInterval } from "date-fns";
import Graph from "./components/graph/Graph";
import TextData from "./components/textData/TextData";

const Analysis = ({
  selectedDate,
  setSelectedDate,
  concentrateData,
  userProfile,
}) => {
  const [renderMode, setRenderMode] = useState("date");

  useEffect(() => {
    setSelectedDate(new Date());
  }, []);

  return (
    <FlexBox className="Analysis" width="100%" height="100%" top column>
      <h2 className="analysis__title">
        「{userProfile ? userProfile.name : "無名"}」さんの
        <span className="analysis__title--main-color">記録</span>
      </h2>
      <FlexBox width="100%" height="80%">
        <Graph
          concentrateData={concentrateData}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          renderMode={renderMode}
          setRenderMode={setRenderMode}
        />
        <TextData
          concentrateData={concentrateData}
          selectedDate={selectedDate}
          renderMode={renderMode}
        ></TextData>
      </FlexBox>
    </FlexBox>
  );
};

export default Analysis;
