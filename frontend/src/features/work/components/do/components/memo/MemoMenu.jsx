import React, { useMemo } from "react";
import { FlexBox } from "@component";
import "./memo.css";
import lockIcon from "@images/lock.svg";
import unlockIcon from "@images/unlock.svg";
import triangleIcon from "@images/triangle.svg";

const MemoMenu = ({
  isInteract,
  applyFont,
  applyElement,
  currentState,
  isOpenMemoMenu,
  toggleInteract,
  whichMemoMenuIsOpen,
}) => {
  console.log(applyElement);
  const currentElement = useMemo(() => {
    switch (currentState) {
      case currentState.includes("h1"):
        return "見出し1";

      case currentState.includes("h2"):
        return "見出し2";

      case currentState.includes("list"):
        return "リスト";
      default:
        return "テキスト";
    }
  }, [currentState]);

  const elements_info_arr = [
    {
      imgUrl: "",
      title: "テキスト",
      text: "テキストを表示します。",
      onClick: () => applyElement("paragraph"),
    },
    {
      imgUrl: "",
      title: "見出し1",
      text: "大きめの見出しを表示します。",
      onClick: () => applyElement("h1"),
    },
    {
      imgUrl: "",
      title: "見出し2",
      text: "中くらいの見出しを表示します。",
      onClick: () => applyElement("h2"),
    },
    {
      imgUrl: "",
      title: "リスト",
      text: "リストを表示します。",
      onClick: () => applyElement("list"),
    },
  ];
  const element_listItems = elements_info_arr.map((item) => {
    return (
      <FlexBox
        className="element-menu__item"
        width="100%"
        height="80px"
        element="li"
        left
        pr="10px"
        pl="10px"
        onClick={item.onClick}
      >
        <img className="element-menu__image" src={item.imgUrl} alt="" />
        <FlexBox className="element-menu__text-box" height="50%" column left sb>
          <h2 className="element-menu__item-title">{item.title}</h2>
          <p className="element-menu__text">{item.text}</p>
        </FlexBox>
      </FlexBox>
    );
  });

  const value =
    whichMemoMenuIsOpen === "element" ? (
      <FlexBox
        width="380px"
        height="400px"
        className={
          isOpenMemoMenu ? "memo__element-menu open" : "memo__element-menu"
        }
        element="ul"
        pt="10px"
        pb="10px"
        pl="15px"
        pr="15px"
        top
      >
        {element_listItems}
      </FlexBox>
    ) : (
      <FlexBox
        className={isOpenMemoMenu ? "memo__menu open" : "memo__menu"}
        width="600px"
        height="40px"
        pl="15px"
        pr="15px"
        sb
      >
        <FlexBox height="100%">
          <FlexBox
            mr="10px"
            pr="10px"
            pl="10px"
            height="80%"
            className="memo-menu__element-tool"
          >
            <p style={{ marginRight: "5px" }}>{currentElement}</p>
            <img
              src={triangleIcon}
              alt=""
              style={{
                width: "10px",
                height: "10px",
                transform: "rotate(180deg)",
              }}
            />
          </FlexBox>
          <FlexBox
            mr="10px"
            pr="10px"
            pl="10px"
            height="80%"
            className="memo-menu__element-tool"
          >
            <p style={{ paddingRight: "5px" }}>リンク</p>
            <img
              src={triangleIcon}
              alt=""
              style={{
                width: "10px",
                height: "10px",
                transform: "rotate(180deg)",
              }}
            />
          </FlexBox>
        </FlexBox>
        <FlexBox>
          <strong
            className="memo-menu__tool-item"
            onClick={(event) => applyFont(event, "bold")}
            style={currentState.includes("bold") ? { opacity: 1 } : null}
          >
            B
          </strong>
          <em
            className="memo-menu__tool-item"
            onClick={(event) => applyFont(event, "italic")}
            style={currentState.includes("italic") ? { opacity: 1 } : null}
          >
            I
          </em>
          <u
            className="memo-menu__tool-item"
            onClick={(event) => applyFont(event, "underline")}
            style={currentState.includes("underline") ? { opacity: 1 } : null}
          >
            U
          </u>
          <div
            className="memo-menu__tool-item"
            onClick={toggleInteract}
            style={isInteract ? null : { opacity: 1 }}
          >
            <img
              src={isInteract ? unlockIcon : lockIcon}
              alt={isInteract ? "unlock" : "lock"}
            />
          </div>
        </FlexBox>
      </FlexBox>
    );

  return value;
};

export default MemoMenu;
