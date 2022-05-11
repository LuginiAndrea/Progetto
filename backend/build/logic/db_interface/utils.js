"use strict";
exports.__esModule = true;
exports.error_codes = exports.validate_db_status = exports.get_db_uri = void 0;
var app_1 = require("../../app");
var utils_1 = require("../../utils");
var error_codes = {
    "no_db_interface": "i_No interface",
    "no_db_connection": "i_Not connected"
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
function validate_db_status(req, res, next) {
    if (req.originalUrl.endsWith("/reconnect_db")) {
        res.locals.DB_INTERFACE = app_1.app.locals.DEFAULT_DB_INTERFACE;
        next();
    }
    if (!app_1.app.locals.DEFAULT_DB_INTERFACE)
        (0, utils_1.send_json)(res, error_codes.no_db_interface);
    else if (!app_1.app.locals.DEFAULT_DB_INTERFACE.connected())
        (0, utils_1.send_json)(res, error_codes.no_db_connection);
    else {
        res.locals.DB_INTERFACE = app_1.app.locals.DEFAULT_DB_INTERFACE;
        next();
    }
}
exports.validate_db_status = validate_db_status;
