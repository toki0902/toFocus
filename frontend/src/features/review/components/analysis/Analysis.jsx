import React, { useEffect, useState } from "react";
import "./analysis.css";
import { FlexBox } from "@component";
import { eachDayOfInterval } from "date-fns";
import Graph from "./components/graph/Graph";
import TextData from "./components/textData/TextData";

const Analysis = ({ selectedDate, setSelectedDate, sampleData }) => {
  const [renderMode, setRenderMode] = useState("date");

  useEffect(() => {
    setSelectedDate(new Date());
  }, []);

  return (
    <FlexBox className="Analysis" width="100%" height="100%" top column>
      <h2 className="analysis__title">
        「」さんの<span className="analysis__title--main-color">記録</span>
      </h2>
      <FlexBox width="100%" height="80%">
        <Graph
          sampleData={sampleData}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          renderMode={renderMode}
          setRenderMode={setRenderMode}
        />
        <TextData
          sampleData={sampleData}
          selectedDate={selectedDate}
          renderMode={renderMode}
        ></TextData>
      </FlexBox>
    </FlexBox>
  );
};

export default Analysis;
