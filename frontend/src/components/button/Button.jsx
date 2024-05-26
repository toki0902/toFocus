import React, { useState } from "react";
import "./button.css";

//このコンポーネントはwidth,height,func,color,isWhiteMainを受けとり、buttonを提供する。
//width, heightは要素の幅と高さ
//funcはクリック時に実行される関数
//colorはボタン自体の色
//isWhiteMainはボタンの色が白を基調としているかどうか。
const Button = ({
  width = 120,
  height = 40,
  func = false,
  children,
  color,
  isWhiteMain = false,
}) => {
  const [isHover, setIsHover] = useState(false);
  const mouseOver = () => {
    setIsHover(true);
  };
  const mouseOut = () => {
    setIsHover(false);
  };

  const border_str = `1px solid ${color}`;

  if (isWhiteMain) {
    return (
      <button
        className="button"
        style={{
          width: width,
          height: height,
          backgroundColor: isHover ? color : "#fff",
          border: border_str,
          color: isHover ? "#fff" : color,
        }}
        onClick={func ? func : null}
        onMouseOver={mouseOver}
        onMouseOut={mouseOut}
      >
        {children}
      </button>
    );
  } else {
    return (
      <button
        className="button"
        style={{
          width: width,
          height: height,
          backgroundColor: isHover ? "#fff" : color,
          border: border_str,
          color: isHover ? color : "#fff",
        }}
        onClick={func ? func : null}
        onMouseOver={mouseOver}
        onMouseOut={mouseOut}
      >
        {children}
      </button>
    );
  }
};

export default Button;
