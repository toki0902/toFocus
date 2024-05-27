import React from "react";
import "./header.css";
import Button from "../button/Button";

const Header = () => {
  const login = false;
  return (
    <div className="header">
      <h1 className="header__title">
        <a href="#" className="header__title-link">
          {/* todo: 本当はtoFocusのロゴが入る */}
          logo
        </a>
      </h1>
      {login ? (
        <></>
      ) : (
        <div style={{ display: "flex" }}>
          <Button color={"#333"} isWhiteMain>
            会員登録
          </Button>
          <Button color={"#333"} isWhiteMain>
            ログイン
          </Button>
        </div>
      )}
    </div>
  );
};

export default Header;
