"use strict";

function checkRole(role) {
  return function(req, res, next) {
    console.log(req.userId);
    if (req.userId && req.userRole === role) {
      next();
    } else {
      const error = new Error(__("require_role"));
      error.status = 403;
      next(error);
    }
  };
}

module.exports = checkRole;
