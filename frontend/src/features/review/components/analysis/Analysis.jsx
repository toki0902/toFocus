import React, { useState } from "react";
import "./analysis.css";
import { FlexBox } from "@component";
import { eachDayOfInterval } from "date-fns";
import Graph from "./components/graph/Graph";

const Analysis = ({ sampleData }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  //指定した日付のデータをフィルタリングしてくれる関数。
  const searchDataWithThisDay = (thisDay) => {
    const filtered = sampleData.filter((item) => {
      const date = thisDay.getDate();
      const month = thisDay.getMonth() + 1;
      const year = thisDay.getFullYear();
      return date === item.day && month === item.month && year === item.year;
    });

    return filtered;
  };

  //期間内のデータをフィルタリングして返してくれる関数。
  //引数はDate型のオブジェクト。
  const searchDataWithThisDuration = (start, end) => {
    const dayArr = eachDayOfInterval({ start: start, end: end });

    const filtered = sampleData.filter((item) => {
      let isMatch = false;

      dayArr.forEach((dayItem) => {
        const date = dayItem.getDate();
        const month = dayItem.getMonth() + 1;
        const year = dayItem.getFullYear();
        if (date == item.day && month == item.month && year == item.year) {
          isMatch = true;
        }
      });
      return isMatch;
    });
    return filtered;
  };

  return (
    <FlexBox className="Analysis" width="100%" height="100%" top column>
      <h2 className="analysis__title">
        「」さんの<span className="analysis__title--main-color">記録</span>
      </h2>
      <FlexBox width="100%" height="80%">
        <Graph
          searchDataWithThisDay={searchDataWithThisDay}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
        <FlexBox
          className="analysis__data--text"
          width="30%"
          height="100%"
        ></FlexBox>
      </FlexBox>
    </FlexBox>
  );
};

export default Analysis;
