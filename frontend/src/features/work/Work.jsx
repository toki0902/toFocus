import React, { useState } from "react";
import SetGoals from "./components/setGoals/SetGoals";
import Do from "./components/do/Do";
import "./work.css";

const Work = () => {
  const [tasks, setTasks] = useState([]);
  const [needTime, setNeedTime] = useState(0);
  console.log(tasks, needTime);

  const continueSetGoals = (task_toAdd, time_toAdd) => {
    setTasks((prev) => [...prev, task_toAdd]);
    setNeedTime((prev) => prev + time_toAdd);
    setCurrentStage(
      <SetGoals
        Continue
        continueSetGoals={continueSetGoals}
        key={Date.now()}
        startDo={startDo}
      />
    );
  };

  const startDo = () => {
    setCurrentStage(<Do />);
  };

  const [currentStage, setCurrentStage] = useState(
    <SetGoals continueSetGoals={continueSetGoals} />
  );

  return <div className="Work">{currentStage}</div>;
};

export default Work;
