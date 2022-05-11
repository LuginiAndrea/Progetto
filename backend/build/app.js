"use strict";
// *************************************************************************************************
// -------------------- In production remove the dev_shortcuts folder -----------------------------*
// -------------------- In production also remove the SQL folder and the .env file. -------------- *
// *************************************************************************************************
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.app = void 0;
require("dotenv/config");
var express_1 = __importDefault(require("express"));
// import db_shortcut_router from "./routes/dev_shortcuts/DB_shortcuts"; // Remove this in production code
var users_1 = __importDefault(require("./routes/users/users"));
var countries_1 = __importDefault(require("./routes/countries/countries"));
var continents_1 = __importDefault(require("./routes/continents/continents"));
var cities_1 = __importDefault(require("./routes/cities/cities"));
var languages_1 = __importDefault(require("./routes/languages/languages"));
var DB_interface_1 = require("./logic/db_interface/DB_interface");
var utils_1 = require("./logic/users/utils");
var body_parser_1 = __importDefault(require("body-parser"));
var utils_2 = require("./utils");
var app = (0, express_1["default"])();
exports.app = app;
app.use(DB_interface_1.validate_db_status);
// Authenticate user
app.use(body_parser_1["default"].json());
app.use(utils_1.authenticate_user);
// app.use("/db_shortcuts", db_shortcut_router); // Remove this in production code
app.use("/languages", languages_1["default"]);
app.use("/countries", countries_1["default"]);
app.use("/users", users_1["default"]);
app.use("/continents", continents_1["default"]);
app.use("/cities", cities_1["default"]);
app.get("/", function (req, res) {
    res.status(200).send({ status: "Running" });
});
app.get("/reconnect_db", function (req, res) {
    var not_valid_connection = !app.locals.DEFAULT_DB_INTERFACE || !app.locals.DEFAULT_DB_INTERFACE.connected();
    if (not_valid_connection) {
        app.locals.DEFAULT_DB_INTERFACE = new DB_interface_1.DB_interface({
            connectionString: (0, DB_interface_1.get_db_uri)()
        }, true);
        if (app.locals.DEFAULT_DB_INTERFACE.connected())
            res.status(200).send({
                status: "Connected"
            });
        else
            res.status(500).send({
                error: "Not connected"
            });
    }
    else
        res.status(200).send({
            status: "Already connected"
        });
});
app.use("*", function (req, res) {
    (0, utils_2.send_json)(res, "Method not found", { error: 404 });
});
