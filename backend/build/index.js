"use strict";
// *************************************************************************************************
// -------------------- In production remove the dev_shortcuts folder -----------------------------*
// -------------------- In production also remove the SQL folder and the .env file. -------------- *
// *************************************************************************************************
exports.__esModule = true;
require("dotenv/config");
var express = require("express");
var DB_shortcuts_1 = require("./routes/dev_shortcuts/DB_shortcuts"); // Remove this in production code
var users_1 = require("./routes/users/users");
var countries_1 = require("./routes/countries/countries");
var continents_1 = require("./routes/continents/continents");
var DB_interface_1 = require("./db_interface/DB_interface");
var utils_1 = require("./users/utils");
var bodyParser = require("body-parser");
var app = express();
//Choose Database URI
app.use(DB_interface_1.get_db_uri);
// Authenticate user
app.use(bodyParser.json());
app.use(utils_1.authenticate_user);
app.use("/db_shortcuts", DB_shortcuts_1["default"]); // Remove this in production code
app.use("/countries", countries_1["default"]);
app.use("/users", users_1["default"]);
app.use("/continents", continents_1["default"]);
app.get("/", function (req, res) {
    res.status(200).send("Hello World!");
});
app.listen(process.env.PORT || 8080, function () {
    console.log("Server is running on port ".concat(process.env.PORT || 8080));
});
