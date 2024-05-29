import React from "react";
import { FlexBox } from "@component";
import "./customTime.css";

const CustomTime = ({ setIsOpenCustomTime }) => {
  const closeCustomTime = () => {
    setIsOpenCustomTime(false);
  };
  //todo : 目標時間をどう管理するかを詳しく考えなければいけない
  return (
    <FlexBox
      className="CustomTime"
      width="250px"
      height="90px"
      onClick={closeCustomTime}
    ></FlexBox>
  );
};

export default CustomTime;
