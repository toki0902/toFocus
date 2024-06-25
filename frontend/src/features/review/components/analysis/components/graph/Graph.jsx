import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./graph.css";
import { FlexBox } from "@component";
import arrowIcon from "@images/arrow.svg";
import { addWeeks, eachDayOfInterval, endOfWeek, startOfWeek } from "date-fns";

const Graph = ({ searchDataWithThisDay, selectedDate, setSelectedDate }) => {
  //renderModeはどの単位ごとに勉強時間を表示するかを管理する。
  //取り得る値はdate, month, year
  const [renderMode, setRenderMode] = useState("date");

  //renderItemはgraph内で表示される一つの要素を配列で管理する。
  const [renderItem, setRenderItem] = useState([
    //{ date_str: "06/24", focusTime: 168 }データはこんな感じ
  ]);

  //renderItemを更新するための関数
  //criterionを基準にrenderModeにあったItemに更新する。
  const updateItem = useCallback(
    (criterion) => {
      switch (renderMode) {
        case "date": {
          //renderModeがdateだった場合、
          //criterionを含む週のdataをItemとして更新する。

          //週を割り出すための関数
          const firstDayOfWeek = startOfWeek(criterion, { weekStartsOn: 1 });
          const lastDayOfWeek = endOfWeek(criterion, { weekStartsOn: 1 });

          const weekDays_arr = eachDayOfInterval({
            start: firstDayOfWeek,
            end: lastDayOfWeek,
          });

          //HH:MM形式の時間の差分を「分」で返してくれる関数
          const timeDifference = (start, end) => {
            const convertToMinutes = (time) => {
              const [hour, minute] = time.split(":").map(Number);
              return hour * 60 + minute;
            };

            const [startMinute, endMinute] = [
              convertToMinutes(start),
              convertToMinutes(end),
            ];

            const different = endMinute - startMinute;
            return different;
          };

          const newArray = weekDays_arr.map((item) => {
            const month = String(item.getMonth() + 1);
            const date = String(item.getDate());
            //mm:ddの形式の文字列を作成
            const date_str = `${month.padStart(2, "0")}/${date.padStart(
              2,
              "0"
            )}`;

            //日付に該当するデータを検索
            const filteredData = searchDataWithThisDay(item);

            //該当するデータ内のfocusTimeを「分」で計算する。
            const focus_time =
              filteredData[0] === undefined
                ? 0
                : filteredData[0].focusTime.reduce((prev, current) => {
                    const time = timeDifference(current.start, current.end);
                    return prev + time;
                  }, 0);

            return { date_str: date_str, focusTime: focus_time, dateObj: item };
          });

          setRenderItem(newArray);
          break;
        }
        case "month": {
          break;
        }
        case "year": {
          break;
        }
      }
    },
    [renderMode]
  );

  useEffect(() => {
    updateItem(selectedDate);
  }, [selectedDate]);

  //選択されている日付とその日に集中した時間をレンダリングするためのmap
  const renderedSelectedDate = renderItem.map((item) => {
    const year = item.dateObj.getFullYear();
    const month = item.dateObj.getMonth();
    const day = item.dateObj.getDate();
    const isSelected =
      selectedDate.getFullYear() === year &&
      selectedDate.getMonth() === month &&
      selectedDate.getDate() === day;

    if (isSelected) {
      //選択された日付を見つけたら、その日を基準として、その週の日付を獲得する。
      const firstDayOfWeek = startOfWeek(item.dateObj, { weekStartsOn: 1 });
      const lastDayOfWeek = endOfWeek(item.dateObj, { weekStartsOn: 1 });

      const month_firstDay = String(firstDayOfWeek.getMonth() + 1).padStart(
        2,
        "0"
      );
      const day_firstDay = String(firstDayOfWeek.getDate()).padStart(2, "0");
      const month_lastDay = String(lastDayOfWeek.getMonth() + 1).padStart(
        2,
        "0"
      );
      const day_lastDay = String(lastDayOfWeek.getDate()).padStart(2, "0");
      //ここで週の日付を文字列で表す
      const duration_str = `${firstDayOfWeek.getFullYear()} ${month_firstDay}/${day_firstDay} ~ ${month_lastDay}/${day_lastDay}`;
      const month_str = String(month).padStart(2, "0");
      const day_str = String(day).padStart(2, "0");

      //選択された日付の集中した時間を「〇〇時間〇〇分」の形で表す
      const focusTime_hour = Math.floor(item.focusTime / 60);
      const focusTime_minute = item.focusTime % 60;
      return (
        <FlexBox width="100%" height="100%" column>
          <FlexBox width="100%" height="40%">
            <img
              src={arrowIcon}
              alt=""
              className="graph__arrow"
              style={{
                rotate: "180deg",
                marginRight: "50px",
              }}
              onClick={() => {
                setSelectedDate((prev) => {
                  return addWeeks(prev, -1);
                });
              }}
            />
            <p style={{ fontWeight: "bold", fontSize: "20px" }}>
              {duration_str}
            </p>
            <img
              src={arrowIcon}
              alt=""
              className="graph__arrow"
              style={{
                marginLeft: "50px",
              }}
              onClick={() => {
                setSelectedDate((prev) => {
                  return addWeeks(prev, 1);
                });
              }}
            />
          </FlexBox>
          <FlexBox width="100%" height="60%">
            <p style={{ fontWeight: "bold", color: "#ff9f47" }}>
              {year} {month_str}/{day_str} :
              <span style={{ fontSize: "26px" }}>
                {focusTime_hour}時間{focusTime_minute}分
              </span>
            </p>
          </FlexBox>
        </FlexBox>
      );
    } else {
      return null;
    }
  });

  //graphのtime-bar部分と、date部分はwidthを一致させなければいけないので共通のwidthを算出
  const width = 100 / renderItem.length + "%";

  //time-bar部分の最大値を決めるための変数群
  //6時間を越している集中時間がある場合は、その集中時間 + 2時間を最大値としてheightを算出する
  //ex)最大集中時間が3時間の場合は、time-barの最大heightは6時間分の60 * 6
  //最大集中時間が8時間の場合は、time-barの最大heightは(8 + 2) * 60
  const maxFocusTime = renderItem.reduce((prev, current) => {
    return Math.max(prev, current.focusTime);
  }, 0);
  const hasSixHoursFocusTime = maxFocusTime >= 360;
  const maxHeight = (Math.floor(maxFocusTime / 60) + 2) * 60;

  //実際にtime-barをレンダリングするmap
  //選択されている日付だった場合は--sub-colorに光る
  const renderedTimeBar = renderItem.map((item) => {
    const isSelected =
      selectedDate.getFullYear() === item.dateObj.getFullYear() &&
      selectedDate.getMonth() === item.dateObj.getMonth() &&
      selectedDate.getDate() === item.dateObj.getDate();
    const height = hasSixHoursFocusTime
      ? Math.max((item.focusTime / maxHeight) * 100, 0.2) + "%"
      : Math.max((item.focusTime / 360) * 100, 0.2) + "%";

    return (
      <FlexBox width={width} height="100%" bottom>
        <div
          className="graph__time-bar"
          key={item.date_str}
          onClick={() => {
            setSelectedDate(item.dateObj);
          }}
          style={
            isSelected
              ? { height: height, backgroundColor: "#ff9f47" }
              : { height: height }
          }
        ></div>
      </FlexBox>
    );
  });

  //下の日付欄をレンダリングするためのmap
  //選択されている日付だった場合は--sub-colorに光る
  const renderedStr = renderItem.map((item) => {
    const isSelected =
      selectedDate.getFullYear() === item.dateObj.getFullYear() &&
      selectedDate.getMonth() === item.dateObj.getMonth() &&
      selectedDate.getDate() === item.dateObj.getDate();
    return (
      <FlexBox width={width}>
        <p
          className="graph__date"
          key={item.date_str}
          onClick={() => {
            setSelectedDate(item.dateObj);
          }}
          style={isSelected ? { color: "#ff9f47" } : null}
        >
          {item.date_str}
        </p>
      </FlexBox>
    );
  });

  return (
    <FlexBox className="Graph" width="70%" height="100%">
      <FlexBox
        className="graph__render-mode-list"
        width="100%"
        height="40px"
        sb
      >
        <FlexBox width="33%">
          <p
            style={renderMode === "date" ? { color: "#ff9f47" } : null}
            onClick={() => {
              setRenderMode("date");
            }}
          >
            週
          </p>
        </FlexBox>
        <FlexBox width="33%">
          <p
            style={renderMode === "month" ? { color: "#ff9f47" } : null}
            onClick={() => {
              setRenderMode("month");
            }}
          >
            月
          </p>
        </FlexBox>
        <FlexBox width="33%">
          <p
            style={renderMode === "year" ? { color: "#ff9f47" } : null}
            onClick={() => {
              setRenderMode("year");
            }}
          >
            年
          </p>
        </FlexBox>
      </FlexBox>
      <FlexBox
        className="graph__selected-date-wrap"
        width="100%"
        height="15%"
        column
      >
        {renderedSelectedDate}
      </FlexBox>
      <FlexBox
        className="graph__time-wrap"
        width="100%"
        height="calc(85% - 80px)"
      >
        {renderedTimeBar}
      </FlexBox>
      <FlexBox className="graph__date-wrap" width="100%" height="40px">
        {renderedStr}
      </FlexBox>
    </FlexBox>
  );
};

export default Graph;
