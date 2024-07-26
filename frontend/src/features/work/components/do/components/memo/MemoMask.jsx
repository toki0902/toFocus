import React from "react";

const MemoMask = ({ handleMouseMove, handleMouseUp }) => {
  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: "#fff",
        opacity: 0.3,
        zIndex: -1,
      }}
    ></div>
  );
};

export default MemoMask;
