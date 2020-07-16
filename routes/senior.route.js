const router = require("express").Router();
const isLoggedIn = require("../config/loginBlocker");
const User = require("../models/user.model");
const List = require("../models/list.model");
const moment = require("moment");

router.get("/create", isLoggedIn, (req, res) => {
  res.render("senior/create");
});

router.post("/create", (req, res) => {
  //   console.log(req.body);
  let finalData = {
    items: req.body.items,
    createdBy: req.user._id, // select the current user login
    deliveryDate: moment().add(5, "days"),
  }

  if (req.user.isSenior) {
    let list = new List(finalData);
    console.log(list);
    list.save()
    .then(() => {
      User.findByIdAndUpdate(req.user._id, {
        $push: { list: list._id }
      })
      .then(() => {
        req.flash("success", "List created!");
        res.redirect("/dashboard");
      });
    });
  } else if (req.user.isHelper) {
    req.flash("error", "You cannot perform this action!");
    res.redirect("/dashboard");
  }
});

router.post("/update/:id", (req, res) => {
  if(req.user.isHelper) {
    List.findById(req.params.id).then(list => {
      if(list.status == "fulfilled") {
        req.flash("error", "Completed liao!");
        return res.redirect("/dashboard");
      }

      if(list.status == "free") {
        list.status = "inProgress";
      } else if(list.status == "inProgress") {
        list.status = "fulfilled";
      }
      list.completedBy = req.user._id;

      list.save()
      .then(() => {
        req.flash("success", "Thank you for your help!");
        res.redirect("/dashboard");
      });
    });
  } else if(req.user.isSenior) {
    req.flash("error", "You cannot perform this action!");
    res.redirect("/dashboard");
  }
});

module.exports = router;