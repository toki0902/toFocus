import React, { useState } from "react";
import "./button.css";

//このコンポーネントはwidth,height,func,color,isWhiteMainを受けとり、buttonを提供する。
//width, heightは要素の幅と高さ
//funcはクリック時に実行される関数
//colorはボタン自体の色
//isWhiteMainはボタンの色が白を基調としているかどうか。
const Button = ({
  width = 120,
  maxWidth = null,
  height = 40,
  maxHeight = null,
  func = false,
  type = null,
  children,
  color = "#333",
  isWhiteMain = false,
  mr = 0,
  ml = 0,
  mt = 0,
  mb = 0,
}) => {
  const [isHover, setIsHover] = useState(false);
  const mouseOver = () => {
    setIsHover(true);
  };
  const mouseOut = () => {
    setIsHover(false);
  };

  const border_str = `1px solid ${color}`;
  const style = isWhiteMain
    ? {
        width: width,
        maxWidth: maxWidth,
        height: height,
        maxHeight: maxHeight,
        backgroundColor: isHover ? color : "#fff",
        border: border_str,
        color: isHover ? "#fff" : color,
        margin: `${mt} ${mr} ${mb} ${ml}`,
      }
    : {
        width: width,
        maxWidth: maxWidth,
        height: height,
        maxHeight: maxHeight,
        backgroundColor: isHover ? "#fff" : color,
        border: border_str,
        color: isHover ? color : "#fff",
        margin: `${mt} ${mr} ${mb} ${ml}`,
      };

  return (
    <button
      className="button"
      type={type}
      style={style}
      onClick={func || null}
      onMouseOver={mouseOver}
      onMouseOut={mouseOut}
    >
      {children}
    </button>
  );
};

export default Button;
