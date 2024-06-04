import React, { useState } from "react";
import "./memo.css";
import { useInteract } from "../../hooks/useInteract";
import { FlexBox } from "@component";
import removeIcon from "@images/cross.svg";

const Memo = ({ myKey, removeThisTool }) => {
  const interact_ = useInteract();

  return (
    <FlexBox className="Memo" width="200px" height="200px" ref={interact_.ref}>
      <img
        onClick={() => {
          removeThisTool(myKey);
        }}
        className="memo__remove-icon"
        src={removeIcon}
        alt="remove"
      />
    </FlexBox>
  );
};

export default Memo;
