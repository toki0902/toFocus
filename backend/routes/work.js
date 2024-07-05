const express = require("express");
const router = express.Router();

const { pool } = require("../db");

router.post("/registerFocusData", async (req, res) => {
  if (req.body.start != req.body.end) {
    await pool.query(
      "INSERT INTO focustime (start, end, user_id) VALUES (:start, :end, :userid)",
      { start: req.body.start, end: req.body.end, userid: req.body.id },
      //FIX :: 何でか知らんけど個々の関数が実行できなくてエラーハンドリングがうまくいかん
      (err, row) => {
        if (err) {
          console.error("データベースエラー", err);
          return res.status(500).json({ msg: err });
        }
      }
    );
    console.log("データベースに集中時間を登録しました。");
    return res.status(200).json({ msg: "こちらにリクエストは届いています。" });
  } else {
    console.log("作業時間が短すぎます");
    res.status(400).json({ msg: "作業時間が短すぎます" });
  }
});

module.exports = router;
