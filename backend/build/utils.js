"use strict";
exports.__esModule = true;
exports.send_json = void 0;
var utils_1 = require("./logic/tables/utils");
function send_json(res, result, args) {
    var _a = args || {}, success = _a.success, error = _a.error, processing_func = _a.processing_func;
    if (typeof result === "string")
        result = {
            error: result
        };
    if (result.result) {
        if (processing_func === undefined)
            processing_func = function (result) { return result[0].rows; };
        res.status(success || 200).send(processing_func(result.result));
    }
    else {
        var status_1 = error || (0, utils_1.error_codes_to_status_code)(result.error);
        res.status(status_1).send({ error: result.error });
    }
}
exports.send_json = send_json;
