import React from "react";

const MemoMask = ({ handleMouseMove, handleMouseUp, handleMouseOut }) => {
  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseOut={handleMouseOut}
      style={{
        width: "110%",
        height: "110%",
        position: "absolute",
        top: "50%",
        left: "50%",
        translate: "-50% -50%",
        opacity: 0.3,
        zIndex: -1,
      }}
    ></div>
  );
};

export default MemoMask;
