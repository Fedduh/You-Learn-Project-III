const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// -- LOGIN --
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, theUser, info) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Something went wrong", err });
      return;
    }
    if (!theUser) {
      // user not found
      res.status(401).json(info);
      return;
    }
    // user found -> login
    req.login(theUser, err => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Something went wrong", err });
        return;
      }
      // login correct
      theUser.password = null;
      res.status(200).json(theUser);
    });
  })(req, res, next); // invoke the function returned by passport.authenticate
});

// -- SIGN UP --
router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  if (username === "" || password === "" || email === "") {
    res.status(400).json({ message: "Fill in all required fields *" });
    return;
  }

  User.findOne({ email }).then(user => {
    // does email exist?
    if (user !== null) {
      res.status(400).json({ message: "This e-mailaddress is already in use" });
      return;
    }
    // does user exist?
    User.findOne({ username }).then(user => {
      if (user !== null) {
        res.status(400).json({ message: "The username already exists" });
        return;
      }

      // create user
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass,
        email: email
      });

      newUser
        .save()
        .then(() => {
          res.status(200).json(newUser.username);
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({ message: "Something went wrong" });
        });
    });
  });
});

// -- LOGOUT --
router.get("/logout", (req, res) => {
  req.logout();
  // req.clearCookie(); // logout() didn't always work
  // req.session = null; 
  res.status(200).json({ message: "User logged out" });
});

// -- CHECK LOGIN STATUS --
router.get("/isloggedin", (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user.username);
    return;
  }
  res.status(401).json({ message: "User is not logged in" });
});

module.exports = router;
