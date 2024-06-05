import React, { forwardRef } from "react";

//Flexなwrapを提供する。
//columnはflex-direction
//left,right,top.bottomはtrueにすると指定した方向に要素が寄る
//sbはspace-between
//refも継承するためにforwardRefを採用
const FlexBox = forwardRef(
  (
    {
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
      pl = 0,
      pt = 0,
      pr = 0,
      pb = 0,
      sb = false,
      element = false,
      width = "auto",
      height = "auto",
      onClick = null,
      onKeyDown = null,
      onMouseOver = null,
      onMouseOut = null,
    },
    ref
  ) => {
    const style = column
      ? {
          display: "flex",
          justifyContent: top
            ? "flex-start"
            : bottom
            ? "flex-end"
            : sb
            ? "space-between"
            : "center",
          alignItems: right ? "flex-end" : left ? "flex-start" : "center",
          flexDirection: "column",
          width: width,
          height: height,
          margin: `${mt} ${mr} ${mb} ${ml}`,
          padding: `${pt} ${pr} ${pb} ${pl}`,
        }
      : {
          display: "flex",
          justifyContent: left
            ? "flex-start"
            : right
            ? "flex-end"
            : sb
            ? "space-between"
            : "center",
          alignItems: top ? "flex-start" : bottom ? "flex-end" : "center",
          flexDirection: "row",
          width: width,
          height: height,
          margin: `${mt} ${mr} ${mb} ${ml}`,
          padding: `${pt} ${pr} ${pb} ${pl}`,
        };

    if (element === "ul") {
      return (
        <ul
          style={style}
          className={className}
          onClick={onClick}
          onMouseOver={onMouseOver}
          onMouseOut={onMouseOut}
          onKeyDown={onKeyDown}
          ref={ref}
        >
          {children}
        </ul>
      );
    } else if (element === "li") {
      return (
        <li
          style={style}
          className={className}
          onClick={onClick}
          onMouseOver={onMouseOver}
          onMouseOut={onMouseOut}
          onKeyDown={onKeyDown}
          ref={ref}
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
          ref={ref}
        >
          {children}
        </div>
      );
    }
  }
);

export default FlexBox;
