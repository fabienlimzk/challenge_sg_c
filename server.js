const express = require("express");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const server = express();
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("./config/passportConfig");
const checkUser = require("./config/loginBlocker");
require("dotenv").config();

/* 
===================
Connect to MongoDB 
*/
mongoose.connect(
  process.env.MONGODBURL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  () => {
    console.log("MongoDB connected!");
  }
);

server.use(express.static("public")); // look for static files in public folder
server.use(express.urlencoded({ extended: true })); // collects form data
server.set("view engine", "ejs"); // view engine setup
server.use(expressLayouts);

/*-- These must be place in the correct place */
server.use(
  session({
    secret: process.env.SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 360000 }
  })
);
//-- passport initialization
server.use(passport.initialize());
server.use(passport.session());
server.use(flash());

server.use(function(req, res, next) {
  // before every route, attach the flash messages and current user to res.locals
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

server.get("/", (req, res) => {
  res.redirect("/dashboard");
});

// all routes
server.use(require("./routes/auth.route"));
server.use("/senior", require("./routes/senior.route"));
server.use("/helper", require("./routes/helper.route"));

// connect to PORT
server.listen(process.env.PORT, () =>
  console.log(`connected to express on ${process.env.PORT}`)
);