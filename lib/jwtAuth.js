"use strict";

const jwt = require("jsonwebtoken");

// Middleware authentication
module.exports = () => {
  return function(req, res, next) {
    // Get token
    const token =
      req.body.token || req.query.token || req.get("x-access-token");

    if (!token) {
      const err = new Error("No token provided");
      err.status = 401;
      next(err);
      return;
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        const error = new Error("Invalid token");
        error.status = 401;
        next(error);
        return;
      }
      // Save in request for next middlewares
      req.userId = decoded.user_id;
      next();
    });
  };
};
