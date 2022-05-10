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
var utils_3 = require("../../logic/tables/utils");
/******************** CONSTANTS ***********************/
var cities_router = (0, express_1.Router)();
var table_name = "cities";
function exclude_fields_by_language(language) {
    return DB_interface_1.req_types.get_fields("cities", function (x) { return x.startsWith("real_") || !(x.endsWith("_name") && !x.startsWith(language)); }, false)[0];
}
var join_countries = function (rest_of_query) {
    if (rest_of_query === void 0) { rest_of_query = ""; }
    return "JOIN countries ON cities.fk_country_id = countries.id" + rest_of_query;
};
var join_countries_filter = function (func, language) {
    return function (args) { return func(args).concat(["countries.".concat(language, "_name as country_name")]); };
};
/****************************************** ROUTES **********************************************/
cities_router.options("/", function (req, res) {
    var method_list = [
        { verb: "post", method: "create_table", description: "Creates the table", is_admin: true },
        { verb: "delete", method: "delete_table", description: "Deletes the table", is_admin: true },
        { verb: "get", method: "table_schema", description: "Gets the schema of the table" },
        { verb: "get", method: "list_all", description: "Gives the fields of all the cities" },
        { verb: "get", method: "list_single/:id", description: "Gives the fields of a single city" },
        { verb: "get", method: "cities_in_countries", description: "Gives list of all cities in countries passed with the query string" },
        { verb: "get", method: "list_by_rating", description: "Gives list of all the cities that meets the passed condition and rating passed with query string" },
        { verb: "get", method: "cities_of_monuments", description: "Gives the cities of the monuments passed with the query string" },
        { verb: "post", method: "insert", description: "Inserts a new city. Parameters passed in the body", is_admin: true },
        { verb: "put", method: "update/:country_id", description: "Updates a city. Parameters passed in the body", is_admin: true },
        { verb: "delete", method: "delete/:country_id", description: "Deletes a city", is_admin: true }
    ];
    res.status(200).json(res.locals.is_admin ?
        method_list :
        method_list.filter(function (x) { return x.is_admin; }));
});
/************************************** TABLE ***************************************************/
cities_router.post("/create_table", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = utils_2.send_json;
                _b = [res];
                return [4 /*yield*/, utils_3.table.create(table_name, res.locals.DB_INTERFACE, res.locals.is_admin)];
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
                return [4 /*yield*/, utils_3.table["delete"](table_name, res.locals.DB_INTERFACE, res.locals.is_admin)];
            case 1:
                _a.apply(void 0, _b.concat([_c.sent()]));
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
                return [4 /*yield*/, utils_3.table.schema(table_name, res.locals.DB_INTERFACE)];
            case 1:
                _a.apply(void 0, _b.concat([_c.sent()]));
                return [2 /*return*/];
        }
    });
}); });
/************************************** GET ***************************************************/
cities_router.get("/list_all", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db_interface, language, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                db_interface = res.locals.DB_INTERFACE;
                return [4 /*yield*/, (0, utils_1.get_language_of_user)(req, res.locals.uid, db_interface)];
            case 1:
                language = _c.sent();
                _a = utils_2.send_json;
                _b = [res];
                return [4 /*yield*/, utils_3.values.get.all(table_name, db_interface, join_countries(), {
                        func: join_countries_filter(exclude_fields_by_language, language),
                        args: language
                    })];
            case 2:
                _a.apply(void 0, _b.concat([_c.sent()]));
                return [2 /*return*/];
        }
    });
}); });
cities_router.get("/list_single/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db_interface, language, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                db_interface = res.locals.DB_INTERFACE;
                return [4 /*yield*/, (0, utils_1.get_language_of_user)(req, res.locals.uid, db_interface)];
            case 1:
                language = _c.sent();
                _a = utils_2.send_json;
                _b = [res];
                return [4 /*yield*/, utils_3.values.get.single(table_name, db_interface, req.params.id, join_countries(), {
                        func: join_countries_filter(exclude_fields_by_language, language),
                        args: language
                    })];
            case 2:
                _a.apply(void 0, _b.concat([_c.sent()]));
                return [2 /*return*/];
        }
    });
}); });
cities_router.get("/list_by_rating", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, valid, operator, rating, db_interface, language_1, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = (0, DB_interface_1.validate_rating)(req), valid = _a.valid, operator = _a.operator, rating = _a.rating;
                if (!!valid) return [3 /*break*/, 1];
                (0, utils_2.send_json)(res, utils_3.error_codes.Invalid_body(table_name));
                return [3 /*break*/, 4];
            case 1:
                db_interface = res.locals.DB_INTERFACE;
                return [4 /*yield*/, (0, utils_1.get_language_of_user)(req, res.locals.uid, db_interface)];
            case 2:
                language_1 = _d.sent();
                _b = utils_2.send_json;
                _c = [res];
                return [4 /*yield*/, utils_3.values.get.all(table_name, db_interface, join_countries("WHERE (votes_sum / NULLIF(number_of_votes, 0)) ".concat(operator, " ").concat(rating)), {
                        func: join_countries_filter(exclude_fields_by_language, language_1),
                        args: language_1
                    })];
            case 3:
                _b.apply(void 0, _c.concat([_d.sent()]));
                _d.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
cities_router.get("/cities_in_countries", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db_interface, language_2, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!!req.query.country_ids) return [3 /*break*/, 1];
                (0, utils_2.send_json)(res, utils_3.error_codes.No_referenced_item(table_name));
                return [3 /*break*/, 4];
            case 1:
                db_interface = res.locals.DB_INTERFACE;
                return [4 /*yield*/, (0, utils_1.get_language_of_user)(req, res.locals.UID, db_interface)];
            case 2:
                language_2 = _c.sent();
                _a = utils_2.send_json;
                _b = [res];
                return [4 /*yield*/, utils_3.values.get.generic(table_name, db_interface, join_countries("WHERE fk_country_id = ANY ($1)"), [req.query.country_ids.split(",")], {
                        func: join_countries_filter(exclude_fields_by_language, language_2),
                        args: language_2
                    })];
            case 3:
                _a.apply(void 0, _b.concat([_c.sent()]));
                _c.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
cities_router.get("/cities_of_monuments", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db_interface, language_3, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!!req.query.monument_ids) return [3 /*break*/, 1];
                (0, utils_2.send_json)(res, utils_3.error_codes.No_referenced_item(table_name));
                return [3 /*break*/, 4];
            case 1:
                db_interface = res.locals.DB_INTERFACE;
                return [4 /*yield*/, (0, utils_1.get_language_of_user)(req, res.locals.UID, db_interface)];
            case 2:
                language_3 = _c.sent();
                _a = utils_2.send_json;
                _b = [res];
                return [4 /*yield*/, utils_3.values.get.generic(table_name, db_interface, join_countries("WHERE id = ANY (SELECT fk_city_id FROM monuments WHERE id = ANY($1))"), [req.query.monument_ids.split(",")], {
                        func: join_countries_filter(exclude_fields_by_language, language_3),
                        args: language_3
                    })];
            case 3:
                _a.apply(void 0, _b.concat([_c.sent()]));
                _c.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
/************************************** POST ***************************************************/
cities_router.post("/insert", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = utils_2.send_json;
                _b = [res];
                return [4 /*yield*/, utils_3.values.insert(table_name, res.locals.DB_INTERFACE, res.locals.is_admin, req.body)];
            case 1:
                _a.apply(void 0, _b.concat([_c.sent()]));
                return [2 /*return*/];
        }
    });
}); });
/************************************** PUT ***************************************************/
cities_router.put("/update/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = utils_2.send_json;
                _b = [res];
                return [4 /*yield*/, utils_3.values.update(table_name, res.locals.DB_INTERFACE, res.locals.is_admin, req.body, req.params.id)];
            case 1:
                _a.apply(void 0, _b.concat([_c.sent()]));
                return [2 /*return*/];
        }
    });
}); });
/************************************** DELETE ***************************************************/
cities_router["delete"]("/delete/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = utils_2.send_json;
                _b = [res];
                return [4 /*yield*/, utils_3.values["delete"](table_name, res.locals.DB_INTERFACE, res.locals.is_admin, req.params.id)];
            case 1:
                _a.apply(void 0, _b.concat([_c.sent()]));
                return [2 /*return*/];
        }
    });
}); });
exports["default"] = cities_router;
