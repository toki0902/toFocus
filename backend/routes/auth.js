const express = require("express");
const router = express.Router();
require("dotenv").config();
const passport = require("passport");
const { pool } = require("../db");

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

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

        const newId = pool.query(
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
        console.log("データベースにユーザ情報を登録しました。");
        const id = newId[0];
        const user = { id: id, name: newName, iconPath: newIconPath };
        return cb(null, user);
      }
    }
  )
);

module.exports = router;
