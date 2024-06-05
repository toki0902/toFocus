import React, { useCallback, useEffect, useState } from "react";
import "./do.css";
import { useInteract } from "../../hooks/useInteract";
import { FlexBox } from "@component";
import BgmMaker from "../bgmMaker/BgmMaker";
import Memo from "../memo/Memo";
import ToolBox from "../toolBox/ToolBox";

//time_limit_msを受け取って作業場を提供する。
//time_limit後はworkingTimeを更新し、Breakコンポーネントを呼び出す。
const Do = ({
  time_limit_ms = 30000,
  startBreak,
  updateWorkingTime_useMin,
  //FIX : なぜか最新のタスクが渡されない。タスケテ。
  tasks,
}) => {
  const taskItems = tasks.map((task) => {
    return (
      <FlexBox element="li" sb width="90%" height="2rem">
        <p>{task}</p>
      </FlexBox>
    );
  });

  //作業画面に出現しているツールを管理するState
  const [tools, setTools] = useState([]);

  //各ツールに渡す用の自身を削除する用の関数
  const removeThisTool = (id) => {
    setTools((prev) => {
      return prev.filter((item) => {
        return item.props.myKey !== id;
      });
    });
  };

  //ツールボックスが開いているのかどうかを管理するためのState
  const [isOpenToolBox, setIsOpenToolBox] = useState(false);

  const toggleToolBox = () => {
    setIsOpenToolBox((prev) => !prev);
  };

  const openToolBox = () => setIsOpenToolBox(true);
  const closeToolBox = () => setIsOpenToolBox(false);

  useEffect(() => {
    setTools([
      <BgmMaker
        key={Date.now()}
        myKey={Date.now()}
        removeThisTool={removeThisTool}
        genre="jazz"
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
        className="do__menu"
        element="ul"
        column
        width="200px"
        height="auto"
        left
        top
      >
        <li
          className="do__menu-item"
          style={isOpenToolBox ? { opacity: 1 } : {}}
          onClick={toggleToolBox}
        >
          ツール
        </li>
        <li className="do__menu-item">休憩する</li>
        <li className="do__menu-item">ホームに戻る</li>
      </FlexBox>
      {tools}
      {isOpenToolBox ? (
        <ToolBox
          removeThisTool={removeThisTool}
          closeToolBox={closeToolBox}
          setTools={setTools}
        />
      ) : null}
    </div>
  );
};

export default Do;
