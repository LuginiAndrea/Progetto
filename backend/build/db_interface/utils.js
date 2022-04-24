"use strict";
exports.__esModule = true;
exports.get_db_uri = void 0;
var email_1 = require("../email/email");
var get_db_uri = function (req, res, next) {
    res.locals.DB_URI = process.env.DATABASE_URL || process.env.DEV_DB_URI;
    if (res.locals.DB_URI === undefined) {
        (0, email_1.send_generic_error_email)("Error connecting to Database", "Can't connect to Database: Database URL is undefined");
        res.status(500).send("Can't connect to Database");
    }
    else
        next();
};
exports.get_db_uri = get_db_uri;
