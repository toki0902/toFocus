import React, { useState } from "react";
import "./authenticate.css";
import { FlexBox, Button } from "@component";
import instaIcon from "@images/instaIcon.svg";
import XIcon from "@images/XIcon.svg";
import lineIcon from "@images/lineIcon.svg";
import githubIcon from "@images/githubIcon.svg";
import googleIcon from "@images/googleIcon.svg";
import { useNavigate } from "react-router-dom";

const Authenticate = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  //SNSログインボタンについての情報を管理する配列
  const sns_arr = [
    {
      name: "google",
      iconUrl: googleIcon,
      className: "auth-sns__item auth-sns__google",
      onClick: () => {
        window.open("http://localhost:8000/api/auth/google");
      },
    },
    {
      name: "Line",
      iconUrl: lineIcon,
      className: "auth-sns__item auth-sns__line",
      onClick: () => {
        window.open("http://localhost:8000/api/auth/line");
      },
    },
    // {
    //   name: "X",
    //   iconUrl: XIcon,
    //   className: "auth-sns__item auth-sns__x",
    //   onClick: () => {
    //     window.open("http://localhost:8000/api/auth/X");
    //   },
    // },
    // {
    //   name: "Instagram",
    //   iconUrl: instaIcon,
    //   className: "auth-sns__item auth-sns__instagram",
    //   onClick: () => {
    //     window.open("http://localhost:8000/api/auth/instagram");
    //   },
    // },
    {
      name: "github",
      iconUrl: githubIcon,
      className: "auth-sns__item auth-sns__github",
      onClick: () => {
        window.open("http://localhost:8000/api/auth/github");
      },
    },
  ];

  //SNSのログインボタンをレンダリングする用のmap
  const rendered_sns_arr = sns_arr.map((item) => {
    return (
      <FlexBox
        key={item.name}
        className={item.className}
        width="90%"
        height="55px"
        left
        pd="0 10px 0 10px"
        mb="10px"
        mt="10px"
        onClick={item.onClick}
      >
        <FlexBox width="40px" height="40px" left>
          <img src={item.iconUrl} alt="icon" className="auth-sns-item__icon" />
        </FlexBox>
        <p>{item.name}でログインする</p>
      </FlexBox>
    );
  });

  //引数にMode, そのモードに使用する情報を取る
  //ex)mode: email, userInfo: example@gmail.comみたいな
  const login_withThisMode = async () => {
    const reqData_JSON = JSON.stringify({
      username: email,
      password: password,
    });
    const res = await fetch(`http://localhost:8000/api/auth/local`, {
      method: "POST",
      body: reqData_JSON,
      headers: { "Content-Type": "application/json" },
    });
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
        <p className="auth__back-home" onClick={() => navigate("/")}>
          ←ホームへ戻る
        </p>
        <h2 className="auth__title">email認証</h2>
        <FlexBox
          className="auth-email__item"
          width="75%"
          height="45px"
          mt="70px"
          bottom
        >
          <input
            type="text"
            name="username"
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
            name="password"
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
          func={password && email ? login_withThisMode : null}
        >
          認証する
        </Button>
      </FlexBox>
      <FlexBox
        className="auth__sns-box"
        width="450px"
        height="550px"
        top
        column
        mr="50px"
        pd="50px 20px 50px 20px"
      >
        <h2 className="auth__title" style={{ height: "15%" }}>
          SNS認証
        </h2>
        <FlexBox className="auth-sns__btn-box" width="100%" height="85%" column>
          {rendered_sns_arr}
        </FlexBox>
      </FlexBox>
    </div>
  );
};

export default Authenticate;
