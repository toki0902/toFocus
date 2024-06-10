import React from "react";
import { FlexBox } from "@component";

const Card = ({ icon, title, explain }) => {
  return (
    <FlexBox
      className="explain__card"
      element="li"
      column
      sb
      width="250px"
      height="100%"
      mr="40px"
      pl="20px"
      pt="20px"
      pr="20px"
      pb="20px"
    >
      <img src={icon} alt="" />
      <h2 style={{ fontWeight: "bold", fontSize: "20px" }}>{title}</h2>
      <p style={{ width: "fit-content", fontSize: "14px" }}>{explain}</p>
    </FlexBox>
  );
};

export default Card;
