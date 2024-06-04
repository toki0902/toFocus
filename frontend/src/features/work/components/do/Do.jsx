import React, { useCallback, useEffect, useState } from "react";
import "./do.css";
import { useInteract } from "../../hooks/useInteract";
import { FlexBox } from "@component";
import BgmMaker from "../bgmMaker/BgmMaker";
import Memo from "../memo/Memo";

//time_limit_msを受け取って作業場を提供する。
//time_limit後はworkingTimeを更新し、Breakコンポーネントを呼び出す。
const Do = ({
  time_limit_ms = 30000,
  startBreak,
  updateWorkingTime_useMin,
  //FIX : なぜか最新のタスクが渡されない。タスケテ。
  tasks,
}) => {
  console.log(tasks);
  const taskItems = tasks.map((task) => {
    return (
      <FlexBox element="li" sb width="90%" height="2rem">
        <p>{task}</p>
      </FlexBox>
    );
  });
  const [tools, setTools] = useState([]);

  const removeThisTool = (id) => {
    setTools((prev) => {
      return prev.filter((item) => {
        return item.props.myKey !== id;
      });
    });
  };

  useEffect(() => {
    setTools([
      <BgmMaker
        key={Date.now()}
        myKey={Date.now()}
        removeThisTool={removeThisTool}
      />,
      <Memo
        key={Date.now() + 10}
        myKey={Date.now() + 10}
        removeThisTool={removeThisTool}
      />,
    ]);

    const timer = setTimeout(
      () => {
        console.log(`${time_limit_ms}マイクロ秒たちました`);
      },
      // startBreak,
      time_limit_ms
    );
    const start = Date.now();

    return () => {
      clearTimeout(timer);

      //10の位の秒数を四捨五入して更新
      //2分30秒 = 3分, 2分29秒 = 2分
      const end = Date.now();
      const time_toAdd = Math.round((end - start) / 60000);
      updateWorkingTime_useMin(time_toAdd);
    };
  }, []);

  return (
    <div className="Do">
      <h2 className="do__time-limit">どーも</h2>
      <FlexBox
        className="do__task-list"
        element="ul"
        column
        width="20%"
        height="auto"
      >
        {taskItems}
      </FlexBox>
      <FlexBox
        className="do__tool-list"
        element="ul"
        column
        width="20%"
        height="auto"
      ></FlexBox>
      {tools}
    </div>
  );
};

export default Do;
