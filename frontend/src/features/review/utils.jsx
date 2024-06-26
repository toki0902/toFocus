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
