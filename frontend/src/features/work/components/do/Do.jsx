import React, { useEffect } from "react";
import "./do.css";
import { useInteract } from "../../hooks/useInteract";

//time_limit_msを受け取って作業場を提供する。
//time_limit後はworkingTimeを更新し、Breakコンポーネントを呼び出す。
const Do = ({
  time_limit_ms = 30000,
  startBreak,
  updateWorkingTime_useMin,
}) => {
  useEffect(() => {
    const timer = setTimeout(
      //() => {console.log(`${time_limit_ms}マイクロ秒たちました`);}
      startBreak,
      time_limit_ms
    );
    const start = Date.now();

    return () => {
      clearTimeout(timer);

      //10の位の秒数を四捨五入して更新
      //2分30秒 = 3分, 2分29秒 = 2分
      const end = Date.now();
      console.log(end - start);
      const time_toAdd = Math.round((end - start) / 60000);
      updateWorkingTime_useMin(time_toAdd);
    };
  }, []);

  return <div className="Do"></div>;
};

export default Do;
