"use strict";
exports.__esModule = true;
exports.validating_db_status = exports.get_db_uri = void 0;
var app_1 = require("../../app");
var get_db_uri = function () {
    var DB_URI = process.env.DATABASE_URL || process.env.DEV_DB_URI;
    if (!DB_URI)
        throw Error("Can't connect to Database: Database URL is ".concat(DB_URI));
    else
        return DB_URI;
};
exports.get_db_uri = get_db_uri;
var validating_db_status = function (req, res, next) {
    if (!app_1.app.locals.DEFAULT_DB_INTERFACE)
        res.status(500).send("Database is not available");
    else {
        res.locals.DB_INTERFACE = app_1.app.locals.DEFAULT_DB_INTERFACE;
        next();
    }
};
exports.validating_db_status = validating_db_status;
