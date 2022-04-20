"use strict";
exports.__esModule = true;
require("dotenv/config");
var express = require("express");
var app = express();
app.get("/", function (req, res) {
    res.status(200).send("Hello World!");
});
app.get("/test", function (req, res) {
    res.status(200).send("Hello Test!");
});
app.listen(8080);
