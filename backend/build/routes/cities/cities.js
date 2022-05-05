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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var express_1 = require("express");
var utils_1 = require("../../logic/users/utils");
var utils_2 = require("../../utils");
var DB_interface_1 = require("../../logic/db_interface/DB_interface");
var utils_3 = require("../../logic/tables/utils");
/******************** CONSTANTS ***********************/
var cities_router = (0, express_1.Router)();
var table_name = "cities";
var error_codes = {
    table_not_found: "".concat(table_name, "_1_1"),
    city_not_found: "".concat(table_name, "_1_2"),
    no_compatible_insert_body: "".concat(table_name, "_2_1"),
    no_compatible_update_body: "".concat(table_name, "_2_2"),
    no_country_ids: "".concat(table_name, "_2_3"),
    no_monument_id: "".concat(table_name, "_2_4")
};
function exclude_fields_by_language(language) {
    return DB_interface_1.req_types.get_fields("cities", function (x) { return x.startsWith("real_") || !(x.endsWith("_name") && !x.startsWith(language)); }, false)[0];
}
/****************************************** ROUTES **********************************************/
cities_router.options("/", function (req, res) {
    var method_list = [
        { verb: "post", method: "create_table", description: "Creates the table", role: "admin" },
        { verb: "get", method: "table_schema", description: "Gets the schema of the table" },
        { verb: "get", method: "list_all", description: "Gives the fields of all the cities" },
        { verb: "get", method: "list_single/:city_id", description: "Gives the fields of a single city" },
        { verb: "get", method: "cities_in_countries", description: "Gives list of all cities in countries passed with the query string" },
        { verb: "get", method: "city_of_monument", description: "Gives the city of a monument passed with the query string" },
        { verb: "post", method: "insert", description: "Inserts a new city. Parameters passed in the body", role: "admin" },
        { verb: "put", method: "update/:country_id", description: "Updates a city. Parameters passed in the body", role: "admin" },
        { verb: "delete", method: "delete/:country_id", description: "Deletes a city", role: "admin" }
    ];
    res.status(200).json(res.locals.role === "admin" ?
        method_list :
        method_list.filter(function (x) { return x.role !== "admin"; }));
});
/************************************** TABLE ***************************************************/
cities_router.post("/create_table", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = utils_2.send_json;
                _b = [res];
                return [4 /*yield*/, (0, utils_3.create_table)(table_name, res.locals.DB_INTERFACE, res.locals.role)];
            case 1:
                _a.apply(void 0, _b.concat([_c.sent()]));
                return [2 /*return*/];
        }
    });
}); });
cities_router.get("/table_schema", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = utils_2.send_json;
                _b = [res];
                return [4 /*yield*/, (0, utils_3.get_schema)(table_name, res.locals.DB_INTERFACE, res.locals.role)];
            case 1:
                _a.apply(void 0, _b.concat([(_c.sent()) || error_codes.table_not_found]));
                return [2 /*return*/];
        }
    });
}); });
cities_router["delete"]("/delete_table", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = utils_2.send_json;
                _b = [res];
                return [4 /*yield*/, (0, utils_3.delete_table)(table_name, res.locals.DB_INTERFACE, res.locals.role)];
            case 1:
                _a.apply(void 0, _b.concat([_c.sent()]));
                return [2 /*return*/];
        }
    });
}); });
/************************************** GET ***************************************************/
cities_router.get("/list_all", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db_interface, language_of_user, fields, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                db_interface = res.locals.DB_INTERFACE;
                return [4 /*yield*/, (0, utils_1.get_language_of_user)(req, res.locals.UID, db_interface)];
            case 1:
                language_of_user = _a.sent();
                fields = exclude_fields_by_language(language_of_user);
                return [4 /*yield*/, db_interface.query("SELECT ".concat(fields, " FROM Cities"))];
            case 2:
                result = _a.sent();
                (0, utils_2.send_json)(res, result);
                return [2 /*return*/];
        }
    });
}); });
cities_router.get("/list_single/:city_id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db_interface, language_of_user, fields, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                db_interface = res.locals.DB_INTERFACE;
                return [4 /*yield*/, (0, utils_1.get_language_of_user)(req, res.locals.UID, db_interface)];
            case 1:
                language_of_user = _a.sent();
                fields = exclude_fields_by_language(language_of_user);
                return [4 /*yield*/, db_interface.query("SELECT ".concat(fields, " FROM Cities WHERE id = $1"), [req.params.city_id])];
            case 2:
                result = _a.sent();
                (0, utils_2.send_json)(res, result);
                return [2 /*return*/];
        }
    });
}); });
cities_router.get("/cities_in_countries", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db_interface, language_of_user, fields, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.query.country_ids) return [3 /*break*/, 3];
                db_interface = res.locals.DB_INTERFACE;
                return [4 /*yield*/, (0, utils_1.get_language_of_user)(req, res.locals.UID, db_interface)];
            case 1:
                language_of_user = _a.sent();
                fields = exclude_fields_by_language(language_of_user);
                return [4 /*yield*/, db_interface.query("SELECT ".concat(fields, " FROM cities WHERE fk_country_id = ANY ($1)"), [req.query.country_ids.split(",")])];
            case 2:
                result = _a.sent();
                (0, utils_2.send_json)(res, result);
                return [3 /*break*/, 4];
            case 3:
                (0, utils_2.send_json)(res, {
                    error: error_codes.no_country_ids
                });
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
cities_router.get("/city_of_monument", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db_interface, language_of_user, fields, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.query.monument_id) return [3 /*break*/, 3];
                db_interface = res.locals.DB_INTERFACE;
                return [4 /*yield*/, (0, utils_1.get_language_of_user)(req, res.locals.UID, db_interface)];
            case 1:
                language_of_user = _a.sent();
                fields = exclude_fields_by_language(language_of_user);
                return [4 /*yield*/, db_interface.query("\n            SELECT ".concat(fields, " FROM Cities WHERE id = (\n                SELECT fk_city_id FROM Monuments WHERE id = $1\n            )"), [req.query.monument_id])];
            case 2:
                result = _a.sent();
                (0, utils_2.send_json)(res, result);
                return [3 /*break*/, 4];
            case 3:
                (0, utils_2.send_json)(res, {
                    error: error_codes.no_monument_id
                });
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
/************************************** POST ***************************************************/
cities_router.post("/insert", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db_interface, _a, fields, placeholder_sequence, data, result;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!(res.locals.role !== "admin")) return [3 /*break*/, 1];
                (0, utils_2.send_json)(res, "Unauthorized");
                return [3 /*break*/, 4];
            case 1:
                if (!DB_interface_1.req_types.is_cities_body(req.body)) return [3 /*break*/, 3];
                db_interface = res.locals.DB_INTERFACE;
                _a = DB_interface_1.req_types.get_fields("countries", Object.keys(req.body), true, true), fields = _a[0], placeholder_sequence = _a[1];
                data = DB_interface_1.req_types.extract_values_of_fields(req.body, fields);
                return [4 /*yield*/, db_interface.query("\n            INSERT INTO Countries (".concat(fields, ") VALUES (").concat(placeholder_sequence, ")\n            RETURNING id;"), data)];
            case 2:
                result = _b.sent();
                (0, utils_2.send_json)(res, result, { success: 201 });
                return [3 /*break*/, 4];
            case 3:
                (0, utils_2.send_json)(res, {
                    error: error_codes.no_compatible_insert_body
                });
                _b.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
/************************************** PUT ***************************************************/
cities_router.put("/update/:country_id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var updating_fields, db_interface, _a, fields, placeholder_sequence, data, result, _b;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                updating_fields = req.body.updating_fields;
                if (!(res.locals.role !== "admin")) return [3 /*break*/, 1];
                (0, utils_2.send_json)(res, "Unauthorized");
                return [3 /*break*/, 9];
            case 1:
                if (!(DB_interface_1.req_types.is_cities_body(req.body) && typeof updating_fields === "string")) return [3 /*break*/, 8];
                db_interface = res.locals.DB_INTERFACE;
                _a = DB_interface_1.req_types.get_fields("countries", updating_fields.split(","), 2), fields = _a[0], placeholder_sequence = _a[1];
                data = DB_interface_1.req_types.extract_values_of_fields(req.body, fields);
                if (!(fields.length === 0)) return [3 /*break*/, 2];
                (0, utils_2.send_json)(res, {
                    error: error_codes.no_compatible_update_body
                });
                return [3 /*break*/, 7];
            case 2:
                if (!(fields.length > 1)) return [3 /*break*/, 4];
                return [4 /*yield*/, db_interface.query("\n                    UPDATE Countries SET (".concat(fields, ") = (").concat(placeholder_sequence, ")\n                    WHERE id = $1\n                    RETURNING *;"), __spreadArray([req.params.country_id], data, true))];
            case 3:
                _b = _d.sent();
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, db_interface.query("\n                    UPDATE Countries SET ".concat(fields, " = $2\n                    WHERE id = $1\n                    RETURNING *;"), __spreadArray([req.params.country_id], data, true))];
            case 5:
                _b = _d.sent();
                _d.label = 6;
            case 6:
                result = _b;
                if (((_c = result === null || result === void 0 ? void 0 : result.result) === null || _c === void 0 ? void 0 : _c[0].rowCount) === 0) // Check if a row was affected
                    (0, utils_2.send_json)(res, error_codes.city_not_found);
                else
                    (0, utils_2.send_json)(res, result);
                _d.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                (0, utils_2.send_json)(res, {
                    error: error_codes.no_compatible_update_body
                });
                _d.label = 9;
            case 9: return [2 /*return*/];
        }
    });
}); });
/************************************** DELETE ***************************************************/
cities_router["delete"]("/delete/:country_id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db_interface, result;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!(res.locals.role !== "admin")) return [3 /*break*/, 1];
                (0, utils_2.send_json)(res, {
                    error: "Unauthorized"
                });
                return [3 /*break*/, 3];
            case 1:
                db_interface = res.locals.DB_INTERFACE;
                return [4 /*yield*/, db_interface.query("\n            DELETE FROM Countries WHERE id = $1\n            RETURNING id;", [req.params.country_id])];
            case 2:
                result = _b.sent();
                if (((_a = result === null || result === void 0 ? void 0 : result.result) === null || _a === void 0 ? void 0 : _a[0].rowCount) === 0) //Check if a row was affected
                    (0, utils_2.send_json)(res, error_codes.city_not_found);
                else
                    (0, utils_2.send_json)(res, result);
                _b.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
exports["default"] = cities_router;
