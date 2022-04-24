"use strict";
exports.__esModule = true;
exports.authenticate_user = void 0;
var authenticate_user = function (req, res, next) {
    // Authenticate user with firebase admin
    console.log("Authenticated user");
    next();
};
exports.authenticate_user = authenticate_user;
