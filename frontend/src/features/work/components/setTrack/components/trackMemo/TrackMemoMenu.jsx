import React, { useMemo } from "react";
import { FlexBox } from "@component";
import "./trackMemo.css";
import triangleIcon from "@images/triangle.svg";
import h1Icon from "@images/h1Icon.svg";
import h2Icon from "@images/h2Icon.svg";
import textIcon from "@images/textIcon.svg";
import listIcon from "@images/listIcon.svg";
const TrackMemoMenu = ({
  applyFont,
  applyElement,
  currentState,
  isOpenMemoMenu,
  isOpenChoiseElementMenu,
  setIsOpenChoiseElementMenu,
  whichMemoMenuIsOpen,
}) => {
  const currentElement = useMemo(() => {
    if (currentState.includes("h1")) {
      return "見出し1";
    } else if (currentState.includes("h2")) {
      return "見出し2";
    } else if (currentState.includes("list")) {
      return "リスト";
    } else {
      return "テキスト";
    }
  }, [currentState]);

  const elements_info_arr = [
    {
      imgUrl: textIcon,
      title: "テキスト",
      text: "テキストを表示します。",
      onClick: () => {
        applyElement("paragraph");
        setIsOpenChoiseElementMenu(false);
      },
    },
    {
      imgUrl: h1Icon,
      title: "見出し1",
      text: "大きめの見出しを表示します。",
      onClick: () => {
        applyElement("h1");
        setIsOpenChoiseElementMenu(false);
      },
    },
    {
      imgUrl: h2Icon,
      title: "見出し2",
      text: "中くらいの見出しを表示します。",
      onClick: () => {
        applyElement("h2");
        setIsOpenChoiseElementMenu(false);
      },
    },
    {
      imgUrl: listIcon,
      title: "リスト",
      text: "リストを表示します。",
      onClick: () => {
        applyElement("list");
        setIsOpenChoiseElementMenu(false);
      },
    },
  ];

  //elementMenuのアイテムをmapで回したもの。
  const element_listItems = elements_info_arr.map((item) => {
    return (
      <FlexBox
        className="track-element-menu__item"
        width="100%"
        height="80px"
        element="li"
        left
        pr="10px"
        pl="10px"
        onClick={item.onClick}
        key={item.title}
      >
        <img className="track-element-menu__image" src={item.imgUrl} alt="" />
        <FlexBox
          className="track-element-menu__text-box"
          height="50%"
          column
          left
          sb
        >
          <h2 className="track-element-menu__item-title">{item.title}</h2>
          <p className="track-element-menu__text">{item.text}</p>
        </FlexBox>
      </FlexBox>
    );
  });

  //leafMenu内で使うブロック要素変更Menuのアイテムをmapで回したもの。
  const leaf_choiseElement_menu_elements = elements_info_arr.map((item) => {
    return (
      <FlexBox
        className="trackmemo-sub-menu__item"
        width="100%"
        height="40px"
        pr="5px"
        pl="5px"
        left
        onClick={item.onClick}
      >
        <img className="trackmemo-sub-menu__image" src={item.imgUrl} alt="" />
        <h2 className="trackmemo-sub-menu__title">{item.title}</h2>
      </FlexBox>
    );
  });

  //whichMemoMenuIsOpenの値によってvalueを変更するための変数
  const value =
    whichMemoMenuIsOpen === "element" ? (
      <FlexBox
        width="380px"
        height="300px"
        className={
          isOpenMemoMenu
            ? "trackmemo__element-menu open"
            : "trackmemo__element-menu"
        }
        element="ul"
        pt="10px"
        pb="10px"
        pl="15px"
        pr="15px"
        top
        ul
      >
        {element_listItems}
      </FlexBox>
    ) : (
      <FlexBox
        className={isOpenMemoMenu ? "trackmemo__menu open" : "trackmemo__menu"}
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
            className="trackmemo-menu__element-tool"
            onClick={() => setIsOpenChoiseElementMenu(true)}
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
          {isOpenChoiseElementMenu ? (
            <>
              <FlexBox
                className="trackmemo-sub-menu"
                width="200px"
                height="300px"
                pr="8px"
                pl="8px"
                pt="8px"
                pb="8px"
                top
                column
                left
              >
                <p style={{ color: "#8c8c8c" }}>ブロック要素の変換</p>
                {leaf_choiseElement_menu_elements}
              </FlexBox>
            </>
          ) : null}
          <FlexBox
            mr="10px"
            pr="10px"
            pl="10px"
            height="80%"
            className="trackmemo-menu__element-tool"
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
            className="trackmemo-menu__tool-item"
            onClick={(event) => applyFont(event, "bold")}
            style={currentState.includes("bold") ? { opacity: 1 } : null}
          >
            B
          </strong>
          <em
            className="trackmemo-menu__tool-item"
            onClick={(event) => applyFont(event, "italic")}
            style={currentState.includes("italic") ? { opacity: 1 } : null}
          >
            I
          </em>
          <u
            className="trackmemo-menu__tool-item"
            onClick={(event) => applyFont(event, "underline")}
            style={currentState.includes("underline") ? { opacity: 1 } : null}
          >
            U
          </u>
        </FlexBox>
      </FlexBox>
    );

  return value;
};

export default TrackMemoMenu;
