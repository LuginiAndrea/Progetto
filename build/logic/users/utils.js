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
exports.get_language_of_user = exports.authenticate_user = void 0;
var app_1 = require("../../app");
var utils_1 = require("../tables/utils");
var utils_2 = require("../../utils");
function authenticate_user(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var firebase_app, auth_token, decoded_token, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    firebase_app = app_1.app.locals.FIREBASE_APP;
                    auth_token = req.headers.authorization;
                    if (!auth_token) return [3 /*break*/, 5];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, firebase_app.auth().verifyIdToken(auth_token)];
                case 2:
                    decoded_token = _a.sent();
                    res.locals.UID = decoded_token.uid;
                    res.locals.is_admin = (res.locals.UID === process.env.FIREBASE_SUPERADMIN_UID);
                    next();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.log("Token ".concat(auth_token, " not valid"));
                    (0, utils_2.send_json)(res, utils_1.error_codes.NOT_VALID_TOKEN("authentication"));
                    return [3 /*break*/, 4];
                case 4: return [3 /*break*/, 6];
                case 5:
                    (0, utils_2.send_json)(res, utils_1.error_codes.NO_AUTH_TOKEN("authentication"));
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.authenticate_user = authenticate_user;
//Implementare lettura dall'header della risposta
// nel caso sia presente 
function get_language_of_user(uid, db_instance) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, db_instance.query("SELECT abbreviation FROM Languages\n        WHERE id = (SELECT fk_language_id FROM Users WHERE id = $1)", [uid])];
                case 1:
                    result = _b.sent();
                    if (result === "42P01")
                        return [2 /*return*/, "en"];
                    if (typeof result === "string")
                        throw Error(result);
                    return [2 /*return*/, ((_a = result[0].rows[0]) === null || _a === void 0 ? void 0 : _a.abbreviation) || "en"]; //return abbreviation or "en"
            }
        });
    });
}
exports.get_language_of_user = get_language_of_user;
