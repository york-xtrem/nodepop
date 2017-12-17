"use strict";

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

router.post("/", async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  //   User.getAuthenticated(email, password, function(err, user, reason) {
  //     if (err) throw err;

  //     // login was successful if we have a user
  //     if (user) {
  //         // handle login success
  //         console.log('login success');
  //         return;
  //     }

  //     // otherwise we can determine why we failed
  //     var reasons = User.failedLogin;
  //     switch (reason) {
  //         case reasons.NOT_FOUND:
  //         case reasons.PASSWORD_INCORRECT:
  //             // note: these cases are usually treated the same - don't tell
  //             // the user *why* the login failed, only that it did
  //             break;
  //         case reasons.MAX_ATTEMPTS:
  //             // send email or otherwise notify user that account is
  //             // temporarily locked
  //             break;
  //     }
  // });
  try {
    const existingUser = await User.findOne({ email }).exec();
    existingUser.comparePassword(password, function(err, isMatch) {
      if (err) return callback(err);

      // check if the password was a match
      if (!isMatch) {
        const errorMatch = new Error(__("authenticate"));
        errorMatch.status = 401;
        next(errorMatch);
        return;
      } else {
        const user_id = existingUser._id;

        // Sign token
        jwt.sign(
          { user_id },
          process.env.JWT_SECRET,
          {
            expiresIn: process.env.JWT_EXPIRES_IN
          },
          (err, token) => {
            if (err) {
              const errorToken = new Error(__("token_error"));
              errorToken.status = 500;
              next(errorToken);
              return;
            }

            res.json({ success: true, token: token });
          }
        );
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
