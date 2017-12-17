"use strict";

const jwt = require("jsonwebtoken");

// Load Users Schema
const User = require("../models/User");

// Middleware authentication
module.exports = () => {
  return function(req, res, next) {
    // Get token
    const token =
      req.body.token || req.query.token || req.get("x-access-token");

    if (!token) {
      const err = new Error(__("token"));
      err.status = 401;
      next(err);
      return;
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        const error = new Error(__("token_invalid"));
        error.status = 401;
        next(error);
        return;
      }
      // Save in request for next middlewares
      req.userId = decoded.user_id;
      const _id = req.userId;
      try {
        let user = await User.findOne({ _id: _id })
          .select("role")
          .lean(true)
          .exec();
        req.userRole = user.role;
      } catch (error) {
        next(error);
      }
      next();
    });
  };
};
