const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  console.log("explain");
});

module.exports = router;
