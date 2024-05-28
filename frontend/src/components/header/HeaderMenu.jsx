import React from "react";
import FlexBox from "../flexbox/FlexBox";
import userIcon from "@images/react.svg";

const HeaderMenu = ({ isMenuOpen }) => {
  return (
    //todo:headerのメニューに何を入れるか考える
    <nav
      className="header__menu"
      style={{
        //fix:なぜかメニュー出現時にかくついてしまうので改善したい
        top: isMenuOpen ? "100%" : "90%",
        opacity: isMenuOpen ? 1 : 0,
        zIndex: isMenuOpen ? 10 : -10,
      }}
    >
      <FlexBox column width="100%" height="100%" top>
        <FlexBox className={"header-menu__userinfo"} width="100%" left>
          <img src={userIcon} alt="" className="header__user-icon" />
          <h2 className="header-menu__username">庄野時</h2>
        </FlexBox>
      </FlexBox>
    </nav>
  );
};

export default HeaderMenu;
