const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  console.log("auth");
});

module.exports = router;
