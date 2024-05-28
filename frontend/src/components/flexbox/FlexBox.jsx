import React from "react";

//
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
  onClick = false,
  onMouseOver = false,
  onMouseOut = false,
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
        margin: `${mt}px ${mr}px ${mb}px ${ml}px`,
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
        margin: `${mt}px ${mr}px ${mb}px ${ml}px`,
      };
  if (element == "ul") {
    return (
      <ul
        style={style}
        className={className}
        onClick={onClick || null}
        onMouseOver={onMouseOver || null}
        onMouseOut={onMouseOut || null}
      >
        {children}
      </ul>
    );
  } else if (element == "li") {
    return (
      <li
        style={style}
        className={className}
        onClick={onClick || null}
        onMouseOver={onMouseOver || null}
        onMouseOut={onMouseOut || null}
      >
        {children}
      </li>
    );
  } else {
    return (
      <div
        style={style}
        className={className}
        onClick={onClick || null}
        onMouseOver={onMouseOver || null}
        onMouseOut={onMouseOut || null}
      >
        {children}
      </div>
    );
  }
};

export default FlexBox;
