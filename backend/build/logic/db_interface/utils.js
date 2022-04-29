"use strict";
exports.__esModule = true;
exports.error_codes = exports.validating_db_status = exports.get_db_uri = void 0;
var app_1 = require("../../app");
var error_codes = {
    "no_db_istance": "i_db_1",
    "no_db_connection": "i_db_2"
};
exports.error_codes = error_codes;
function get_db_uri() {
    var DB_URI = process.env.DATABASE_URL || process.env.DEV_DB_URI;
    if (!DB_URI)
        throw new Error("Can't connect to Database: Database URL is ".concat(DB_URI));
    else
        return DB_URI;
}
exports.get_db_uri = get_db_uri;
function validating_db_status(req, res, next) {
    if (!app_1.app.locals.DEFAULT_DB_INTERFACE)
        res.status(500).send({
            error: error_codes.no_db_istance
        });
    else {
        res.locals.DB_INTERFACE = app_1.app.locals.DEFAULT_DB_INTERFACE;
        next();
    }
}
exports.validating_db_status = validating_db_status;
