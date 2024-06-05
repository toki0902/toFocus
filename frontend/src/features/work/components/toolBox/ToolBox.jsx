import React, { useEffect, useState } from "react";
import { FlexBox } from "@component";
import Memo from "../memo/Memo";
import "./toolBox.css";
import BgmMaker from "../bgmMaker/BgmMaker";

//toolをDoコンポーネントに追加するためのメニューを表示するコンポーネント
const ToolBox = ({ removeThisTool, closeToolBox, setTools }) => {
  const [isStart, setIsStart] = useState(false);

  const close = () => {
    setIsStart(true);
    setTimeout(closeToolBox, 300);
  };

  const addBgmMaker = (songGenre) => {
    console.log("実行");
    const newBgmMaker = (
      <BgmMaker
        key={Date.now}
        myKey={Date.now()}
        genre={songGenre}
        removeThisTool={removeThisTool}
      />
    );

    setTools((prev) => {
      return [...prev, newBgmMaker];
    });
  };

  const addMemo = () => {
    const newMemo = (
      <Memo
        key={Date.now()}
        myKey={Date.now()}
        removeThisTool={removeThisTool}
      />
    );

    setTools((prev) => {
      console.log(prev);
      return [...prev, newMemo];
    });
  };

  return (
    <FlexBox
      className={isStart ? "ToolBox close" : "ToolBox"}
      width="60%"
      height="60%"
      ul
      sb
    >
      <FlexBox
        className="toolbox__item"
        width="30%"
        height="40%"
        onClick={addBgmMaker}
      >
        <p>BGM MAKER</p>
      </FlexBox>
      <FlexBox
        className="toolbox__item"
        width="30%"
        height="40%"
        onClick={addMemo}
      >
        <p>Memo</p>
      </FlexBox>
    </FlexBox>
  );
};

export default ToolBox;
