import { eachDayOfInterval } from "date-fns";

//HH:MM形式の時間の差分を「分」で返してくれる関数
export const timeDifference = (start, end) => {
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

export const toPadStart = (text) => {
  return String(text).padStart(2, "0");
};

//指定した日付のデータをフィルタリングしてくれる関数。
export const searchDataWithThisDay = (thisDay, sampleData) => {
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
//もしかしたら、月単位の検索ならオプションを付けてみた方が速いかも？？
export const searchDataWithThisDuration = (start, end, sampleData) => {
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
