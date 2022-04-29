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
var utils_1 = require("../../utils");
var DB_interface_1 = require("../../logic/db_interface/DB_interface");
var utils_2 = require("../../logic/users/utils");
var countries_router = (0, express_1.Router)();
function exclude_fields_by_language(language) {
    return DB_interface_1.req_types.get_countries_fields(function (x) { return x.startsWith("real_") || !(x.endsWith("_name") && !x.startsWith(language)); });
}
var error_codes = {
    "no_continent_ids": "countries_1",
    "no_city_id": "countries_2",
    "no_compatible_insert_body": "countries_3"
};
/************************************** GET ***************************************************/
// Return whole info about country
countries_router.get("/list_all", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db_interface, language_of_user, fields, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                db_interface = res.locals.DB_INTERFACE;
                return [4 /*yield*/, (0, utils_2.get_language_of_user)(req, res.locals.UID, db_interface)];
            case 1:
                language_of_user = _a.sent();
                fields = exclude_fields_by_language(language_of_user);
                return [4 /*yield*/, db_interface.query("SELECT ".concat(fields, " FROM countries"))];
            case 2:
                result = _a.sent();
                (0, utils_1.send_json)(res, result);
                return [2 /*return*/];
        }
    });
}); });
countries_router.get("/list_single/:country_id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db_interface, language_of_user, fields, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                db_interface = res.locals.DB_INTERFACE;
                return [4 /*yield*/, (0, utils_2.get_language_of_user)(req, res.locals.UID, db_interface)];
            case 1:
                language_of_user = _a.sent();
                fields = exclude_fields_by_language(language_of_user);
                return [4 /*yield*/, db_interface.query("SELECT ".concat(fields, " FROM countries WHERE id = $1"), [req.params.country_id])];
            case 2:
                result = _a.sent();
                (0, utils_1.send_json)(res, result);
                return [2 /*return*/];
        }
    });
}); });
countries_router.get("/list_single_by_iso_code/:country_iso_code", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db_interface, language_of_user, fields, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                db_interface = res.locals.DB_INTERFACE;
                return [4 /*yield*/, (0, utils_2.get_language_of_user)(req, res.locals.UID, db_interface)];
            case 1:
                language_of_user = _a.sent();
                fields = exclude_fields_by_language(language_of_user);
                return [4 /*yield*/, db_interface.query("SELECT ".concat(fields, " FROM countries WHERE iso_alpha_3 = $1"), [req.params.country_iso_code])];
            case 2:
                result = _a.sent();
                (0, utils_1.send_json)(res, result);
                return [2 /*return*/];
        }
    });
}); });
countries_router.get("/countries_in_continents", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db_interface, language_of_user, fields, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.query.continent_ids) return [3 /*break*/, 3];
                db_interface = res.locals.DB_INTERFACE;
                return [4 /*yield*/, (0, utils_2.get_language_of_user)(req, res.locals.UID, db_interface)];
            case 1:
                language_of_user = _a.sent();
                fields = exclude_fields_by_language(language_of_user);
                return [4 /*yield*/, db_interface.query("SELECT ".concat(fields, " FROM countries WHERE fk_continent_id = ANY ($1)"), [req.query.continent_ids.split(",")])];
            case 2:
                result = _a.sent();
                (0, utils_1.send_json)(res, result);
                return [3 /*break*/, 4];
            case 3:
                (0, utils_1.send_json)(res, {
                    error: error_codes.no_continent_ids
                });
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
countries_router.get("/country_of_city/:city_id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db_interface, language_of_user, fields, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.query.city_id) return [3 /*break*/, 3];
                db_interface = res.locals.DB_INTERFACE;
                return [4 /*yield*/, (0, utils_2.get_language_of_user)(req, res.locals.UID, db_interface)];
            case 1:
                language_of_user = _a.sent();
                fields = exclude_fields_by_language(language_of_user);
                return [4 /*yield*/, db_interface.query("\n            SELECT ".concat(fields, " FROM Countries \n            WHERE id = (\n                SELECT fk_country_id FROM Cities WHERE id = $1\n            )"), [req.query.city_id])];
            case 2:
                result = _a.sent();
                (0, utils_1.send_json)(res, result);
                return [3 /*break*/, 4];
            case 3:
                (0, utils_1.send_json)(res, {
                    error: error_codes.no_city_id
                });
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
countries_router.post("/insert_single", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, fields, placeholder_sequence, data, result;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!(res.locals.role !== "admin")) return [3 /*break*/, 1];
                (0, utils_1.send_json)(res, "Unauthorized");
                return [3 /*break*/, 4];
            case 1:
                if (!DB_interface_1.req_types.is_countries_body(req.body)) return [3 /*break*/, 3];
                _a = DB_interface_1.req_types.get_countries_fields(Object.keys(req.body)), fields = _a[0], placeholder_sequence = _a[1];
                data = DB_interface_1.req_types.extract_countries_fields(req.body, fields);
                return [4 /*yield*/, res.locals.DB_INTERFACE.query("\n            INSERT INTO Countries (".concat(fields, ") VALUES (").concat(placeholder_sequence, ")\n            RETURNING id;"), [data])];
            case 2:
                result = _b.sent();
                (0, utils_1.send_json)(res, result, {
                    statusCode: {
                        success: 201
                    }
                });
                return [3 /*break*/, 4];
            case 3:
                (0, utils_1.send_json)(res, {
                    error: error_codes.no_compatible_insert_body
                });
                _b.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
countries_router.post("/delete/:country_id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(res.locals.role !== "admin")) return [3 /*break*/, 1];
                (0, utils_1.send_json)(res, {
                    error: "Unauthorized"
                });
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, res.locals.DB_INTERFACE.query("DELETE FROM Countries WHERE id = $1;", [req.query.country_id])];
            case 2:
                result = _a.sent();
                (0, utils_1.send_json)(res, result);
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
exports["default"] = countries_router;
