const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const dotenv = require("dotenv");
const passport = require("passport");
const hpp = require("hpp");
const helmet = require("helmet");
const engineAPIRouter = require("./routes/engine");

const prod = process.env.NODE_ENV === "production";
dotenv.config();
const app = express();

if (prod) {
  app.use(hpp());
  app.use(helmet());
  app.use(morgan("combined"));
  app.use(
    cors({
      // origin: /nexdashboard\.com$/,
      credentials: true
    })
  );
} else {
  app.use(morgan("dev"));
  app.use(
    cors({
      origin: true,
      credentials: true
    })
  );
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false
      // domain: prod && ".nexdashboard.com"
    },
    name: "rnbck"
  })
);

app.get("/", (req, res) => {
  res.send("running nex-dashboard backend sever");
});

app.use("/api/engine", engineAPIRouter);

app.listen(prod ? process.env.PORT : 3065, () => {
  console.log(`server is running on ${prod ? process.env.PORT : 3065}`);
});
