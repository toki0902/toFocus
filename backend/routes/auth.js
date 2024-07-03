const express = require("express");
const router = express.Router();
const passport = require("passport");
const { pool } = require("../db");

const GoogleStrategy = require("passport-google-oidc");

router.get("/google", passport.authenticate("google"));

module.exports = router;
