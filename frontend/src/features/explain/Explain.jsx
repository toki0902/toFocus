import React from "react";
import { FlexBox, Button } from "@component";
import Card from "./components/Card";
import watch from "@images/stopwatch.svg";
import graph from "@images/graph.svg";
import tool from "@images/tool.svg";
import { useWhatIsToFocus } from "./hooks/useWhatIsToFocus";
import "./explain.css";
import WhatIsToFocus from "./components/whatistofocus/WhatIsToFocus";

const Explain = () => {
  const {
    isOpen,
    toggleWhatIsToFocus,
    resetPage,
    whatIsOpen,
    nextPage,
    prevPage,
  } = useWhatIsToFocus();
  const clickHandle = () => {
    toggleWhatIsToFocus();
    resetPage();
  };
  return (
    <div className="Explain">
      <FlexBox width="100%" sb height="60%">
        <FlexBox width="50%" height="400px" column left>
          <p className="explain__title">toFocusへようこそ。</p>
          <p className="explain__title">ここは、</p>
          <p className="explain__title">皆様と「集中ワールド」を繋ぐ</p>
          <p className="explain__title">生産性向上プラットフォームです。</p>
          <p className="explain__text--whatIsToFocus" onClick={clickHandle}>
            toFocusとは？
          </p>
        </FlexBox>
        <Button color="rgb(255, 159, 71)" width="30%" height="70px">
          <p style={{ fontSize: "25px" }}>集中ワールドへ行く</p>
        </Button>
      </FlexBox>
      <hr style={{ width: "100%", position: "absolute", left: "0" }} />
      <FlexBox column left width="100%" height="60%" top mt="20px">
        <p className="explain__title">何を提供するのか？</p>
        <p className="explain__text">
          toFocusではユーザの皆様に以下の機能を提供いたします。
        </p>
        <FlexBox width="100%" element="ul" height="300px" mt="50px" sb>
          <Card
            icon={watch}
            title="ポモドーロテクニック"
            explain="集中は「手軽さ」から生まれます。25分作業5分休憩の最効率時間管理法で最高の「集中」を提供します。"
          />
          <Card
            icon={graph}
            title="日々の記録"
            explain="普段の頑張りを記録しましょう。それは、あなたのモチベにつながります。aaaaaaaaaaaaaa"
          />
          <Card
            icon={tool}
            title="その他ツール"
            explain="BGMやメモ機能、その他にも「集中」に必要な、たくさんのツールたちがあなたを待っています。あああああああああ"
          />
        </FlexBox>
      </FlexBox>
      {isOpen ? (
        <>
          <div className="mask" onClick={toggleWhatIsToFocus}></div>
          <WhatIsToFocus
            nextPage={nextPage}
            prevPage={prevPage}
            toggleWhatIsToFocus={toggleWhatIsToFocus}
            whatIsOpen={whatIsOpen}
          />
        </>
      ) : null}
    </div>
  );
};

export default Explain;
