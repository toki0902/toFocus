import React from "react";
import "./calender.css";
import { FlexBox } from "@component";
import trackIcon from "@images/track.svg";
import { searchDataWithThisDay, toPadStart } from "../../../../utils";
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
} from "date-fns";

const Calender = ({ sampleData, selectedDate, setSelectedDate }) => {
  const calender_title_str = `${toPadStart(
    selectedDate.getFullYear()
  )}年${toPadStart(selectedDate.getMonth() + 1)}月の足跡`;

  const firstDayOfMonth = startOfMonth(selectedDate);
  const lastDayOfMonth = endOfMonth(selectedDate);

  const firstDayOfFirstWeek = startOfWeek(firstDayOfMonth);
  const lastDayOfLastWeek = endOfWeek(lastDayOfMonth);

  console.log(firstDayOfFirstWeek, lastDayOfLastWeek);

  const date_arr = eachDayOfInterval({
    start: firstDayOfFirstWeek,
    end: lastDayOfLastWeek,
  });

  const calender_items = date_arr.map((item) => {
    const focusData = searchDataWithThisDay(item, sampleData)[0];
    const date = item.getDate();
    const month = item.getMonth();
    const year = item.getFullYear();
    const hasTrack = !!focusData?.tracks?.length;

    const isSelected =
      selectedDate.getFullYear() === year &&
      selectedDate.getMonth() === month &&
      selectedDate.getDate() === date;
    const isFirstDayOfYear = date === 1 && month === 1;
    const isFirstDayOfMonth = date === 1;
    const isHoliday = item.getDay() === 0 || item.getDay() === 6;
    const isThisMonth = month === selectedDate.getMonth();
    const date_adjusted = toPadStart(date);
    const month_adjusted = toPadStart(month + 1);
    return (
      <FlexBox
        className={
          isThisMonth
            ? isHoliday
              ? isSelected
                ? "calender__date-item--holiday selected"
                : "calender__date-item--holiday"
              : isSelected
              ? "calender__date-item selected"
              : "calender__date-item"
            : "calender__date-item--not-this-month"
        }
        width="calc(90% / 7)"
        height={date_arr.length > 35 ? "calc(95% / 6)" : "calc(95% / 5)"}
        pd="5px 5px 5px 5px"
        mr="3px"
        ml="3px"
        top
        left
        onClick={isThisMonth ? () => setSelectedDate(item) : null}
      >
        <p>
          {isFirstDayOfYear
            ? `${year}年${month_adjusted}月${date_adjusted}`
            : isFirstDayOfMonth
            ? `${month_adjusted}月${date_adjusted}`
            : date_adjusted}
        </p>
        {hasTrack ? (
          <img src={trackIcon} className="calender__date-item-image" />
        ) : null}
      </FlexBox>
    );
  });
  return (
    <FlexBox className="Calender" width="100%" height="80%" top column>
      <h2 className="calender__title">{calender_title_str}</h2>
      <FlexBox width="100%" height="80%">
        {calender_items}
      </FlexBox>
    </FlexBox>
  );
};

export default Calender;
