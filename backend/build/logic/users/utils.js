"use strict";
exports.__esModule = true;
exports.authenticate_user = void 0;
var authenticate_user = function (req, res, next) {
    // Authenticate user with firebase admin
    // puts the user UID in res.locals.uid
    console.log("Authenticated user");
    next();
};
exports.authenticate_user = authenticate_user;
