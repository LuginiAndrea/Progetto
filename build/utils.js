"use strict";
exports.__esModule = true;
exports.send_json = void 0;
var utils_1 = require("./logic/tables/utils");
function send_json(res, result, args) {
    var _a = args || {}, success = _a.success, error = _a.error;
    var status = {
        code: 200,
        error_found: false
    };
    var to_send = [];
    if (!(Array.isArray(result) && (Array.isArray(result[0]) || typeof result[0] === "string"))) //In this case it is DB_result[]
        result = [result];
    for (var _i = 0, _b = result; _i < _b.length; _i++) {
        var single = _b[_i];
        if (typeof single === "string") {
            var _c = single.split("_"), first = _c[0], second = _c[1], rest = _c.slice(2);
            var destructured_error = [first, second, rest.join("_")];
            var code = error || (0, utils_1.error_codes_to_status_code)(destructured_error);
            status.error_found = true;
            status.code = code;
            to_send.push({ code: code, error: destructured_error[destructured_error.length - 1] });
        }
        else {
            status.code = !status.error_found ? success || 200 : status.code;
            var mapped = single.map(function (s) { return s.rows; });
            to_send.push(mapped);
        }
    }
    res.status(status.code).json(to_send);
}
exports.send_json = send_json;
