import React, { useState } from "react";
import "./graph.css";
import { FlexBox } from "@component";
import { eachDayOfInterval, endOfWeek, startOfWeek } from "date-fns";

const Graph = ({ searchDataWithThisDay }) => {
  //renderModeはどの単位ごとに勉強時間を表示するかを管理する。
  //取り得る値はdate, month, year
  const [renderMode, setRenderMode] = useState("date");

  //renderItemはgraph内で表示される一つの要素を配列で管理する。
  const [renderItem, setRenderItem] = useState([
    //{ date_str: "06/24", focusTime: 168 }データはこんな感じ
  ]);

  const today = new Date();

  const updateItem = (criterion) => {
    switch (renderMode) {
      case "date": {
        const firstDayOfWeek = startOfWeek(criterion, { weekStartsOn: 1 });
        const lastDayOfWeek = endOfWeek(criterion, { weekStartsOn: 1 });

        const weekDays_arr = eachDayOfInterval({
          start: firstDayOfWeek,
          end: lastDayOfWeek,
        });

        const newArray = weekDays_arr.map((item) => {
          const month = toString(item.getMonth() + 1);
          const date = toString(item.getDate());
          const date_str = `${month.padStart(2, "0")}/${date.padStart(2, "0")}`;

          const filteredData = searchDataWithThisDay(item);
          const focus_time =
            filteredData === undefined
              ? 0
              : filteredData[0].focusTime.reduce((prev, current) => {
                  const time = current.end - current.start;
                  return prev + time;
                });

          console.log(focus_time);

          return { date_str: date_str, focusTime: focus_time };
        });

        break;
      }
      case "month": {
        break;
      }
      case "year": {
        break;
      }
    }
  };

  updateItem(today);

  return <FlexBox className="Graph" width="70%" height="100%"></FlexBox>;
};

export default Graph;
