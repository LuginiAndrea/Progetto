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
var utils_1 = require("../logic/users/utils");
var utils_2 = require("../utils");
var DB_interface_1 = require("../logic/db_interface/DB_interface");
var utils_3 = require("../logic/tables/utils");
/******************** CONSTANTS ***********************/
var cities_router = (0, express_1.Router)();
var table_name = "cities";
function get_fields(req, language) {
    return DB_interface_1.req_types.exclude_fields_by_language[table_name](language).fields.concat(req.query.join === "1" ? __spreadArray(__spreadArray([], DB_interface_1.req_types.exclude_fields_by_language.continents(language, "continents").fields.filter(function (x) { return x !== "id"; }), true), DB_interface_1.req_types.exclude_fields_by_language.countries(language, "countries").fields.filter(function (x) { return x !== "id"; }), true) :
        []);
}
var join_fields_query = "\n    JOIN Countries ON Countries.id = Cities.fk_country_id\n    JOIN Continents ON Continents.id = Countries.fk_continent_id\n";
cities_router.get("/routes", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var routes;
    return __generator(this, function (_a) {
        routes = [
            { method: "POST", path: "/create_table", body: "NO", is_admin: true },
            { method: "GET", path: "/table_schema", body: "NO", is_admin: false },
            { method: "DELETE", path: "/delete_table", body: "NO", is_admin: true },
            { method: "GET", path: "/all", body: "NO", is_admin: false },
            { method: "GET", path: "/filter_by_id", body: "Query_String", is_admin: false },
            { method: "GET", path: "/filter_by_rating", body: "Query_String", is_admin: false },
            { method: "GET", path: "/filter_by_countries", body: "Query_String", is_admin: false },
            { method: "GET", path: "/filter_by_monuments", body: "Query_String", is_admin: false },
            { method: "POST", path: "/insert", body: "JSON", is_admin: true },
            { method: "PUT", path: "/update/:id", body: "JSON", is_admin: true },
            { method: "DELETE", path: "/delete/:id", body: "NO", is_admin: true },
        ];
        res.status(200).json(res.locals.is_admin ? routes : routes.filter(function (x) { return !x.is_admin; }));
        return [2 /*return*/];
    });
}); });
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
                _a.apply(void 0, _b.concat([_c.sent(), { success: 201 }]));
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
                return [4 /*yield*/, utils_3.table.schema(table_name, res.locals.DB_INTERFACE)];
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
                return [4 /*yield*/, utils_3.table["delete"](table_name, res.locals.DB_INTERFACE, res.locals.is_admin)];
            case 1:
                _a.apply(void 0, _b.concat([_c.sent()]));
                return [2 /*return*/];
        }
    });
}); });
/************************************** GET ***************************************************/
cities_router.get("/all", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db_interface, language, fields, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                db_interface = res.locals.DB_INTERFACE;
                return [4 /*yield*/, (0, utils_1.get_language_of_user)(res.locals.UID, db_interface)];
            case 1:
                language = _c.sent();
                fields = get_fields(req, language);
                _a = utils_2.send_json;
                _b = [res];
                return [4 /*yield*/, utils_3.values.get.all(table_name, db_interface, fields, join_fields_query)];
            case 2:
                _a.apply(void 0, _b.concat([_c.sent()]));
                return [2 /*return*/];
        }
    });
}); });
cities_router.get("/filter_by_id", utils_2.validate_ids, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db_interface, language, fields, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                db_interface = res.locals.DB_INTERFACE;
                return [4 /*yield*/, (0, utils_1.get_language_of_user)(res.locals.UID, db_interface)];
            case 1:
                language = _c.sent();
                fields = get_fields(req, language);
                _a = utils_2.send_json;
                _b = [res];
                return [4 /*yield*/, utils_3.values.get.by_id(table_name, db_interface, res.locals.ids, fields, join_fields_query)];
            case 2:
                _a.apply(void 0, _b.concat([_c.sent()]));
                return [2 /*return*/];
        }
    });
}); });
cities_router.get("/filter_by_rating", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, valid, operator, rating, db_interface, language, fields, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = (0, utils_3.validate_rating)(req), valid = _a.valid, operator = _a.operator, rating = _a.rating;
                if (!!valid) return [3 /*break*/, 1];
                (0, utils_2.send_json)(res, utils_3.error_codes.INVALID_BODY(table_name));
                return [3 /*break*/, 4];
            case 1:
                db_interface = res.locals.DB_INTERFACE;
                return [4 /*yield*/, (0, utils_1.get_language_of_user)(res.locals.UID, db_interface)];
            case 2:
                language = _d.sent();
                fields = get_fields(req, language).concat("(votes_sum / NULLIF(number_of_votes, 0)) as rating");
                _b = utils_2.send_json;
                _c = [res];
                return [4 /*yield*/, utils_3.values.get.all(table_name, db_interface, fields, "".concat(join_fields_query, " WHERE rating ").concat(operator, " ").concat(rating))];
            case 3:
                _b.apply(void 0, _c.concat([_d.sent()]));
                _d.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
cities_router.get("/filter_by_countries", utils_2.validate_ids, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db_interface, language, fields, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                db_interface = res.locals.DB_INTERFACE;
                return [4 /*yield*/, (0, utils_1.get_language_of_user)(res.locals.UID, db_interface)];
            case 1:
                language = _c.sent();
                fields = get_fields(req, language).filter(function (x) { return x !== "fk_country_id"; });
                _a = utils_2.send_json;
                _b = [res];
                return [4 /*yield*/, utils_3.values.get.generic(table_name, db_interface, fields, "".concat(join_fields_query, " WHERE fk_country_id = ANY($1)"), [res.locals.ids])];
            case 2:
                _a.apply(void 0, _b.concat([_c.sent()]));
                return [2 /*return*/];
        }
    });
}); });
cities_router.get("/filter_by_monuments", utils_2.validate_ids, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db_interface, language, fields, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                db_interface = res.locals.DB_INTERFACE;
                return [4 /*yield*/, (0, utils_1.get_language_of_user)(res.locals.UID, db_interface)];
            case 1:
                language = _c.sent();
                fields = get_fields(req, language);
                _a = utils_2.send_json;
                _b = [res];
                return [4 /*yield*/, utils_3.values.get.generic(table_name, db_interface, fields, "".concat(join_fields_query, " id = ANY (SELECT fk_city_id FROM monuments WHERE id = ANY($1))"), [res.locals.ids])];
            case 2:
                _a.apply(void 0, _b.concat([_c.sent()]));
                return [2 /*return*/];
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
                _a.apply(void 0, _b.concat([_c.sent(), { success: 201 }]));
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
