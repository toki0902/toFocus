import React, { useState } from "react";
import "./alertMenu.css";
import { FlexBox, Button } from "@component";
import { useNavigate } from "react-router-dom";

const AlertMenu = ({ whichAlertMenuIsOpen, closeAlertMenu }) => {
  const [isStart, setIsStart] = useState(false);
  const close = () => {
    setIsStart(true);
    setTimeout(closeAlertMenu, 300);
  };

  const navigate = useNavigate();

  let title;
  let value;

  switch (whichAlertMenuIsOpen) {
    case "toBreak": {
      title = "何分くらい休憩しますか？";
      value = (
        <FlexBox width="100%" height="80%">
          <Button width="200px" height="60px" mr="30px" color="#333">
            3分
          </Button>
          <Button width="200px" height="60px" mr="30px" color="#333">
            5分
          </Button>
          <Button width="200px" height="60px">
            10分
          </Button>
        </FlexBox>
      );
      break;
    }
    case "toHome": {
      title = "本当にホームに戻りますか？";
      value = (
        <FlexBox width="100%" height="80%">
          <Button width="200px" height="60px" mr="30px" color="#333">
            いいえ
          </Button>
          <Button
            width="200px"
            height="60px"
            mr="30px"
            color="#333"
            func={() => {
              navigate("/");
            }}
          >
            はい
          </Button>
        </FlexBox>
      );
    }
  }

  return (
    <FlexBox
      className={isStart ? "AlertMenu close" : "AlertMenu"}
      width="60%"
      height="60%"
      column
      top
      pt="5%"
      pr="5%"
      pb="5%"
      pl="5%"
    >
      <h1 className="alertmenu__title">{title}</h1>
      <div className="alertmenu__close-btn" onClick={close} />
      {value}
    </FlexBox>
  );
};

export default AlertMenu;
