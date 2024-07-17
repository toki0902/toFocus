const express = require("express");
const router = express.Router();
require("dotenv").config();
const passport = require("passport");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { pool } = require("../db");

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(`セッションの破壊に失敗しました。:${err}`);
      return res.status(500).end();
    }
    console.log("logout and destroy session");
    return res.redirect("/");
  });
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env["GOOGLE_MAIL"],
    pass: process.env["GOOGLE_PASS"],
  },
});

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

//registerにアクセスすると、仮のデータをuserテーブルに作成し、
//それらを認証する用のメールをクライアントに送信する。
router.post("/local/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!(name && email && password)) {
    console.log("Information is missing");
    return res.status(400).json({
      msg: "必要なデータが足りていません。もう一度サインアップをやり直してください",
    });
  }

  //データベースに同じメールアドレスが登録されていないかを確かめる
  const sameEmailAddress = await pool.query(
    "SELECT COUNT(*) AS num FROM user WHERE email = :email",
    { email: email }
  );

  //同じメアドが登録されていた場合エラーを返す
  console.log(sameEmailAddress);
  if (sameEmailAddress[0][0].num !== 0) {
    console.log("this email is registered in the past");
    return res.status(404).json({
      msg: "既に登録されているメールアドレスです。別のメールアドレスをご用意いただき、もう一度サインアップをやり直してください。",
    });
  }

  //16バイトのランダムな文字列をtokenとして作成
  //tokenの期限を1時間に設定
  const token = crypto.randomBytes(16).toString("hex");
  const tokenExpires = new Date(Date.now() + 360000);

  //pepperを先頭にpasswordをハッシュ化
  const pepper = process.env["PEPPER"];
  const hashedPassword = await bcrypt.hash(pepper + password, 8);

  await pool.query(
    "INSERT INTO user (name, email, password, icon_path, isVerified, verificationToken, tokenExpires) VALUES (:name, :email, :password, 'examplepath', false, :token, :expires)",
    {
      name: name,
      email: email,
      password: hashedPassword,
      token: token,
      expires: tokenExpires,
    },
    (err) => {
      if (err) {
        return res.status(500).json({ msg: `database error : ${err}` });
      }
    }
  );
  console.log("register new user");

  const verificationURL = `http://localhost:8000/api/auth/local/verify?token=${token}`;
  const mailOption = {
    from: process.env["GOOGLE_MAIL"],
    to: email,
    subject: "toConc : メールアドレスの認証",
    text: `以下のリンクをクリックしてメールアドレスを認証してください: ${verificationURL}`,
  };

  transporter.sendMail(mailOption, (err, info) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        msg: "認証メールの送信に失敗しました。もう一度サインアップをやり直してください",
      });
    }
    return res.status(200).json({
      msg: "認証用メールを送信しました。案内に従いアカウント作成を完了させてください",
    });
  });
});

//GETメソッドなのに、DBを更新するから安全性が、、っく、、
router.get("/local/verify", async (req, res) => {
  const { token } = req.query;

  if (token) {
    const now = Date.now();
    const targetData = await pool.query(
      "SELECT * FROM user WHERE verificationToken = :token AND tokenExpires > :now AND isVerified = false",
      { token: token, now: now }
    );
    if (targetData[0].length === 0) {
      console.log("not found user");
      return res
        .status(404)
        .send(
          "該当するデータが存在しないか、アクセストークンが無効です。もう一度サインアップをやり直してください"
        );
    } else {
      const data = targetData[0][0];
      await pool.query(
        "UPDATE user SET isVerified = true, verificationToken = null, tokenExpires = null WHERE id = :userId",
        { userId: data.id }
      );
      console.log("create new user");
      return res.status(201).redirect("/auth");
    }
  } else {
    console.log("Access token does not exist");
    return res
      .status(400)
      .send("このリクエストにはアクセストークンが含まれていません");
  }
});

//新しくパスワードを設定する用のapi
router.post("/local/newpass", async (req, res) => {
  //emailが含まれていなかったら返す
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ msg: "メールアドレスが含まれていません" });
  }

  //ここのtry文はdatabaseのエラーのみをキャッチするようにしたい
  //pool.queryに不具合の応急処置
  try {
    const targetData = await pool.query(
      //isVerifiedがtrueなのは正式なユーザのみ
      //正式なユーザはaccesstokenもnullになっているため、それをパスワード更新のために利用する
      "SELECT id FROM user WHERE email = :email AND isVerified = true",
      { email: email }
    );

    if (targetData[0].length !== 0) {
      const { id } = targetData[0][0];

      //16バイトのランダムな文字列をtokenとして作成
      //tokenの期限を1時間に設定
      const token = crypto.randomBytes(16).toString("hex");
      const tokenExpires = new Date(Date.now() + 360000);

      await pool.query(
        //上記の通り正式なユーザのtokenはパスワード更新用
        "UPDATE user SET verificationToken = :token, tokenExpires = :expires WHERE id = :id AND isVerified = true",
        {
          id: id,
          token: token,
          expires: tokenExpires,
        }
      );

      const verificationURL = `http://localhost:8000/api/auth/local/newpass/verify?token=${token}`;
      const mailOption = {
        from: process.env["GOOGLE_MAIL"],
        to: email,
        subject: "toConc : 新しいパスワードの設定",
        text: `以下のリンクをクリックして新しいパスワードを設定してください: ${verificationURL}`,
      };

      transporter.sendMail(mailOption, (err, info) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            msg: "パスワード更新メールの送信に失敗しました。もう一度パスワード更新をやり直してください",
          });
        }
        return res.status(200).json({
          msg: "パスワード更新メールを送信しました。案内に従いパスワードの更新を完了させてください",
        });
      });
    } else {
      console.log("user not found");
      return res.status(404).json({
        msg: "このメールアドレスは登録されていません。新規登録をお願いします。",
      });
    }
  } catch (err) {
    console.log(`database error ${err}`);
    return res.status(500).json({
      msg: "データベースでエラーが発生しました。もう一度お試しください。",
    });
  }
});

router.get("/local/newpass/verify", async (req, res) => {
  const { token } = req.query;

  if (token) {
    const now = Date.now();
    const targetData = await pool.query(
      "SELECT * FROM user WHERE verificationToken = :token AND tokenExpires > :now AND isVerified = true",
      { token: token, now: now }
    );
    if (targetData[0].length === 0) {
      console.log("not found user");
      return res
        .status(404)
        .send(
          "該当するデータが存在しないか、アクセストークンが無効です。もう一度パスワード設定をやり直してください"
        );
    } else {
      console.log("create new user");
      return res.status(201).redirect("/auth");
    }
  } else {
    console.log("Access token does not exist");
    return res
      .status(400)
      .send("このリクエストにはアクセストークンが含まれていません");
  }
});

const LocalStrategy = require("passport-local");
router.post(
  "/local",
  passport.authenticate("local", {
    failureRedirect: "local/failure",
    successRedirect: "local/success",
  })
);

router.get("/local/success", (req, res) => {
  console.log("成功");
  return res.status(200).json({ msg: "認証に成功しました。" });
});
router.get("/local/failure", (req, res) => {
  return res
    .status(404)
    .json({ msg: "メールアドレスまたはパスワードが違います。" });
});

passport.use(
  new LocalStrategy(
    { usernameField: "username", passwordField: "password" },
    async (username, password, cb) => {
      try {
        const targetData = await pool.query(
          "SELECT * FROM user WHERE email = :email AND isVerified = true",
          {
            email: username,
          },
          (err) => {
            if (err) {
              throw err;
            }
          }
        );

        if (targetData[0].length === 0) {
          console.log("user not found");
          cb(null, false);
        } else {
          const pepper = process.env["PEPPER"];
          const correctPassword = targetData[0][0].password;
          const isMatch = await bcrypt.compare(
            pepper + password,
            correctPassword
          );
          if (isMatch) {
            console.log("user found");
            cb(null, targetData[0][0]);
          } else {
            console.log("incorrect password");
            cb(null, false);
          }
        }
      } catch (err) {
        console.log(`database error : ${err}`);
        cb(err);
      }
    }
  )
);

const GoogleStrategy = require("passport-google-oauth20");
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
  }),
  (req, res) => {
    res.status(200).redirect("/");
  }
);

passport.use(
  //こっち側はユーザが最初にクリックしたときに実行される。
  new GoogleStrategy(
    {
      clientID: process.env["GOOGLE_CLIENT_ID"],
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
      callbackURL: "http://localhost:8000/api/auth/google/callback",
    },
    //こちらのコールバック関数はユーザが認証を完了した後、再度authenticateを実行したときに実行される。
    async (accessToken, refreshToken, profile, cb) => {
      const [resultRow] = await pool.query(
        "SELECT * FROM user WHERE social_id = :social_id",
        { social_id: profile.id },
        (err) => {
          if (err) {
            return cb(err);
          }
        }
      );
      if (resultRow.length > 0) {
        const user = {
          id: resultRow[0].id,
          name: resultRow[0].name,
          iconPath: resultRow[0].icon_path,
        };
        return cb(null, user);
      } else {
        const newSocialId = profile.id;
        const newName = profile.displayName;
        const newIconPath = profile.photos[0].value;
        pool.query(
          "INSERT INTO user (name, social_id, icon_path) VALUES (:name, :id, :icon)",
          { name: newName, id: newSocialId, icon: newIconPath },
          (err) => {
            if (err) {
              return cb(err);
            }
          }
        );

        const newId = await pool.query(
          "SELECT id FROM user WHERE social_id = :id",
          {
            id: newSocialId,
          },
          (err) => {
            if (err) {
              return cb(err);
            }
          }
        );
        console.log("register new user");
        const id = newId[0];
        const user = { id: id, name: newName, iconPath: newIconPath };
        return cb(null, user);
      }
    }
  )
);

const LineStrategy = require("passport-line");
router.get("/line", passport.authenticate("line"));
router.get(
  "/line/callback",
  passport.authenticate("line", {
    failureRedirect: "/auth",
  }),
  (req, res) => {
    res.status(200).redirect("/");
  }
);
passport.use(
  //こっち側はユーザが最初にクリックしたときに実行される。
  new LineStrategy(
    {
      channelID: process.env["LINE_CLIENT_ID"],
      channelSecret: process.env["LINE_CLIENT_SECRET"],
      callbackURL: "http://localhost:8000/api/auth/line/callback",
    },
    //こちらのコールバック関数はユーザが認証を完了した後、再度authenticateを実行したときに実行される。
    async (accessToken, refreshToken, profile, cb) => {
      const [resultRow] = await pool.query(
        "SELECT * FROM user WHERE social_id = :social_id",
        { social_id: profile.id },
        (err) => {
          if (err) {
            return cb(err);
          }
        }
      );
      if (resultRow.length > 0) {
        const user = {
          id: resultRow[0].id,
          name: resultRow[0].name,
          iconPath: resultRow[0].icon_path,
        };
        return cb(null, user);
      } else {
        console.log(profile);
        const newSocialId = profile.id;
        const newName = profile.displayName;
        const newIconPath = profile.pictureUrl;
        await pool.query(
          "INSERT INTO user (name, social_id, icon_path) VALUES (:name, :id, :icon)",
          { name: newName, id: newSocialId, icon: newIconPath },
          (err) => {
            if (err) {
              return cb(err);
            }
          }
        );

        const newId = await pool.query(
          "SELECT id FROM user WHERE social_id = :id",
          {
            id: newSocialId,
          },
          (err) => {
            if (err) {
              return cb(err);
            }
          }
        );
        console.log("register new user");
        const id = newId[0];
        const user = { id: id, name: newName, iconPath: newIconPath };
        return cb(null, user);
      }
    }
  )
);

const GitHubStrategy = require("passport-github2");
router.get("/github", passport.authenticate("github"));
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/auth",
  }),
  (req, res) => {
    res.status(200).redirect("/");
  }
);
passport.use(
  //こっち側はユーザが最初にクリックしたときに実行される。
  new GitHubStrategy(
    {
      clientID: process.env["GITHUB_CLIENT_ID"],
      clientSecret: process.env["GITHUB_CLIENT_SECRET"],
      callbackURL: "http://localhost:8000/api/auth/github/callback",
    },
    //こちらのコールバック関数はユーザが認証を完了した後、再度authenticateを実行したときに実行される。
    async (accessToken, refreshToken, profile, cb) => {
      const [resultRow] = await pool.query(
        "SELECT * FROM user WHERE social_id = :social_id",
        { social_id: profile.id },
        (err) => {
          if (err) {
            return cb(err);
          }
        }
      );
      if (resultRow.length > 0) {
        const user = {
          id: resultRow[0].id,
          name: resultRow[0].name,
          iconPath: resultRow[0].icon_path,
        };
        return cb(null, user);
      } else {
        console.log(profile);
        const newSocialId = profile.id;
        const newName = profile.username;
        const newIconPath = profile.photos[0].value;
        await pool.query(
          "INSERT INTO user (name, social_id, icon_path) VALUES (:name, :id, :icon)",
          { name: newName, id: newSocialId, icon: newIconPath },
          (err) => {
            if (err) {
              return cb(err);
            }
          }
        );

        const newId = await pool.query(
          "SELECT id FROM user WHERE social_id = :id",
          {
            id: newSocialId,
          },
          (err) => {
            if (err) {
              return cb(err);
            }
          }
        );
        console.log("register new user");
        const id = newId[0];
        const user = { id: id, name: newName, iconPath: newIconPath };
        return cb(null, user);
      }
    }
  )
);

module.exports = router;
