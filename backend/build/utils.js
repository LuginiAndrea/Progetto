"use strict";
exports.__esModule = true;
exports.send_json = void 0;
var error_to_statusCode = function (error_code) {
    if (error_code.startsWith("i"))
        return 500;
    if (error_code === "Unauthorized")
        return 401;
    if (error_code === "23505")
        return 409;
    if (error_code.includes("_1_"))
        return 404;
    return 400;
};
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
        var status_1 = error || error_to_statusCode(result.error);
        res.status(status_1).send({ error: result.error });
    }
}
exports.send_json = send_json;
