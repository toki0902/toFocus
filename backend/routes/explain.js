const express = require("express");
const router = express.Router();

router.get("/getProfile", (req, res) => {
  if (req.isAuthenticated()) {
    console.log("get PROFILE");
    res.json(req.user);
  } else {
    res.json({ msg: "unLogin" });
  }
});

module.exports = router;
