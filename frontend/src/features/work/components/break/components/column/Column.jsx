import React, { useEffect, useState } from "react";
import { FlexBox } from "@component";
import "./column.css";

const Column = () => {
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // 0 から i までのランダムなインデックスを生成
      [array[i], array[j]] = [array[j], array[i]]; // 要素を交換する
    }
    return array;
  }
  const initialColums = [
    "あああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ",
    "いいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいいい",
    "ううううううううううううううううううううううううううううううううううううううううううううううううううううううううううううううううううううううううううううううううう",
    "ええええええええええええええええええええええええええええええええええええeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeえええええええええええええええええええええええええええええええええええええええええええeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええええ",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [colums, setColums] = useState([]);

  const [effectStart, setEffectStart] = useState(false);

  useEffect(() => {
    setColums(() => shuffleArray(initialColums));
    const timer = setInterval(() => {
      setEffectStart(true);
      setTimeout(() => {
        setCurrentIndex((prev) => {
          if (prev === initialColums.length - 1) {
            return 0;
          } else {
            return prev + 1;
          }
        });
        setEffectStart(false);
      }, 1000);
    }, 60000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <FlexBox
      className="Column"
      width="80%"
      height="250px"
      pt="20px"
      pl="20px"
      pb="20px"
      pr="20px"
      top
      left
      sb
    >
      <h2 className="column__title">column</h2>
      <p className={effectStart ? "column__text fade-out" : "column__text"}>
        {colums[currentIndex]}
      </p>
    </FlexBox>
  );
};

export default Column;
