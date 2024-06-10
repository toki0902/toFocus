import React, { useEffect, useState } from "react";
import "./do.css";
import { FlexBox } from "@component";
import { BgmMaker } from "./components/bgmMaker/index.jsx";
import ToolBox from "./components/toolBox/ToolBox";
import AlertMenu from "./components/alertMenu/AlertMenu.jsx";

//time_limit_msを受け取って作業場を提供する。
//time_limit後はworkingTimeを更新し、Breakコンポーネントを呼び出す。
const Do = ({
  time_limit_ms = 30000,
  startBreak,
  updateWorkingTime_useMin,
  //FIX : なぜか最新のタスクが渡されない。タスケテ。
  tasks,
}) => {
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

  //ツールボックスを開く用の関数群
  const toggleToolBox = () => {
    setIsOpenToolBox((prev) => !prev);
  };
  const openToolBox = () => setIsOpenToolBox(true);
  const closeToolBox = () => setIsOpenToolBox(false);

  //さまざまなアラートを出すメニューが開いているかどうかを管理するためのState
  //whichAlertMenuIsOpenがアラートメニューの中身を管理する
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [whichAlertMenuIsOpen, setWhichAlertMenuIsOpen] = useState("");

  const openThisAlertMenu = (menu) => {
    setWhichAlertMenuIsOpen(menu);
    setIsOpenAlert(true);
  };

  const closeAlertMenu = () => setIsOpenAlert(false);

  useEffect(() => {
    setTools([
      <BgmMaker
        key={Date.now()}
        myKey={Date.now()}
        removeThisTool={removeThisTool}
        genre="jazz"
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
      ></FlexBox>
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
          onClick={openToolBox}
        >
          ツール
        </li>
        <li
          className="do__menu-item"
          onClick={() => {
            openThisAlertMenu("toBreak");
          }}
        >
          休憩する
        </li>
        <li
          className="do__menu-item"
          onClick={() => {
            openThisAlertMenu("toHome");
          }}
        >
          ホームに戻る
        </li>
      </FlexBox>
      {tools}
      {isOpenToolBox ? (
        <ToolBox
          removeThisTool={removeThisTool}
          closeToolBox={closeToolBox}
          setTools={setTools}
        />
      ) : null}
      {isOpenAlert ? (
        <AlertMenu
          closeAlertMenu={closeAlertMenu}
          whichAlertMenuIsOpen={whichAlertMenuIsOpen}
        />
      ) : null}
    </div>
  );
};

export default Do;
