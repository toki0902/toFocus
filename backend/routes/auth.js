const express = require("express");
const router = express.Router();
require("dotenv").config();
const passport = require("passport");
const bcrypt = require("bcrypt");
const { pool } = require("../db");

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(`セッションの破壊に失敗しました。:${err}`);
      return res.status(500).end();
    }
    console.log("ログアウトします");
    return res.redirect("/");
  });
});

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

const LocalStrategy = require("passport-local");
router.post(
  "/local",
  passport.authenticate("local", { failureRedirect: "local/failure" })
);

router.get("/local/failure", (req, res) => {
  res.status(404).json({ msg: "メールアドレスかパスワードが違います。" });
});

passport.use(
  new LocalStrategy(
    { usernameField: "username", passwordField: "password" },
    async (username, password, cb) => {
      try {
        const targetData = await pool.query(
          "SELECT * FROM user WHERE email = :email",
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
