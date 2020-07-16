const router = require("express").Router();
const User = require("../models/user.model");
const List = require("../models/list.model");
const passport = require("../config/passportConfig");
const isLoggedIn = require("../config/loginBlocker");

router.get("/auth/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/auth/signup", async (req, res) => {
  console.log(req.body);
  try {
    let { firstname, lastname, age, phone, password, role } = req.body;
    
    let user = new User({
      firstname, 
      lastname,
      age,
      address: {
        houseNo: req.body.houseNo, 
        street: req.body.street, 
        city: req.body.city, 
        district: req.body.district,
      },
      phone,
      password,
    });

    if (role == "helper") {
      user.isHelper = true;
    } else if (role == "senior") {
      user.isSenior = true;
    }

    let savedUser = await user.save();

    if (savedUser) {
      passport.authenticate("local", {
        successRedirect: "/dashboard", //after login success
        successFlash: "You have logged In!"
      })(req, res);
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/auth/signin", (req, res) => {
  res.render("auth/signin");
});

router.get("/dashboard", isLoggedIn, (request, response) => {
  if (request.user.isSenior) {
    //get current users list only
    User.findById(request.user._id, "list")
      .populate("list")
      .then((user) => {
        console.log(user);
        let lists = user.list; //populated list in user model
        response.render("dashboard/index", { lists });
      });
  } else if (request.user.isHelper) {
    List.find({ status: "free" }).then(lists => {
      response.render("dashboard/index", { lists });
    });
  }
  // else if (request.user.isHelper) {
  //   List.find({ status: "inProgress" }).then(lists => {
  //     response.render("dashboard/index", { lists });
  //   });
  // }
});

//-- Login Route
router.post("/auth/signin",
  passport.authenticate("local", {
    successRedirect: "/dashboard", //after login success
    failureRedirect: "/auth/signin", //if fail
    failureFlash: "Invalid Username or Password",
    successFlash: "You have signed in!"
  })
);

//--- Logout Route
router.get("/auth/signout", (request, response) => {
  request.logout(); //clear and break session
  request.flash("success", "You have signed out!");
  response.redirect("/auth/signin");
});

module.exports = router;