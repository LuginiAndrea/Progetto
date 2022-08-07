"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.validate_rating = exports.validate_ids = exports.send_json = void 0;
var utils_1 = require("./logic/tables/utils");
function send_json(res, result, args) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, success, error, status, to_send, _i, _b, single, _c, first, second, rest, destructured_error, code, mapped;
        return __generator(this, function (_d) {
            _a = args || {}, success = _a.success, error = _a.error;
            status = {
                code: 200,
                error_found: false
            };
            to_send = [];
            if (!(Array.isArray(result) && (Array.isArray(result[0]) || typeof result[0] === "string"))) //In this case it is DB_result[]
                result = [result];
            for (_i = 0, _b = result; _i < _b.length; _i++) {
                single = _b[_i];
                if (typeof single === "string") {
                    _c = single.split("_"), first = _c[0], second = _c[1], rest = _c.slice(2);
                    destructured_error = [first, second, rest.join("_")];
                    code = error || (0, utils_1.error_codes_to_status_code)(destructured_error);
                    status.error_found = true;
                    status.code = code;
                    to_send.push({ code: code, error: destructured_error[destructured_error.length - 1] });
                }
                else {
                    status.code = !status.error_found ? success || 200 : status.code;
                    mapped = single.map(function (s) { return s.rows; });
                    to_send.push(mapped);
                }
            }
            res.status(status.code).json(to_send);
            return [2 /*return*/];
        });
    });
}
exports.send_json = send_json;
function validate_ids(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (req.query.ids === undefined)
                send_json(res, utils_1.error_codes.INVALID_QUERY("ids"));
            else {
                res.locals.ids = req.query.ids.split(",") || [];
                if (res.locals.ids.length === 0)
                    send_json(res, utils_1.error_codes.NO_REFERENCED_ITEM("ids"));
                else
                    next();
            }
            return [2 /*return*/];
        });
    });
}
exports.validate_ids = validate_ids;
function validate_rating(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var operator, rating, valid;
        return __generator(this, function (_a) {
            operator = req.query.operator.toUpperCase();
            rating = req.query.rating === "NULL" ?
                "NULL" :
                parseInt(req.query.rating);
            if (!operator || !rating)
                send_json(res, utils_1.error_codes.INVALID_QUERY("Rating parameters"));
            valid = (rating === "NULL" && ["IS", "IS NOT"].includes(operator)) || (["=", "!=", ">", "<", ">=", "<="].includes(operator) && rating >= 0 && rating <= 5);
            if (valid) {
                res.locals.rating = rating;
                res.locals.operator = operator;
                next();
            }
            else
                send_json(res, utils_1.error_codes.INVALID_QUERY("Rating parameters"));
            return [2 /*return*/];
        });
    });
}
exports.validate_rating = validate_rating;
