import React, { useEffect, useState } from "react";
import "./break.css";
import { FlexBox, Button } from "@component";
import breakIcon from "@images/peopleinthebed.svg";
import dolphinIcon from "@images/dolphin.svg";
import Column from "./components/column/Column";
import Popup from "./components/popup/Popup";
import AlertToLongBreak from "./components/longbreakalert/AlertToLongBreak";

const Break = ({
  time_limit_ms,
  startDoWithThisTime,
  startBreakWithThisTime,
  startSetTrack,
  setWorkingHours_withoutLongBreak_min,
  workingHours_withoutLongBreak_min,
  long = false,
}) => {
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

  const [isOverTimeLimit, setIsOverTimeLimit] = useState(false);
  let isOverTimeLimitForTimer = false;

  const [isOpenPopUp, setIsOpenPopUp] = useState(false);
  const [whichIsOpenPopUp, setWhichIsOpenPopUp] = useState("");

  const openThisPopUp = (menu) => {
    setWhichIsOpenPopUp(menu);
    setIsOpenPopUp(true);
  };

  const closePopUp = () => {
    setIsOpenPopUp(false);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLimit_min((prev) => {
        let min;
        let sec;
        if (isOverTimeLimitForTimer) {
          min = Number(prev.split(":")[0].slice(1));
        } else {
          min = Number(prev.split(":")[0]);
        }
        sec = Number(prev.split(":")[1]);

        if (min === 0 && sec === 0) {
          isOverTimeLimitForTimer = true;
          setIsOverTimeLimit(true);
        }

        if (isOverTimeLimitForTimer) {
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

    return () => {
      clearInterval(timer);
      if (long) {
        setWorkingHours_withoutLongBreak_min(0);
      }
    };
  }, []);

  return (
    <FlexBox
      className="Break"
      width="100%"
      height="100%"
      column
      pt="5%"
      pb="5%"
      top
    >
      <img
        src={breakIcon}
        alt=""
        className={isOverTimeLimit ? "break__icon invisible" : "break__icon"}
      />
      <img
        src={dolphinIcon}
        alt=""
        className={
          isOverTimeLimit ? "break__icon--toDo" : "break__icon--toDo invisible"
        }
      />
      <h2
        className={
          isOverTimeLimit ? "break__text--big invisible" : "break__text--big"
        }
      >
        お疲れ様！よく頑張った！休憩しよう！
      </h2>
      <h2
        className={
          isOverTimeLimit
            ? "break__text--big--toDo"
            : "break__text--big--toDo invisible"
        }
      >
        さあ休憩は終わりだ！！がんばれ！！
      </h2>
      <p
        style={{
          fontSize: "28px",
          fontWeight: "bolder",
          marginBottom: "40px",
        }}
      >
        残り
      </p>
      <p className="break__time-limit">{timeLimit_min}</p>
      <Column />
      <FlexBox width="40%" mt="40px" sb>
        <Button
          color="#ff9f47"
          height="60px"
          maxWidth="200px"
          width="40%"
          isWhiteMain
          func={() => openThisPopUp("toDo")}
        >
          休憩を終わる
        </Button>
        <Button
          color="#ff9f47"
          height="60px"
          maxWidth="200px"
          width="40%"
          isWhiteMain
          func={() => openThisPopUp("quit")}
        >
          今日はもうやめる
        </Button>
      </FlexBox>
      {isOpenPopUp ? (
        <Popup
          closePopUp={closePopUp}
          startDoWithThisTime={startDoWithThisTime}
          startBreakWithThisTime={startBreakWithThisTime}
          startSetTrack={startSetTrack}
          whichPopupIsOpen={whichIsOpenPopUp}
          workingHours_withoutLongBreak_min={workingHours_withoutLongBreak_min}
        />
      ) : null}
      {!long && workingHours_withoutLongBreak_min >= 50 ? (
        <AlertToLongBreak openThisPopUp={openThisPopUp} />
      ) : null}
    </FlexBox>
  );
};

export default Break;
