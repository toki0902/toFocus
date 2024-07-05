const express = require("express");
const router = express.Router();

router.get("/getProfile", (req, res) => {
  if (req.isAuthenticated()) {
    console.log("get PROFILE");
    res.status(200).json(req.user);
  } else {
    console.log("not found profile");
    res.status(204).send();
  }
});

module.exports = router;
