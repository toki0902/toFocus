import React, { useEffect } from "react";
import FlexBox from "../flexbox/FlexBox";
import userIcon from "@images/react.svg";
import { useNavigate } from "react-router-dom";
import homeIcon from "@images/home.svg";
import graphIcon from "@images/graph main-color.svg";
import focusIcon from "@images/focus.png";
import loginIcon from "@images/user.svg";
import logoutIcon from "@images/logout.svg";

const HeaderMenu = ({ login, setLogin, isMenuOpen }) => {
  const navigate = useNavigate();

  const header_menuItems = [
    {
      text: "ホームに戻る",
      imgUrl: homeIcon,
      onClick: () => {
        navigate("/");
      },
    },
    {
      text: "振り返る",
      imgUrl: graphIcon,
      onClick: () => {
        navigate("/review");
      },
    },
    {
      text: "集中する",
      imgUrl: focusIcon,
      onClick: () => {
        navigate("/work");
      },
    },
    !login && {
      text: "ログインする",
      imgUrl: loginIcon,
      onClick: () => {
        navigate("/auth");
      },
    },
  ].filter(Boolean);

  const header_menuItems_rendered = header_menuItems.map((item) => {
    return (
      <FlexBox
        className="header-menu__item"
        width="100%"
        height="30px"
        left
        onClick={item.onClick}
        pl="10px"
        pr="10px"
        mt="10px"
        mb="10px"
      >
        <img src={item.imgUrl} alt="" className="header-menu-item__image" />
        <p className="header-menu-item__text">{item.text}</p>
      </FlexBox>
    );
  });

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
        {login ? (
          <FlexBox
            className="header-menu__userinfo"
            width="100%"
            pt="10px"
            pb="10px"
            left
          >
            <img src={userIcon} alt="" className="header__user-icon" />
            <h2 className="header-menu__username">庄野時</h2>
            <FlexBox
              className="header-menu__item"
              width="100%"
              height="30px"
              left
              onClick={() => setLogin(false)}
              pl="10px"
              pr="10px"
              mt="10px"
            >
              <img
                src={logoutIcon}
                alt=""
                className="header-menu-item__image"
              />
              <p className="header-menu-item__text">ログアウトする</p>
            </FlexBox>
          </FlexBox>
        ) : null}
        {header_menuItems_rendered}
      </FlexBox>
    </nav>
  );
};

export default HeaderMenu;
