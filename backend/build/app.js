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
var DB_shortcuts_1 = __importDefault(require("./routes/dev_shortcuts/DB_shortcuts")); // Remove this in production code
var users_1 = __importDefault(require("./routes/users/users"));
var countries_1 = __importDefault(require("./routes/countries/countries"));
var continents_1 = __importDefault(require("./routes/continents/continents"));
var cities_1 = __importDefault(require("./routes/cities/cities"));
var DB_interface_1 = require("./logic/db_interface/DB_interface");
var utils_1 = require("./logic/users/utils");
var body_parser_1 = __importDefault(require("body-parser"));
var utils_2 = require("./utils");
var app = (0, express_1["default"])();
exports.app = app;
app.use(DB_interface_1.validating_db_status);
// Authenticate user
app.use(body_parser_1["default"].json());
app.use(utils_1.authenticate_user);
app.use("/db_shortcuts", DB_shortcuts_1["default"]); // Remove this in production code
app.use("/countries", countries_1["default"]);
app.use("/users", users_1["default"]);
app.use("/continents", continents_1["default"]);
app.use("/cities", cities_1["default"]);
app.get("/", function (req, res) {
    res.status(200).send({ "Status": "Running" });
});
app.use("*", function (req, res) {
    (0, utils_2.send_json)(res, {
        error: "Method not found"
    }, { error: 404 });
});
