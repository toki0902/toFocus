import React, { useState } from "react";
import "./authenticate.css";
import { FlexBox, Button } from "@component";
const Authenticate = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div className="Authenticate">
      <FlexBox
        className="auth__email-box"
        width="450px"
        height="550px"
        top
        column
        mr="50px"
        pd="50px 20px 50px 20px"
      >
        <h2 className="auth-email__title">email認証</h2>
        <FlexBox
          className="auth-email__item"
          width="75%"
          height="45px"
          mt="70px"
          bottom
        >
          <input
            type="text"
            className="auth-email__input"
            id="email"
            value={email}
            onChange={(e) => onChangeEmail(e)}
          />
          <label
            className="auth-email__label"
            htmlFor="email"
            style={
              email
                ? {
                    bottom: "45px",
                    left: "5px",
                    color: "#ff9f47",
                    fontSize: "14px",
                  }
                : null
            }
          >
            email
          </label>
        </FlexBox>
        <FlexBox
          className="auth-email__item"
          width="75%"
          height="45px"
          mt="70px"
          bottom
        >
          <input
            type="password"
            className="auth-email__input"
            id="pass"
            value={password}
            onChange={(e) => onChangePassword(e)}
          />
          <label
            className="auth-email__label"
            htmlFor="pass"
            style={
              password
                ? {
                    bottom: "45px",
                    left: "5px",
                    color: "#ff9f47",
                    fontSize: "14px",
                  }
                : null
            }
          >
            password
          </label>
          <p className="auth-email__forget-msg">パスワードを忘れた</p>
        </FlexBox>
        <Button
          className="auth-email__btn"
          color={password && email ? "#ff9f47" : "#c1bdbd"}
          isWhiteMain
          mt="90px"
          width="150px"
        >
          認証する
        </Button>
      </FlexBox>
      <FlexBox
        className="auth__sns-box"
        ml="50px"
        width="450px"
        height="550px"
      ></FlexBox>
    </div>
  );
};

export default Authenticate;
