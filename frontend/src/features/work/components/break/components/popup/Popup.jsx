import React from "react";
import "./popup.css";
import { FlexBox, Button } from "@component";

const Popup = ({
  width = "70%",
  height = "50%",
  whichPopupIsOpen,
  closePopUp,
  startDoWithThisTime,
  startBreakWithThisTime,
  workingHours_withoutLongBreak_min,
}) => {
  let title;
  let value;
  switch (whichPopupIsOpen) {
    case "toDo":
      {
        title = "何分間集中しようか？";
        value = (
          <FlexBox className="popup__value-box" width="80%" sb height="60%">
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
      break;
    case "quit":
      {
        title = "本当に辞めますか？";
        value = (
          <FlexBox
            className="popup__value-box--quit"
            width="80%"
            sb
            height="60%"
          >
            <Button
              width="180px"
              height="60px"
              color="#ff9f47"
              isWhiteMain
              func={closePopUp}
            >
              いいえ
            </Button>
            <Button width="180px" height="60px" color="#ff9f47" isWhiteMain>
              はい
            </Button>
          </FlexBox>
        );
      }
      break;
    case "toLongBreak": {
      title = `きみはもう${workingHours_withoutLongBreak_min}分もぶっとうしで集中している。`;
      value = (
        <FlexBox height="60%" width="100%" column>
          <p style={{ marginBottom: "10px", fontSize: "20px" }}>
            少し長い休憩を取るべきだ
          </p>
          <p style={{ marginBottom: "10px", fontSize: "20px" }}>
            さあどれにする？
          </p>
          <FlexBox className="popup__value-box" width="80%" sb height="60%">
            <Button
              width="180px"
              height="60px"
              color="#ff9f47"
              isWhiteMain
              func={() => {
                startBreakWithThisTime(900000);
              }}
            >
              15分
            </Button>
            <Button
              width="180px"
              height="60px"
              color="#ff9f47"
              isWhiteMain
              func={() => {
                startBreakWithThisTime(1800000);
              }}
            >
              30分
            </Button>
            <Button
              width="180px"
              height="60px"
              color="#ff9f47"
              isWhiteMain
              func={() => {
                startBreakWithThisTime(3000000);
              }}
            >
              50分
            </Button>
          </FlexBox>
        </FlexBox>
      );
    }
  }
  return (
    <>
      <div className="mask" onClick={closePopUp}></div>
      <FlexBox className="Popup" width={width} height={height} top column>
        <h2 className="popup__title">{title}</h2>
        {value}
        <div className="popup__close-btn" onClick={closePopUp}></div>
      </FlexBox>
    </>
  );
};

export default Popup;
