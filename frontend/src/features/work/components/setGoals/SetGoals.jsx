import React, { useState } from "react";
import { FlexBox, Button } from "@component";
import crossIcon from "@images/cross.svg";
import "./setGoals.css";
import CustomTime from "./components/customTime/CustomTime";

//目標設定のためのコンポーネント。最終的には入力したタスクと時間を追加して、次の段階に移動する。
const SetGoals = ({ Continue = false, continueSetGoals, startDo }) => {
  const [input, setInput] = useState("");
  const [howManyTime, setHowManyTime] = useState(0);
  const [isOpenCustomTime, setIsOpenCustomTime] = useState(false);

  const changeInput = (e) => setInput(e.target.value);
  const resetInput = () => setInput("");
  const toggleItemClicked = (e, time) => {
    const items = document.querySelectorAll(".setGoals-list__item--forSetTime");
    items.forEach((item) => item.classList.remove("clicked"));
    e.target.parentElement.classList.toggle("clicked");
    setHowManyTime(time);
    setIsOpenCustomTime(
      e.target.parentElement.classList.contains("forOpenCustomTime")
    );
  };

  const headline = Continue ? "他には何をする？" : "さあ、今日は何をしようか？";
  return (
    <FlexBox
      className="SetGoals"
      width="100%"
      height="100%"
      pt="5%"
      pb="5%"
      top
      column
    >
      <h2 className="setGoals__text--big">{headline}</h2>
      {Continue ? (
        <p className="setGoals__text--forNextStage" onClick={startDo}>
          → もうしない
        </p>
      ) : null}
      <FlexBox className="setGoals__wrap--forPosition" mt="100px" height="50px">
        <input
          type="text"
          className="setGoals__input--forTask"
          placeholder="タスクを入力してください"
          value={input}
          onChange={changeInput}
        />
        <img
          src={crossIcon}
          alt=""
          className="setGoals__icon--forTask"
          onClick={resetInput}
        />
      </FlexBox>
      <FlexBox
        column
        className={
          input
            ? "setGoals__wrap--forEffect valid"
            : "setGoals__wrap--forEffect"
        }
        mt="100px"
      >
        <h2 className="setGoals__text--big">
          「{input}」にはどれくらいの時間がかかる？
        </h2>
        <FlexBox column element="ul" mt="100px" left>
          {renderTimeOptions(toggleItemClicked)}
          <li className="setGoals-list__item--forSetTime forOpenCustomTime">
            <p onClick={toggleItemClicked}>→ 自分で設定する</p>
            {isOpenCustomTime && (
              <CustomTime setIsOpenCustomTime={setIsOpenCustomTime} />
            )}
          </li>
        </FlexBox>
        <Button
          color={howManyTime && input ? "rgb(255, 159, 71)" : "#c1bdbd"}
          isWhiteMain
          mt="90px"
          width="200px"
          height="50px"
          func={
            howManyTime && input
              ? () => continueSetGoals(input, howManyTime)
              : null
          }
        >
          次へ
        </Button>
      </FlexBox>
    </FlexBox>
  );
};

const renderTimeOptions = (toggleItemClicked) => {
  const timeOptions = [
    { label: "→ 30分くらい", time: 30 },
    { label: "→ 1時間くらい", time: 60 },
    { label: "→ 2時間くらい", time: 120 },
  ];

  return timeOptions.map(({ label, time }) => (
    <li className="setGoals-list__item--forSetTime" key={time}>
      <p onClick={(e) => toggleItemClicked(e, time)}>{label}</p>
    </li>
  ));
};

export default SetGoals;
