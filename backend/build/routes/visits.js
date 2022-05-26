"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var utils_1 = require("../logic/users/utils");
var utils_2 = require("../utils");
var DB_interface_1 = require("../logic/db_interface/DB_interface");
var utils_3 = require("../logic/tables/utils");
/******************** CONSTANTS ***********************/
var visits_router = (0, express_1.Router)();
var table_name = "visits";
// function get_fields(req : Request, language: string) {
//     return types.exclude_fields_by_language[table_name](language).fields.concat(
//         req.query.join === "1" ?
//             [
//                 ...types.exclude_fields_by_language.continents(language).fields.filter(x => x !== "id"),
//                 ...types.exclude_fields_by_language.countries(language).fields.filter(x => x !== "id"),
//             ] :
//             []
//     );
// }
var join_fields_query = "\n    JOIN Countries ON Countries.id = Cities.fk_country_id\n    JOIN Continents ON Continents.id = Countries.fk_continent_id\n";
/************************************** TABLE ***************************************************/
visits_router.post("/create_table", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
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
visits_router.get("/table_schema", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
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
visits_router["delete"]("/delete_table", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
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
/************************************** LIST ***************************************************/
visits_router.get("/all", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db_interface, language, fields, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                db_interface = res.locals.DB_INTERFACE;
                return [4 /*yield*/, (0, utils_1.get_language_of_user)(res.locals.UID, db_interface)];
            case 1:
                language = _c.sent();
                fields = DB_interface_1.req_types.get_fields(table_name, table_name).fields.concat([
                    "monuments.".concat(language, "_name AS monument_name")
                ]);
                _a = utils_2.send_json;
                _b = [res];
                return [4 /*yield*/, utils_3.values.get.all(table_name, db_interface, fields, "JOIN monuments ON monuments.id = visits.fk_monument_id")];
            case 2:
                _a.apply(void 0, _b.concat([_c.sent()]));
                return [2 /*return*/];
        }
    });
}); });
visits_router.get("/visits_of_user", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db_interface, language, fields, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                db_interface = res.locals.DB_INTERFACE;
                return [4 /*yield*/, (0, utils_1.get_language_of_user)(res.locals.UID, db_interface)];
            case 1:
                language = _c.sent();
                fields = DB_interface_1.req_types.get_fields(table_name, table_name).fields.concat([
                    "monuments.".concat(language, "_name AS monument_name")
                ]);
                console.log(res.locals.UID);
                _a = utils_2.send_json;
                _b = [res];
                return [4 /*yield*/, utils_3.values.get.generic(table_name, db_interface, fields, "JOIN monuments ON monuments.id = visits.fk_monument_id WHERE visits.fk_user_id = $1", [res.locals.UID])];
            case 2:
                _a.apply(void 0, _b.concat([_c.sent()]));
                return [2 /*return*/];
        }
    });
}); });
visits_router.post("/insert", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var body, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                body = __assign({ fk_user_id: res.locals.UID }, req.body);
                _a = utils_2.send_json;
                _b = [res];
                return [4 /*yield*/, utils_3.values.insert(table_name, res.locals.DB_INTERFACE, res.locals.role, body)];
            case 1:
                _a.apply(void 0, _b.concat([_c.sent(), { success: 201 }]));
                return [2 /*return*/];
        }
    });
}); });
visits_router.put("/update/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = utils_2.send_json;
                _b = [res];
                return [4 /*yield*/, utils_3.values.update(table_name, res.locals.DB_INTERFACE, res.locals.role, req.body, req.params.id)];
            case 1:
                _a.apply(void 0, _b.concat([_c.sent()]));
                return [2 /*return*/];
        }
    });
}); });
visits_router["delete"]("/delete/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = utils_2.send_json;
                _b = [res];
                return [4 /*yield*/, utils_3.values["delete"](table_name, res.locals.DB_INTERFACE, res.locals.role, req.params.id)];
            case 1:
                _a.apply(void 0, _b.concat([_c.sent()]));
                return [2 /*return*/];
        }
    });
}); });
exports["default"] = visits_router;
