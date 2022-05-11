"use strict";
exports.__esModule = true;
exports.send_json = void 0;
var utils_1 = require("./logic/tables/utils");
function send_json(res, result, args) {
    var _a = args || {}, success = _a.success, error = _a.error, processing_func = _a.processing_func;
    if (typeof result === "string") {
        var destructured_error = result.split("_");
        var status_1 = error || (0, utils_1.error_codes_to_status_code)(destructured_error);
        res.status(status_1).send({ error: destructured_error[destructured_error.length - 1] });
    }
    else {
        res.status(success || 200).send(processing_func ?
            processing_func(result) :
            result.map(function (res) { return res.rows; }));
    }
}
exports.send_json = send_json;
