import React, { forwardRef } from "react";
import "./sidebar.css";
import { FlexBox } from "@component";
import analysisIcon from "@images/analysis.svg";
import trackIcon from "@images/track.svg";

const Sidebar = forwardRef(({ whichMenuIsOpen, setWhichMenuIsOpen }, ref) => {
  //サイドバーのメニューをmapするための配列。menuNameはsetWhichMenuIsOpenを使用する際に使う。
  const menu__arr = [
    { text: "分析する", imgUrl: analysisIcon, menuName: "analysis" },
    { text: "足跡を見る", imgUrl: trackIcon, menuName: "track" },
  ];

  const addOpenClass = () => {
    ref.current.classList.add("open");
  };

  const removeOpenClass = () => {
    ref.current.classList.remove("open");
  };

  const renderMenu = menu__arr.map((item) => {
    const isSelected = whichMenuIsOpen === item.menuName;
    return (
      <FlexBox
        className={
          isSelected ? "sidebar-menu__item selected" : "sidebar-menu__item"
        }
        key={item.menuName}
        width="100%"
        left
        height="35px"
        onClick={() => setWhichMenuIsOpen(item.menuName)}
        onMouseOver={addOpenClass}
        pl="5px"
        mt="5px"
        mb="5px"
      >
        <img src={item.imgUrl} alt="" className="sidebar-menu-item__image" />
        <p className="sidebar-menu-item__text">{item.text}</p>
      </FlexBox>
    );
  });
  return (
    <FlexBox
      className="Sidebar"
      width="250px"
      height="600px"
      column
      left
      pd="10px 10px 10px 10px"
      top
      ref={ref}
      //fix : itemのmargin部分に触れるとなぜかremoveされてしまう
      onMouseOut={removeOpenClass}
    >
      <h2 className="sidebar__title">reviewメニュー</h2>
      {renderMenu}
    </FlexBox>
  );
});

export default Sidebar;
