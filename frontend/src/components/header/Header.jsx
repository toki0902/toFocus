import React, { useState } from "react";
import "./header.css";
import { Button, FlexBox } from "@component";
//このiconはデモです
import userIcon from "@images/react.svg";
import HeaderMenu from "./HeaderMenu";

const Header = () => {
  const login = false;
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const openMenu = () => {
    setIsOpenMenu(true);
  };
  const closeMenu = () => {
    setIsOpenMenu(false);
  };
  if (login) {
    return (
      <div className="header">
        <h1 className="header__title">
          <a href="#" className="header__title-link">
            {/* todo: 本当はtoFocusのロゴが入る */}
            logo
          </a>
        </h1>
        <FlexBox
          height="100%"
          className="header__info-wrap"
          onMouseOver={openMenu}
          onMouseOut={closeMenu}
        >
          <FlexBox width="100%" height="100%">
            <img src={userIcon} alt="" className="header__user-icon" />
            <p className="header__user-info">demoでログイン中</p>
          </FlexBox>
          <HeaderMenu isMenuOpen={isOpenMenu} />
        </FlexBox>
      </div>
    );
  } else {
    return (
      <div className="header">
        <h1 className="header__title">
          <a href="#" className="header__title-link">
            {/* todo: 本当はtoFocusのロゴが入る */}
            logo
          </a>
        </h1>
        <FlexBox>
          <Button color={"rgb(255, 159, 71)"} isWhiteMain mr="10px">
            会員登録
          </Button>
          <Button color={"rgb(255, 159, 71)"} isWhiteMain>
            ログイン
          </Button>
        </FlexBox>
      </div>
    );
  }
};

export default Header;
