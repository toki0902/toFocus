import React, { useState } from "react";
import "./header.css";
import { Button, FlexBox } from "@component";
//このiconはデモです
import userIcon from "@images/react.svg";
import HeaderMenu from "./HeaderMenu";
import { useNavigate } from "react-router-dom";

const Header = ({ userProfile, setUserProfile }) => {
  const navigate = useNavigate();
  const [login, setLogin] = useState(true);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const openMenu = () => {
    setIsOpenMenu(true);
  };
  const closeMenu = () => {
    setIsOpenMenu(false);
  };
  if (userProfile) {
    return (
      <div className="header">
        <h1 className="header__title" onClick={() => navigate("/")}>
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
            <img
              src={userProfile.icon_path}
              alt=""
              className="header__user-icon"
            />
            <p className="header__user-info">{userProfile.name}でログイン中</p>
          </FlexBox>
          <HeaderMenu
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            isMenuOpen={isOpenMenu}
          />
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
          <Button
            color={"rgb(255, 159, 71)"}
            isWhiteMain
            func={() => navigate("/auth")}
            width="200px"
          >
            ログイン / サインアップ
          </Button>
        </FlexBox>
      </div>
    );
  }
};

export default Header;
