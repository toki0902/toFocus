import React, { useState } from "react";
import "./authCards.css";
import { FlexBox, Button } from "@component";
import ResInfo from "../resInfo/ResInfo";
import instaIcon from "@images/instaIcon.svg";
import XIcon from "@images/XIcon.svg";
import lineIcon from "@images/lineIcon.svg";
import githubIcon from "@images/githubIcon.svg";
import googleIcon from "@images/googleIcon.svg";
import { useNavigate } from "react-router-dom";

const AuthCards = ({ setWhichPageIsOpen }) => {
  const [isForgetPassword, setIsForgetPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSignup, setIsSignup] = useState(false);
  const [signup_email, setSignup_email] = useState("");
  const [signup_username, setSignup_username] = useState("");
  const [signup_password, setSignup_password] = useState("");

  const [forgetPassword__email, setForgetPassword_email] = useState("");
  const [forgetPassword__newpass, setForgetPassword_newpass] = useState("");

  const navigate = useNavigate();

  const backToSns = () => {
    setIsSignup(false);
    setSignup_email("");
    setSignup_username("");
    setSignup_password("");
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

    const jsonRes = await res.json();

    if (res.ok) {
      console.log(jsonRes.msg);
      navigate("/");
    } else {
      console.error(jsonRes.msg);
      setIsSignup(true);
    }
  };

  const signup = async () => {
    const reqData_JSON = JSON.stringify({
      name: signup_username,
      password: signup_password,
      email: signup_email,
    });

    const res = await fetch("http://localhost:8000/api/auth/local/register", {
      method: "POST",
      body: reqData_JSON,
      headers: { "Content-Type": "application/json" },
    });

    const jsonRes = await res.json();

    if (res.ok) {
      console.log(jsonRes.msg);
      setWhichPageIsOpen(
        <ResInfo headline="仮登録完了" descript={jsonRes.msg}></ResInfo>
      );
    } else {
      console.error(jsonRes.msg);
      setWhichPageIsOpen(
        <ResInfo headline="仮登録失敗" descript={jsonRes.msg}></ResInfo>
      );
    }
  };

  const sendUpdateMail = async () => {
    const reqData_JSON = JSON.stringify({
      email: forgetPassword__email,
      password: forgetPassword__newpass,
    });
    const res = await fetch("http://localhost:8000/api/auth/local/newpass", {
      method: "POST",
      headers: { "Content-Type": "Application/json" },
      body: reqData_JSON,
    });

    const jsonRes = await res.json();

    if (res.status === 200) {
      setWhichPageIsOpen(
        <ResInfo
          headline="パスワードの更新を受理しました"
          descript={jsonRes.msg}
        />
      );
    } else if (res.status === 404) {
      setWhichPageIsOpen(
        <ResInfo
          headline="ユーザが見つかりませんでした"
          descript={jsonRes.msg}
        />
      );
    } else {
      setWhichPageIsOpen(
        <ResInfo headline="サーバーエラー" descript={jsonRes.msg} />
      );
    }
  };

  return (
    <div className="AuthCards">
      <FlexBox
        className="auth__email-box"
        width="450px"
        height="550px"
        mr="50px"
      >
        <p className="auth__back-home" onClick={() => navigate("/")}>
          ←ホームへ戻る
        </p>
        {/* front側がユーザに見える方になる 
　      今回の場合はisSignupのbool値で決まる
        */}
        <FlexBox
          className={isForgetPassword ? "back" : "front"}
          width="100%"
          height="100%"
          pd="50px 20px 50px 20px"
          top
          column
        >
          <h2 className="auth__title" style={{ height: "15%" }}>
            email認証
          </h2>
          <FlexBox
            className="auth-email__item"
            width="75%"
            height="45px"
            mt="40px"
            bottom
          >
            <input
              type="text"
              name="username"
              className="auth-email__input"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            mt="40px"
            bottom
          >
            <input
              type="password"
              name="password"
              className="auth-email__input"
              id="pass"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            <p
              className="auth-email__forget-msg"
              onClick={() => setIsForgetPassword(true)}
            >
              パスワードを忘れた
            </p>
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
          className={isForgetPassword ? "front mainColor" : "back"}
          width="100%"
          height="100%"
          pd="50px 20px 50px 20px"
          top
          column
        >
          <h2 className="auth__title">
            登録したメールアドレスと
            <br />
            パスワードを入力してください
          </h2>
          <FlexBox
            className="auth-email__item"
            width="75%"
            height="45px"
            mt="40px"
            bottom
          >
            <input
              type="text"
              name="forgetPassword__email"
              className="auth-email__input"
              id="forgetPassword__email"
              value={forgetPassword__email}
              onChange={(e) => setForgetPassword_email(e.target.value)}
            />
            <label
              className="auth-email__label"
              htmlFor="forgetPassword__email"
              style={
                forgetPassword__email
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
            mt="40px"
            bottom
          >
            <input
              type="text"
              name="forgetPassword__newpass"
              className="auth-email__input"
              id="forgetPassword__newpass"
              value={forgetPassword__newpass}
              onChange={(e) => setForgetPassword_newpass(e.target.value)}
            />
            <label
              className="auth-email__label"
              htmlFor="forgetPassword__newpass"
              style={
                forgetPassword__newpass
                  ? {
                      bottom: "45px",
                      left: "5px",
                      color: "#ff9f47",
                      fontSize: "14px",
                    }
                  : null
              }
            >
              newpassword
            </label>
          </FlexBox>
          <Button
            className="auth-email__btn"
            color={forgetPassword__email ? "#8ddaeb" : "#c1bdbd"}
            isWhiteMain
            mt="90px"
            width="150px"
            func={forgetPassword__email ? sendUpdateMail : null}
          >
            更新申請
          </Button>
          <p
            className="auth__reverse-btn mainColor"
            onClick={() => {
              setIsForgetPassword(false);
              setForgetPassword_email("");
              setForgetPassword_newpass("");
            }}
          >
            ←email認証に戻る
          </p>
        </FlexBox>
      </FlexBox>

      <FlexBox className="auth__sns-box" width="450px" height="550px" mr="50px">
        <FlexBox
          className={isSignup ? "front mainColor" : "back"}
          width="100%"
          height="100%"
          top
          column
          pd="50px 20px 50px 20px"
        >
          <h2 className="auth__title" style={{ height: "15%" }}>
            新規登録
          </h2>
          <FlexBox
            className="auth-email__item"
            width="75%"
            height="45px"
            mt="40px"
            bottom
          >
            <input
              type="text"
              name="signup_name"
              className="auth-email__input"
              id="signup_name"
              value={signup_username}
              onChange={(e) => setSignup_username(e.target.value)}
            />
            <label
              className="auth-email__label"
              htmlFor="signup_name"
              style={
                signup_username
                  ? {
                      bottom: "45px",
                      left: "5px",
                      color: "#ff9f47",
                      fontSize: "14px",
                    }
                  : null
              }
            >
              username
            </label>
          </FlexBox>
          <FlexBox
            className="auth-email__item"
            width="75%"
            height="45px"
            mt="40px"
            bottom
          >
            <input
              type="text"
              name="signup_email"
              className="auth-email__input"
              id="signup_email"
              value={signup_email}
              onChange={(e) => setSignup_email(e.target.value)}
            />
            <label
              className="auth-email__label"
              htmlFor="signup_email"
              style={
                signup_email
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
            mt="40px"
            bottom
          >
            <input
              type="text"
              name="signup_password"
              className="auth-email__input"
              id="signup_password"
              value={signup_password}
              onChange={(e) => setSignup_password(e.target.value)}
            />
            <label
              className="auth-email__label"
              htmlFor="signup_password"
              style={
                signup_password
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
          </FlexBox>
          <Button
            className="auth-email__btn"
            color={
              signup_email && signup_password && signup_username
                ? "#ff9f47"
                : "#c1bdbd"
            }
            isWhiteMain
            mt="90px"
            width="150px"
            func={
              signup_email && signup_password && signup_username ? signup : null
            }
          >
            新規登録
          </Button>
          <p className="auth__reverse-btn mainColor" onClick={backToSns}>
            ←SNS認証に戻る
          </p>
        </FlexBox>

        <FlexBox
          className={isSignup ? "back" : "front"}
          width="100%"
          height="100%"
          top
          column
          pd="50px 20px 50px 20px"
        >
          <h2 className="auth__title" style={{ height: "15%" }}>
            SNS認証
          </h2>
          <FlexBox
            className="auth-sns__btn-box"
            width="100%"
            height="85%"
            column
          >
            {rendered_sns_arr}
          </FlexBox>
          <p className="auth__reverse-btn" onClick={() => setIsSignup(true)}>
            ←新規登録
          </p>
        </FlexBox>
      </FlexBox>
    </div>
  );
};

export default AuthCards;
