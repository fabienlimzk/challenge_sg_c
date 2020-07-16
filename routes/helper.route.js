const router = require("express").Router();
const passport = require("../config/passportConfig");
const isLoggedIn = require("../config/loginBlocker");
const User = require("../models/user.model");
const List = require("../models/list.model");
const moment = require("moment");

router.get("/profile", isLoggedIn, (req, res) => {
  if (req.user.isSenior) {
    req.flash("error", "You are not allowed to view this page!");
    res.redirect("/");
  } else {
    List.find({ completedBy: req.user._id })
    .then((lists) => {
      res.render("dashboard/index", { lists });
    });
  }
});

module.exports = router;