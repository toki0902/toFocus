import React from "react";
import "./header.css";

const Header = () => {
  return (
    <div className="header">
      <h1 className="header__title">
        <a href="#" className="header__title-link">
          {/* todo: 本当はtoFocusのロゴが入る */}
          logo
        </a>
      </h1>
    </div>
  );
};

export default Header;
