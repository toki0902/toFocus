import React from "react";
import "./resInfo.css";
import { FlexBox, Button } from "@component";
import { useNavigate } from "react-router-dom";

const ResInfo = ({
  headline = "アラートヘッドライン",
  descript = "エラーコード〇〇。〇〇して下さい",
}) => {
  const navigate = useNavigate();
  return (
    <FlexBox className="ResInfo" width="100%" height="100%" top>
      <FlexBox
        className="resinfo__info-box"
        width="100%"
        height="500px"
        pd="2% 5% 2% 5%"
        top
        column
        sb
      >
        <h2 className="resinfo__headline">{headline}</h2>
        <FlexBox
          className="resinfo__descript-box"
          left
          top
          width="100%"
          height="73%"
        >
          <p className="resinfo__descript">{descript}</p>
        </FlexBox>
        <Button
          func={() => navigate("/")}
          color="#ff9f47"
          width="200px"
          height="12%"
          isWhiteMain
        >
          ホームに戻る
        </Button>
      </FlexBox>
    </FlexBox>
  );
};

export default ResInfo;
