import React from "react";
import "./alertToLongBreak.css";
import { FlexBox } from "@component";
import exclamationIcon from "@images/exclamation.svg";

const AlertToLongBreak = ({ openThisPopUp }) => {
  return (
    <FlexBox
      className="Alerttolongbreak"
      width="fit-content"
      height="30px"
      left
      pl="10px"
      pr="10px"
      onClick={() => openThisPopUp("toLongBreak")}
    >
      <img src={exclamationIcon} className="alert__icon" alt="icon" />
      <p className="alert__text">そろそろ長い休憩を取らないか、、？</p>
    </FlexBox>
  );
};

export default AlertToLongBreak;
