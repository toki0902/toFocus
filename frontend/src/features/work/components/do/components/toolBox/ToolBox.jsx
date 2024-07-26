import React, { forwardRef, useState } from "react";
import { FlexBox } from "@component";
import Memo from "../memo/Memo";
import "./toolBox.css";
import { BgmMaker, BgmMakerConfig } from "../bgmMaker";

//toolをDoコンポーネントに追加するためのメニューを表示するコンポーネント
//tool自体を生成する関数を定義するのはtoolboxコンポーネントで、
//実行するのは各toolのconfigページ
const ToolBox = ({ removeThisTool, closeToolBox, setTools }, ref) => {
  //閉じるエフェクトを開始するためのuseState。
  //startがtrueになるとスタイルが当てられ、animaitonが0.3sで開始する。
  const [isStart, setIsStart] = useState(false);

  const close = () => {
    setIsStart(true);
    setTimeout(closeToolBox, 300);
  };

  const addBgmMaker = (songGenre) => {
    const newBgmMaker = (
      <BgmMaker
        key={Date.now()}
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
      return [...prev, newMemo];
    });
  };

  const [whichConfigIsOpen, setWhichConfigIsOpen] = useState("home");
  const value =
    whichConfigIsOpen === "home" ? (
      <>
        <h2 className="toolbox__title">ツールボックス</h2>
        <FlexBox width="100%" height="80%" element="ul">
          <FlexBox
            className="toolbox__item"
            width="30%"
            height="40%"
            onClick={() => setWhichConfigIsOpen("bgmmaker")}
            element="li"
          >
            <p>BGM MAKER</p>
          </FlexBox>
          <FlexBox
            className="toolbox__item"
            width="30%"
            height="40%"
            onClick={addMemo}
            element="li"
          >
            <p>Memo</p>
          </FlexBox>
        </FlexBox>
      </>
    ) : whichConfigIsOpen === "bgmmaker" ? (
      <BgmMakerConfig addBgmMaker={addBgmMaker} />
    ) : null;

  return (
    <FlexBox
      className={isStart ? "ToolBox close" : "ToolBox"}
      width="60%"
      height="60%"
      column
      pt="5%"
      pr="5%"
      pl="5%"
      pb="5%"
    >
      {value}
      <div className="toolbox__close-btn" onClick={close} />
    </FlexBox>
  );
};

export default ToolBox;
