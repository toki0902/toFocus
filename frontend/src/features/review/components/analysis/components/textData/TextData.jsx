import React from "react";
import "./textData.css";
import { FlexBox } from "@component";
import {
  timeDifference,
  toPadStart,
  searchDataWithThisDay,
  searchDataWithThisDuration,
} from "../../../../utils";
import { endOfMonth, startOfMonth } from "date-fns";

const TextData = ({ concentrateData, selectedDate, renderMode }) => {
  const firstDayOfMonth = startOfMonth(selectedDate);
  const firstDate = toPadStart(firstDayOfMonth.getDate());
  const lastDayOfMonth = endOfMonth(selectedDate);
  const lastDate = toPadStart(lastDayOfMonth.getDate());
  const focusData =
    renderMode === "date"
      ? searchDataWithThisDay(selectedDate, concentrateData)
      : searchDataWithThisDuration(
          firstDayOfMonth,
          lastDayOfMonth,
          concentrateData
        );

  console.log("いまおわり");

  const focus_Year = toPadStart(selectedDate.getFullYear());
  const focus_Month = toPadStart(selectedDate.getMonth() + 1);
  const focus_Date = toPadStart(selectedDate.getDate());
  const focus_date =
    renderMode === "date"
      ? `${focus_Year}/${focus_Month}/${focus_Date}`
      : `${focus_Year} ${focus_Month}/${firstDate} ~ ${focus_Month}/${lastDate}`;

  const focus_time = focusData?.reduce((previous, item) => {
    const time_add = item.focusTime?.reduce((prev, current) => {
      return prev + timeDifference(current.start, current.end);
    }, 0);

    return previous + time_add;
  }, 0);

  const focus_time_hour = Math.floor(focus_time / 60);
  const focus_time_minute = focus_time % 60;

  const focus_tasks_num = focusData?.reduce((prev, current) => {
    return prev + (current?.completeTasks?.length || 0);
  }, 0);

  const focus_tasks = [];
  focusData?.forEach((item) => {
    if (item?.completeTasks) {
      focus_tasks.push(
        ...item.completeTasks.map((task) => {
          return (
            <p style={{ width: "100%", marginTop: "10px" }}> 　・{task}</p>
          );
        })
      );
    }
  });

  const focus_tracks_num = focusData?.reduce((prev, current) => {
    return prev + (current?.tracks?.length || 0);
  }, 0);

  return (
    <FlexBox
      className="TextData"
      width="30%"
      height="100%"
      pd="10px 10px 10px 10px"
      top
      column
    >
      <FlexBox width="100%" mb="10px" left>
        日時 : {focusData?.dateString || focus_date}
      </FlexBox>
      <FlexBox width="100%" mb="10px" left>
        記録された時間 : {focus_time_hour}時間{focus_time_minute}分
      </FlexBox>
      <FlexBox width="100%" mb="10px" left>
        達成したタスク数 : {focus_tasks_num || "なし"}
      </FlexBox>
      <FlexBox width="100%" mb="10px" left>
        達成したタスク : {focus_tasks.length === 0 ? "なし" : focus_tasks}
      </FlexBox>
      <FlexBox width="100%" mb="10px" left>
        残した足跡数 : {focus_tracks_num || "なし"}
      </FlexBox>
    </FlexBox>
  );
};

export default TextData;
