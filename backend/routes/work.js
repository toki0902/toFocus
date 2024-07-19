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
          console.error("database error", err);
          return res.status(500).json({ msg: err });
        }
      }
    );
    console.log("register complete");
    return res.status(200).json({ msg: "register the data" });
  } else {
    console.log("not enough time to work");
    return res.status(400).json({ msg: "not enough time to work" });
  }
});

module.exports = router;
