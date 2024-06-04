import React, { useCallback, useState } from "react";
import SetGoals from "./components/setGoals/SetGoals";
import Do from "./components/do/Do";
import Break from "./components/break/Break";
import "./work.css";

const Work = () => {
  const [tasks, setTasks] = useState([]);
  const [requireTime_min, setRequireTime_min] = useState(0);
  const [workingHours_min, setWorkingHours_min] = useState(0);
  const [
    workingHours_withoutLongBreak_min,
    setWorkingHours_withoutLongBreak_min,
  ] = useState(0);

  const startDo = useCallback(() => {
    setCurrentStage(
      <Do
        key={Date.now()}
        startBreak={startBreak}
        updateWorkingTime_useMin={updateWorkingTime_useMin}
        tasks={tasks}
      />
    );
  }, [tasks]);

  //目標タスクを追加で一つ設定するための関数
  //SetGoalsコンポーネントを新規で呼び出す。
  const continueSetGoals = useCallback(
    (task_toAdd, time_toAdd) => {
      setTasks((prev) => [...prev, task_toAdd]);
      setRequireTime_min((prev) => prev + time_toAdd);
      setCurrentStage(
        <SetGoals
          Continue
          continueSetGoals={continueSetGoals}
          key={Date.now()}
          startDo={startDo}
        />
      );
    },
    [startDo]
  );

  //Doコンポーネントに渡すためのupdate用の関数
  const updateWorkingTime_useMin = (time_toAdd) => {
    setWorkingHours_min((prev) => prev + time_toAdd);
    setWorkingHours_withoutLongBreak_min((prev) => prev + time_toAdd);
  };

  const startBreak = () => {
    setCurrentStage(<Break key={Date.now()} />);
  };

  const [currentStage, setCurrentStage] = useState(
    <SetGoals continueSetGoals={continueSetGoals} />
  );

  return <div className="Work">{currentStage}</div>;
};

export default Work;
