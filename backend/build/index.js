"use strict";
exports.__esModule = true;
var app_1 = require("./app");
app_1.app.listen(process.env.PORT || 8080, function () {
    console.log("Server is running on port ".concat(process.env.PORT || 8080));
});
