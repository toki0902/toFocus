import React from "react";

//Flexなwrapを提供する。
//columnはflex-direction
//left,right,top.bottomはtrueにすると指定した方向に要素が寄る
//sbはspace-between
const FlexBox = ({
  className = null,
  children,
  column = false,
  left = false,
  right = false,
  top = false,
  bottom = false,
  ml = 0,
  mt = 0,
  mr = 0,
  mb = 0,
  sb = false,
  element = false,
  width = "auto",
  height = "auto",
  onClick = null,
  onKeyDown = null,
  onMouseOver = null,
  onMouseOut = null,
}) => {
  const style = column
    ? {
        display: "flex",
        justifyContent: top
          ? "left"
          : bottom
          ? "right"
          : sb
          ? "space-between"
          : "center",
        alignItems: right ? "end" : left ? "start" : "center",
        flexDirection: column ? "column" : "row",
        width: width,
        height: height,
        margin: `${mt} ${mr} ${mb} ${ml}`,
      }
    : {
        display: "flex",
        justifyContent: left
          ? "left"
          : right
          ? "right"
          : sb
          ? "space-between"
          : "center",
        alignItems: top ? "start" : bottom ? "end" : "center",
        flexDirection: column ? "column" : "row",
        width: width,
        height: height,
        margin: `${mt} ${mr} ${mb} ${ml}`,
      };
  if (element == "ul") {
    return (
      <ul
        style={style}
        className={className}
        onClick={onClick}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        onKeyDown={onKeyDown}
      >
        {children}
      </ul>
    );
  } else if (element == "li") {
    return (
      <li
        style={style}
        className={className}
        onClick={onClick}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        onKeyDown={onKeyDown}
      >
        {children}
      </li>
    );
  } else {
    return (
      <div
        style={style}
        className={className}
        onClick={onClick}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        onKeyDown={onKeyDown}
      >
        {children}
      </div>
    );
  }
};

export default FlexBox;
