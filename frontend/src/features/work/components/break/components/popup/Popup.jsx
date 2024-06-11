import React from "react";
import "./popup.css";
import { FlexBox, Button } from "@component";

const Popup = ({
  width = "70%",
  height = "50%",
  whichPopupIsOpen = "toDo",
  closePopUp,
  startDoWithThisTime,
}) => {
  let title;
  let value;
  switch (whichPopupIsOpen) {
    case "toDo": {
      title = "何分間集中しようか？";
      value = (
        <FlexBox width="80%" sb height="60%">
          <Button
            width="180px"
            height="60px"
            color="#ff9f47"
            isWhiteMain
            func={() => {
              startDoWithThisTime(600000);
            }}
          >
            10分
          </Button>
          <Button
            width="180px"
            height="60px"
            color="#ff9f47"
            isWhiteMain
            func={() => {
              startDoWithThisTime(1500000);
            }}
          >
            25分
          </Button>
          <Button
            width="180px"
            height="60px"
            color="#ff9f47"
            isWhiteMain
            func={() => {
              startDoWithThisTime(3000000);
            }}
          >
            50分
          </Button>
        </FlexBox>
      );
    }
  }
  return (
    <>
      <div className="mask" onClick={closePopUp}></div>
      <FlexBox className="Popup" width={width} height={height} top>
        <h2 className="popup__title">{title}</h2>
        {value}
        <div className="popup__close-btn" onClick={closePopUp}></div>
      </FlexBox>
    </>
  );
};

export default Popup;
