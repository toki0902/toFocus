import React, { useState } from "react";
import { FlexBox, Button } from "@component";
import crossIcon from "@images/cross.svg";
import "./setGoals.css";
import CustomTime from "../customTime/CustomTime";

const SetGoals = ({ headline = "さて、今日は何をしようか" }) => {
  const [input, setInput] = useState("");
  const [isOpenCustomTime, setIsOpenCustomTime] = useState(false);
  const changeInput = (e) => {
    setInput(e.target.value);
  };
  const resetInput = () => {
    setInput("");
  };
  const toggleItem_clicked = (e) => {
    const items = document.querySelectorAll(".setGoals-list__item--forSetTime");
    items.forEach((item) => item.classList.remove("clicked"));
    e.target.classList.add("clicked");
    if (e.target.classList.contains("forOpenCustomTime")) {
      setIsOpenCustomTime(true);
    }
  };
  return (
    <FlexBox className="SetGoals" width="100%" height="100%" top column>
      <h2 className="setGoals__text--big">{headline}</h2>
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
      <FlexBox column className="setGoals__wrap--forEffect" mt="100px">
        <h2 className="setGoals__text--big">
          「{input}」にはどれくらいの時間がかかる？
        </h2>
        <FlexBox column element="ul" mt="100px" left>
          <li
            className="setGoals-list__item--forSetTime"
            onClick={toggleItem_clicked}
          >
            → 30分くらい
          </li>
          <li
            className="setGoals-list__item--forSetTime"
            onClick={toggleItem_clicked}
          >
            → 1時間くらい
          </li>
          <li
            className="setGoals-list__item--forSetTime"
            onClick={toggleItem_clicked}
          >
            → 2時間くらい
          </li>
          <li
            className="setGoals-list__item--forSetTime forOpenCustomTime"
            onClick={toggleItem_clicked}
          >
            → 自分で設定する
            {isOpenCustomTime ? (
              <CustomTime setIsOpenCustomTime={setIsOpenCustomTime} />
            ) : null}
          </li>
        </FlexBox>
        <Button
          color="rgb(255, 159, 71)"
          isWhiteMain
          mt="90px"
          width="200px"
          height="50px"
        >
          次へ
        </Button>
      </FlexBox>
    </FlexBox>
  );
};

export default SetGoals;
