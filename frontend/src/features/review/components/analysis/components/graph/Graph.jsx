import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./graph.css";
import { FlexBox } from "@component";
import arrowIcon from "@images/arrow.svg";
import {
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  subMonths,
} from "date-fns";

const Graph = ({
  searchDataWithThisDay,
  searchDataWithThisDuration,
  selectedDate,
  setSelectedDate,
  renderMode,
  setRenderMode,
}) => {
  //renderItemはgraph内で表示される一つの要素を配列で管理する。
  const [renderItem, setRenderItem] = useState([
    //{ date_str: "06/24", focusTime: 168 }データはこんな感じ
  ]);

  //renderItemを更新するための関数
  //criterionを基準にrenderModeにあったItemに更新する。
  const updateItem = useCallback(
    (criterion) => {
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
          //月の前半だったら1月から6月を、後半だったら6月から12月を取得する
          let pastHarfYear = [];
          const isFirstHarf = criterion.getMonth() < 6;
          //過去6ヵ月の日付を獲得

          const firstDayOfFirstHarfYear = startOfYear(criterion);
          const firstDayOfLastHarfYear = addMonths(firstDayOfFirstHarfYear, 6);
          for (let i = 0; i < 6; i++) {
            if (isFirstHarf) {
              pastHarfYear.push(addMonths(firstDayOfFirstHarfYear, i));
            } else {
              pastHarfYear.push(addMonths(firstDayOfLastHarfYear, i));
            }
          }

          //それらの配列に対して、最初と最後を獲得
          const newArray = pastHarfYear.map((item) => {
            const firstDayOfMonth = startOfMonth(item);
            const endDayOfMonth = endOfMonth(item);

            //該当するデータを獲得し、focus_timeを算出

            const focusDataOfTheMonth = searchDataWithThisDuration(
              firstDayOfMonth,
              endDayOfMonth
            );

            const date_str = `${firstDayOfMonth.getFullYear()}/${
              firstDayOfMonth.getMonth() + 1
            }月`;

            const focus_Time = focusDataOfTheMonth[0]
              ? focusDataOfTheMonth.reduce((prev, current) => {
                  const sum_time = current.focusTime.reduce((prev, current) => {
                    return prev + timeDifference(current.start, current.end);
                  }, 0);

                  return prev + sum_time;
                }, 0)
              : 0;

            return {
              date_str: date_str,
              focusTime: focus_Time,
              dateObj: firstDayOfMonth,
            };
          });

          setRenderItem(newArray);
          break;
        }
        case "year": {
          break;
        }
      }
    },
    [renderMode]
  );

  const today = new Date();

  useEffect(() => {
    updateItem(selectedDate);
  }, [selectedDate, renderMode]);

  //選択されている日付とその日に集中した時間をレンダリングするためのmap
  const renderedSelectedDate = renderItem.map((item) => {
    if (renderMode === "date") {
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
    } else if (renderMode === "month") {
      const year = item.dateObj.getFullYear();
      const month = item.dateObj.getMonth();
      const day = item.dateObj.getDate();

      const lastDayOfMonth = endOfMonth(item.dateObj);

      const isSelected =
        selectedDate.getFullYear() === year &&
        selectedDate.getMonth() === month;

      if (isSelected) {
        const isFirstHarf = item.dateObj.getMonth() < 6;
        const firstDayOfHarfYear = isFirstHarf
          ? startOfYear(item.dateObj)
          : addMonths(startOfYear(item.dateObj), 6);
        const lastDayOfHarfYear = isFirstHarf
          ? subDays(addMonths(startOfYear(item.dateObj), 6), 1)
          : endOfYear(item.dateObj);

        const month_firstDay = String(
          firstDayOfHarfYear.getMonth() + 1
        ).padStart(2, "0");
        const day_firstDay = String(firstDayOfHarfYear.getDate()).padStart(
          2,
          "0"
        );
        const month_lastDay = String(lastDayOfHarfYear.getMonth() + 1).padStart(
          2,
          "0"
        );
        const day_lastDay = String(lastDayOfHarfYear.getDate()).padStart(
          2,
          "0"
        );

        const duration_str = `${firstDayOfHarfYear.getFullYear()} ${month_firstDay}/${day_firstDay} ~ ${lastDayOfHarfYear.getFullYear()} ${month_lastDay}/${day_lastDay}`;
        const month_str = String(month + 1).padStart(2, "0");
        const day_str = String(day).padStart(2, "0");
        const selected_duration_str = `${year} ${month_str}/${day_str} ~ ${year} ${month_str}/${lastDayOfMonth.getDate()}`;

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
                    return subMonths(prev, 6);
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
                    return addMonths(prev, 6);
                  });
                }}
              />
            </FlexBox>
            <FlexBox width="100%" height="60%">
              <p style={{ fontWeight: "bold", color: "#ff9f47" }}>
                {selected_duration_str} :
                <span style={{ fontSize: "26px" }}>
                  {focusTime_hour}時間{focusTime_minute}分
                </span>
              </p>
            </FlexBox>
          </FlexBox>
        );
      }
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
  const maxHeight_forDateMode = (Math.floor(maxFocusTime / 60) + 2) * 60;

  const has120HoursFocusTime = maxFocusTime >= 7200;
  const maxHeight_forMonthMode = (Math.floor(maxFocusTime / 60) + 10) * 60;

  //実際にtime-barをレンダリングするmap
  //選択されている日付だった場合は--sub-colorに光る
  const renderedTimeBar = renderItem.map((item) => {
    if (renderMode === "date") {
      const isSelected =
        selectedDate.getFullYear() === item.dateObj.getFullYear() &&
        selectedDate.getMonth() === item.dateObj.getMonth() &&
        selectedDate.getDate() === item.dateObj.getDate();
      const height = hasSixHoursFocusTime
        ? Math.max((item.focusTime / maxHeight_forDateMode) * 100, 0.2) + "%"
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
    } else if (renderMode === "month") {
      const isSelected =
        selectedDate.getFullYear() === item.dateObj.getFullYear() &&
        selectedDate.getMonth() === item.dateObj.getMonth();

      const height = has120HoursFocusTime
        ? Math.max((item.focusTime / maxHeight_forMonthMode) * 100, 0.2) + "%"
        : Math.max((item.focusTime / 7200) * 100, 0.2) + "%";
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
    }
  });

  const renderedTimeBarScale = Array.from({ length: 5 }, (_, index) => index)
    .reverse()
    .map((reverseIndex) => {
      if (renderMode === "date") {
        const hour = hasSixHoursFocusTime
          ? Math.round(
              (maxHeight_forDateMode / 60 / 5) * (reverseIndex + 1) * 10
            ) / 10
          : Math.round((6 / 5) * (reverseIndex + 1) * 10) / 10;
        return (
          <FlexBox
            className="graph-scale__item"
            key={reverseIndex}
            width="100%"
            height="20%"
            top
            right
          >
            <p>{hour} -</p>
          </FlexBox>
        );
      } else if (renderMode === "month") {
        const hour = has120HoursFocusTime
          ? Math.round(
              (maxHeight_forMonthMode / 60 / 5) * (reverseIndex + 1) * 10
            ) / 10
          : Math.round((120 / 5) * (reverseIndex + 1) * 10) / 10;
        return (
          <FlexBox
            className="graph-scale__item"
            key={reverseIndex}
            width="100%"
            height="20%"
            top
            right
          >
            <p>{hour} -</p>
          </FlexBox>
        );
      }
      return null; // この場合、nullを返してレンダリングしない
    });

  //下の日付欄をレンダリングするためのmap
  //選択されている日付だった場合は--sub-colorに光る
  const renderedStr = renderItem.map((item) => {
    if (renderMode === "date") {
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
    } else if (renderMode === "month") {
      const isSelected =
        selectedDate.getFullYear() === item.dateObj.getFullYear() &&
        selectedDate.getMonth() === item.dateObj.getMonth();
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
    }
  });

  return (
    <>
      <FlexBox className="Graph" width="70%" height="100%">
        <FlexBox
          className="graph__render-mode-list"
          width="100%"
          height="40px"
          sb
        >
          <FlexBox width="49%">
            <p
              style={renderMode === "date" ? { color: "#ff9f47" } : null}
              onClick={() => {
                setSelectedDate(today);
                setRenderMode("date");
              }}
            >
              週
            </p>
          </FlexBox>
          <FlexBox width="49%">
            <p
              style={renderMode === "month" ? { color: "#ff9f47" } : null}
              onClick={() => {
                setSelectedDate(today);
                setRenderMode("month");
              }}
            >
              月
            </p>
          </FlexBox>
          {/* <FlexBox width="33%">
          <p
            style={renderMode === "year" ? { color: "#ff9f47" } : null}
            onClick={() => {
              setRenderMode("year");
            }}
          >
            年
          </p>
        </FlexBox> */}
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
          <FlexBox
            className="graph__scale"
            width="100%"
            height="100%"
            top
            right
          >
            {renderedTimeBarScale}
          </FlexBox>
        </FlexBox>
        <FlexBox className="graph__date-wrap" width="100%" height="40px">
          {renderedStr}
        </FlexBox>
      </FlexBox>
    </>
  );
};

export default Graph;
