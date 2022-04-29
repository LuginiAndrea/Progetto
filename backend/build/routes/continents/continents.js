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
var express_1 = require("express");
var utils_1 = require("../../logic/users/utils");
var utils_2 = require("../../utils");
var DB_interface_1 = require("../../logic/db_interface/DB_interface");
var continents_router = (0, express_1.Router)();
var error_codes = {
    no_country_id: "continents_1"
};
function exclude_fields_by_language(language) {
    return DB_interface_1.req_types.get_fields("continents", function (x) { return !(x.endsWith("_name") && !x.startsWith(language)); }, false)[0];
}
/************************************** GET ***************************************************/
continents_router.get("/list_all", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db_interface, language_of_user, fields, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                db_interface = res.locals.DB_INTERFACE;
                return [4 /*yield*/, (0, utils_1.get_language_of_user)(req, res.locals.UID, db_interface)];
            case 1:
                language_of_user = _a.sent();
                fields = exclude_fields_by_language(language_of_user);
                return [4 /*yield*/, db_interface.query("SELECT ".concat(fields, " FROM Continents"))];
            case 2:
                result = _a.sent();
                (0, utils_2.send_json)(res, result);
                return [2 /*return*/];
        }
    });
}); });
continents_router.get("/list_single/:continent_id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db_interface, language_of_user, fields, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                db_interface = res.locals.DB_INTERFACE;
                return [4 /*yield*/, (0, utils_1.get_language_of_user)(req, res.locals.UID, db_interface)];
            case 1:
                language_of_user = _a.sent();
                fields = exclude_fields_by_language(language_of_user);
                return [4 /*yield*/, db_interface.query("SELECT ".concat(fields, " FROM Continents WHERE id = $1"), [req.params.continent_id])];
            case 2:
                result = _a.sent();
                (0, utils_2.send_json)(res, result);
                return [2 /*return*/];
        }
    });
}); });
continents_router.get("/continent_of_country", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db_interface, language_of_user, fields, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.query.country_id) return [3 /*break*/, 3];
                db_interface = res.locals.DB_INTERFACE;
                return [4 /*yield*/, (0, utils_1.get_language_of_user)(req, res.locals.UID, db_interface)];
            case 1:
                language_of_user = _a.sent();
                fields = exclude_fields_by_language(language_of_user);
                return [4 /*yield*/, db_interface.query("\n            SELECT ".concat(fields, " FROM Continents \n            WHERE id = (\n                SELECT fk_continent_id FROM Countries WHERE id = $1\n            )"), [req.query.country_id])];
            case 2:
                result = _a.sent();
                (0, utils_2.send_json)(res, result);
                return [3 /*break*/, 4];
            case 3:
                (0, utils_2.send_json)(res, {
                    error: error_codes.no_country_id
                });
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
exports["default"] = continents_router;
