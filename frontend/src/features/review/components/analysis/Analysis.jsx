import React from "react";
import "./analysis.css";
import { FlexBox } from "@component";

const Analysis = () => {
  return (
    <FlexBox className="Analysis" width="100%" height="100%" top column>
      <h2 className="analysis__title">
        「」さんの<span className="analysis__title--main-color">記録</span>
      </h2>
      <FlexBox width="100%" height="80%">
        <FlexBox
          className="analysis__graph"
          width="70%"
          height="100%"
        ></FlexBox>
        <FlexBox
          className="analysis__data--text"
          width="30%"
          height="100%"
        ></FlexBox>
      </FlexBox>
    </FlexBox>
  );
};

export default Analysis;
