const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const app = express();

const { pool } = require("./db");

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.use(express.json());

const authRouter = require("./routes/auth");
const explainRouter = require("./routes/explain");
const reviewRouter = require("./routes/review");
const workRouter = require("./routes/work");

app.use("/api/auth", authRouter);
app.use("/api/explain", explainRouter);
app.use("/api/review", reviewRouter);
app.use("/api/work", workRouter);

app.get("*", async (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.listen(8000, () => console.log("Server listening on port 8000"));
