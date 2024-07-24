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
const userRouter = require("./routes/user");
const cocnDataRouter = require("./routes/concData");

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/concData", cocnDataRouter);

app.get("*", async (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.listen(8000, () => console.log("Server listening on port 8000"));
