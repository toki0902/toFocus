import React, { useCallback, useState, useRef, useEffect } from "react";
import SetGoals from "./components/setGoals/SetGoals";
import Do from "./components/do/Do";
import Break from "./components/break/Break";
import SetTrack from "./components/setTrack/SetTrack";
import "./work.css";

//目標設定、実際の作業フェーズ、休憩フェーズ、その後の振り返りまでを管理するfeature
const Work = () => {
  const [tasks, setTasks] = useState([]);

  //コイツの扱いに悩み中...
  //タスクにかかるおおよその時間だけど、集中できたか否かのパラメーターに使う予定...？
  const [requireTime_min, setRequireTime_min] = useState(0);

  const [workingHours_min, setWorkingHours_min] = useState(0);
  const [
    workingHours_withoutLongBreak_min,
    setWorkingHours_withoutLongBreak_min,
  ] = useState(0);

  //Doコンポーネントに最新のtasksを渡すためのRef
  const tasks_Ref = useRef(tasks);
  useEffect(() => {
    tasks_Ref.current = tasks;
  }, [tasks]);

  const startDoWithThisTime = (time) => {
    //上記のRefの更新を待つために100ms待機する
    setTimeout(() => {
      const tmp_task = tasks_Ref.current;
      setCurrentStage(
        <Do
          key={Date.now()}
          startBreakWithThisTime={startBreakWithThisTime}
          startSetTrack={startSetTrack}
          updateWorkingTime_useMin={updateWorkingTime_useMin}
          tasks={tmp_task}
          time_limit_ms={time}
        />
      );
    }, 100);
  };

  //Doコンポーネントに渡すためのupdate用の関数
  const updateWorkingTime_useMin = (time_toAdd) => {
    setWorkingHours_min((prev) => prev + time_toAdd);
    setWorkingHours_withoutLongBreak_min((prev) => prev + time_toAdd);
  };

  //Breakコンポーネントに最新のworkingHours_withoutLongBreak_minを渡すためのRef
  const workingHours_withoutLongBreak_minRef = useRef(
    workingHours_withoutLongBreak_min
  );

  useEffect(() => {
    workingHours_withoutLongBreak_minRef.current =
      workingHours_withoutLongBreak_min;
  }, [workingHours_withoutLongBreak_min]);

  const startBreakWithThisTime = (time) => {
    //useEffectによるRefの更新を待つために一度Doをアンマウントさせてから100ms待つ
    setCurrentStage(<></>);

    setTimeout(() => {
      const tmp_time = workingHours_withoutLongBreak_minRef.current;

      if (time >= 900000) {
        setCurrentStage(
          <Break
            key={Date.now()}
            time_limit_ms={time}
            startDoWithThisTime={startDoWithThisTime}
            startBreakWithThisTime={startBreakWithThisTime}
            startSetTrack={startSetTrack}
            setWorkingHours_withoutLongBreak_min={
              setWorkingHours_withoutLongBreak_min
            }
            workingHours_withoutLongBreak_min={tmp_time}
            long
          />
        );
      } else {
        setCurrentStage(
          <Break
            key={Date.now()}
            time_limit_ms={time}
            startDoWithThisTime={startDoWithThisTime}
            startBreakWithThisTime={startBreakWithThisTime}
            startSetTrack={startSetTrack}
            setWorkingHours_withoutLongBreak_min={
              setWorkingHours_withoutLongBreak_min
            }
            workingHours_withoutLongBreak_min={tmp_time}
          />
        );
      }
    }, 100);
  };

  //目標タスクを追加で一つ設定するための関数
  //SetGoalsコンポーネントを新規で呼び出す。
  const continueSetGoals = (task_toAdd, time_toAdd) => {
    setTasks((prev) => [...prev, task_toAdd]);
    setRequireTime_min((prev) => prev + time_toAdd);
    setCurrentStage(
      <SetGoals
        Continue
        continueSetGoals={continueSetGoals}
        key={Date.now()}
        startDoWithThisTime={startDoWithThisTime}
      />
    );
  };

  const startSetTrack = () => {
    setCurrentStage(<SetTrack></SetTrack>);
  };

  const [currentStage, setCurrentStage] = useState(
    <SetGoals continueSetGoals={continueSetGoals} />
  );

  return <div className="Work">{currentStage}</div>;
};

export default Work;
