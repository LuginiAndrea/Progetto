"use strict";
exports.__esModule = true;
// *************************************************************************************************
// -------------------- In production remove the dev_shortcuts folder -----------------------------*
// -------------------- In production also remove the SQL folder and the .env file. -------------- *
// *************************************************************************************************
require("dotenv/config");
var express = require("express");
var DB_shortcuts_1 = require("./routes/dev_shortcuts/DB_shortcuts"); // Remove this in production code
var app = express();
app.use("/db_shortcuts", DB_shortcuts_1["default"]); // Remove this in production code
app.get("/", function (req, res) {
    res.status(200).send("Hello World!");
});
app.listen(8080);
