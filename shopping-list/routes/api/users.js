const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

//Item model
const User = require("../../model/User");

//@route POST api/users
//@decs Register new user
//@access Public
router.post("/", (req, res) => {
  const { name, email, password } = req.body;

  //simple validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  //Check for existing user
  User.findOne({ email }) //email: email
    .then((user) => {
      if (user)
        return res.status(400).json({ message: "The email is existed" });

      const newUser = User({
        name,
        email,
        password,
      });

      //Create salt & hash
      bcrypt.genSalt(
        10, // higher more secure, but takes longer
        (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save().then((user) => {
              jwt.sign(
                { id: user.id },
                config.get("jwtSecret"),
                { expiresIn: 3600 },
                (err, token) => {
                  if (err) {
                    alert(err);
                    throw err;
                  }
                  res.json({
                    token,
                    user: {
                      id: user.id,
                      name: user.name,
                      email: user.email,
                    },
                  });
                }
              );
            });
          });
        }
      );
    });
});

module.exports = router;

//es6 fashion, but we not using babel or anything
//export default router;
