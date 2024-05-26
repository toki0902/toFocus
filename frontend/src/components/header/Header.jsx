import React from "react";
import "./header.css";
import Button from "../button/Button";

const Header = () => {
  const login = false;
  const goLog = () => {
    console.log("レッツゴー");
  };
  return (
    <div className="header">
      <h1 className="header__title">
        <a href="#" className="header__title-link">
          {/* todo: 本当はtoFocusのロゴが入る */}
          logo
        </a>
      </h1>
      <Button color={"#333"}>会員登録</Button>
    </div>
  );
};

export default Header;
