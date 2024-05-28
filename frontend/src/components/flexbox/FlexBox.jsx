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
  ml = false,
  mt = false,
  mr = false,
  mb = false,
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
        marginLeft: ml,
        marginTop: mt,
        marginRight: mr,
        marginBottom: mb,
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
        marginLeft: ml,
        marginTop: mt,
        marginRight: mr,
        marginBottom: mb,
      };
  if (element == "ul") {
    return (
      <ul
        style={style}
        className={className}
        onClick={onClick ? onClick : null}
        onMouseOver={onMouseOver ? onMouseOver : null}
        onMouseOut={onMouseOut ? onMouseOut : null}
      >
        {children}
      </ul>
    );
  } else if (element == "li") {
    return (
      <li
        style={style}
        className={className}
        onClick={onClick ? onClick : null}
        onMouseOver={onMouseOver ? onMouseOver : null}
        onMouseOut={onMouseOut ? onMouseOut : null}
      >
        {children}
      </li>
    );
  } else {
    return (
      <div
        style={style}
        className={className}
        onClick={onClick ? onClick : null}
        onMouseOver={onMouseOver ? onMouseOver : null}
        onMouseOut={onMouseOut ? onMouseOut : null}
      >
        {children}
      </div>
    );
  }
};

export default FlexBox;
