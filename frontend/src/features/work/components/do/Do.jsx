import React, { useEffect, useState } from "react";
import "./do.css";
import { FlexBox } from "@component";
import { BgmMaker } from "./components/bgmMaker/index.jsx";
import ToolBox from "./components/toolBox/ToolBox";
import AlertMenu from "./components/alertMenu/AlertMenu.jsx";

//time_limit_msを受け取って作業場を提供する。
//time_limit後はworkingTimeを更新し、Breakコンポーネントを呼び出す。
const Do = ({
  time_limit_ms = 5000,
  startBreakWithThisTime,
  startSetTrack,
  updateWorkingTime_useMin,
  tasks,
  userProfile,
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

  //あと何分で終わるかどうかを表示するタイマー
  const [timeLimit_min, setTimeLimit_min] = useState(() => {
    let time_limit_min_unmodify = time_limit_ms / 60000;
    const after_decimal_point =
      time_limit_min_unmodify - Math.floor(time_limit_min_unmodify);
    const after_decimal_point_sec = Math.floor(after_decimal_point * 60);

    return `${Math.floor(time_limit_min_unmodify)
      .toString()
      .padStart(2, "0")}:${after_decimal_point_sec
      .toString()
      .padStart(2, "0")}`;
  });

  useEffect(() => {
    setTools([
      <BgmMaker
        key={Date.now()}
        myKey={Date.now()}
        removeThisTool={removeThisTool}
        genre="jazz"
      />,
    ]);

    //設定された時間が経過したいことを管理するフラグと、
    //1秒ごとにタイマーを更新していく関数
    let isOverTimeLimit = false;
    const timer = setInterval(() => {
      setTimeLimit_min((prev) => {
        let min;
        let sec;
        if (isOverTimeLimit) {
          min = Number(prev.split(":")[0].slice(1));
        } else {
          min = Number(prev.split(":")[0]);
        }
        sec = Number(prev.split(":")[1]);

        if (min === 0 && sec === 0) {
          isOverTimeLimit = true;
          openThisAlertMenu("toBreak");
        }

        if (isOverTimeLimit) {
          const newMin = sec === 59 ? min + 1 : min;
          const newSec = sec === 59 ? 0 : sec + 1;

          return `-${newMin.toString().padStart(2, "0")}:${newSec
            .toString()
            .padStart(2, "0")}`;
        } else {
          const newMin = sec === 0 ? min - 1 : min;
          const newSec = sec === 0 ? 59 : sec - 1;

          return `${newMin.toString().padStart(2, "0")}:${newSec
            .toString()
            .padStart(2, "0")}`;
        }
      });
    }, 1000);
    const start = new Date();

    return () => {
      clearInterval(timer);

      //10の位の秒数を四捨五入して更新
      //2分30秒 = 3分, 2分29秒 = 2分
      const end = new Date();
      const time_toAdd = Math.round((end - start) / 60000);

      //何時から何時まで作業したのかをデータベースに送信
      if (userProfile) {
        const submitWorkingTime = () => {
          const start_timeDataType = `${start.getHours()}:${start.getMinutes()}`;
          const end_timeDataType = `${end.getHours()}:${end.getMinutes()}`;
          const data = {
            id: userProfile.id,
            start: start_timeDataType,
            end: end_timeDataType,
          };
          fetch("http://localhost:8000/api/work/registerFocusData", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
        };
        submitWorkingTime();
      }

      //アプリケーション内でも何時間作業しているかを管理
      //使用用途は休憩を促すメッセージのためなど。
      updateWorkingTime_useMin(time_toAdd);
    };
  }, []);

  return (
    <div className="Do">
      <h2 className="do__time-limit">{timeLimit_min}</h2>
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
        <li className="do__menu-item" onClick={startSetTrack}>
          記録して終わる
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
          startBreakWithThisTime={startBreakWithThisTime}
        />
      ) : null}
    </div>
  );
};

export default Do;
