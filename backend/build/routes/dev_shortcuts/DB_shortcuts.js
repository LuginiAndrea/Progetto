"use strict";
// *************************************************************************************************
// -------------------- This file is to be used only for development purposes. --------------------*
// -------------------- It is not to be used in production. -------------------------------------- *
// -------------------- In production also remove the SQL folder and the .env file. -------------- *
// *************************************************************************************************
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var bodyParser = __importStar(require("body-parser"));
var DB_interface_1 = require("../../logic/db_interface/DB_interface");
var table_creates_1 = require("./table_creates");
var index_creates_1 = require("./index_creates");
var app_1 = require("../../app");
var db_shortcut_router = (0, express_1.Router)();
var get_db_uri = function (req, res, next) {
    res.locals.DB_URI =
        (req.params.db === "prod") ? process.env.PROD_DB_URI : process.env.DEV_DB_URI;
    next();
};
db_shortcut_router.use("/:db", get_db_uri);
// -------------------- General table stuff --------------------
// -------------------- GET TABLE SCHEMA --------------------
db_shortcut_router.get("/:db/table_schema/:table_name", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ;
                return [4 /*yield*/, new DB_interface_1.DB_interface({
                        connectionString: res.locals.DB_URI
                    }).query("SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_name = $1;", [req.params.table_name])];
            case 1:
                result = _a.sent();
                (0, app_1.send_json)(res, result, function (internal_result) {
                    return {
                        table_name: req.params.table_name,
                        columns: internal_result[0].rows.map(function (row) { return [row.column_name, row.data_type]; })
                    };
                });
                return [2 /*return*/];
        }
    });
}); });
// -------------------- SELECT * --------------------
db_shortcut_router.get("/:db/select_table/:table_name", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new DB_interface_1.DB_interface({
                    connectionString: res.locals.DB_URI
                }).query("SELECT * FROM ".concat(req.params.table_name), [])];
            case 1:
                result = _a.sent();
                (0, app_1.send_json)(res, result);
                return [2 /*return*/];
        }
    });
}); });
// -------------------- DROP TABLE --------------------
db_shortcut_router.get("/:db/drop_table/:table_name", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new DB_interface_1.DB_interface({
                    connectionString: res.locals.DB_URI
                }).query("DROP TABLE ".concat(req.params.table_name), [])];
            case 1:
                result = _a.sent();
                (0, app_1.send_json)(res, result);
                return [2 /*return*/];
        }
    });
}); });
// -------------------- CREATE TABLE --------------------
db_shortcut_router.get("/:db/create_table/:table_name", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var table_name, db, result, table, _a, _b, _i, table, single_result;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                table_name = req.params.table_name;
                db = new DB_interface_1.DB_interface({
                    connectionString: res.locals.DB_URI
                });
                result = { error: "no tables selected" };
                if (!(table_name !== "all")) return [3 /*break*/, 2];
                table = table_creates_1.table_arguments[table_name];
                return [4 /*yield*/, db.query(table, [], false)];
            case 1:
                result = _c.sent();
                return [3 /*break*/, 6];
            case 2:
                _a = [];
                for (_b in table_creates_1.table_arguments)
                    _a.push(_b);
                _i = 0;
                _c.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 6];
                table = _a[_i];
                return [4 /*yield*/, db.query(table_creates_1.table_arguments[table], [], false)];
            case 4:
                single_result = _c.sent();
                if (!single_result.result) {
                    result = single_result;
                    return [3 /*break*/, 6];
                }
                _c.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6:
                (0, app_1.send_json)(res, result);
                db.close();
                return [2 /*return*/];
        }
    });
}); });
// -------------------- CREATE INDEXES --------------------
db_shortcut_router.get("/:db/create_indexes/:index_name", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var index_name, db, result, index, _a, _b, _i, index, single_result;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                index_name = req.params.index_name;
                db = new DB_interface_1.DB_interface({
                    connectionString: res.locals.DB_URI
                });
                result = { error: "no indexes selected" };
                if (!(index_name !== "all")) return [3 /*break*/, 2];
                index = index_creates_1.index_arguments[index_name];
                return [4 /*yield*/, db.query(index, [], false)];
            case 1:
                result = _c.sent();
                return [3 /*break*/, 6];
            case 2:
                _a = [];
                for (_b in index_creates_1.index_arguments)
                    _a.push(_b);
                _i = 0;
                _c.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 6];
                index = _a[_i];
                return [4 /*yield*/, db.query(index_creates_1.index_arguments[index], [], false)];
            case 4:
                single_result = _c.sent();
                if (!single_result.result) {
                    result = single_result;
                    return [3 /*break*/, 6];
                }
                _c.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6:
                (0, app_1.send_json)(res, result);
                db.close();
                return [2 /*return*/];
        }
    });
}); });
// -------------------- GET DB SCHEMA --------------------
db_shortcut_router.get('/:db/db_schema', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new DB_interface_1.DB_interface({
                    connectionString: res.locals.DB_URI
                }).query("SELECT table_name FROM information_schema.tables \n        WHERE table_type != 'VIEW' \n        AND table_name NOT LIKE 'pg%'\n        AND table_name NOT LIKE 'sql%'\n        AND table_name NOT LIKE 'spatial%'", [])];
            case 1:
                result = _a.sent();
                (0, app_1.send_json)(res, result);
                return [2 /*return*/];
        }
    });
}); });
// -------------------- INSERTS --------------------
db_shortcut_router.get("/:db/insertContinents", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new DB_interface_1.DB_interface({
                    connectionString: res.locals.DB_URI
                }).query("INSERT INTO continents (id, it_name, en_name) VALUES \n        (0, 'Europa', 'Europe'), \n        (1, 'Asia', 'Asia'), \n        (2, 'Nord America', 'North America'), \n        (3, 'Sud America', 'South America'), \n        (4, 'Africa', 'Africa'), \n        (5, 'Oceania', 'Oceania'), \n        (6, 'Antartica', 'Antarctica');", [])];
            case 1:
                result = _a.sent();
                (0, app_1.send_json)(res, result);
                return [2 /*return*/];
        }
    });
}); });
db_shortcut_router.get("/:db/insertAmericaCentrale", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new DB_interface_1.DB_interface({
                    connectionString: res.locals.DB_URI
                }).query("INSERT INTO continents (id, it_name, en_name) VALUES \n        (7, 'America Centrale', 'Central America');", [])];
            case 1:
                result = _a.sent();
                (0, app_1.send_json)(res, result);
                return [2 /*return*/];
        }
    });
}); });
db_shortcut_router.post("/:db/insertCountries", bodyParser.json(), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!DB_interface_1.req_types.is_countries_body(req.body)) return [3 /*break*/, 2];
                return [4 /*yield*/, new DB_interface_1.DB_interface({
                        connectionString: res.locals.DB_URI
                    }).query("INSERT INTO Countries (real_name, it_name, en_name, iso_alpha_3, fk_continent_id) VALUES\n            ($1, $2, $3, $4, $5);", [req.body.real_name, req.body.it_name, req.body.en_name, req.body.iso_alpha_3, req.body.fk_continent_id])];
            case 1:
                result = _a.sent();
                (0, app_1.send_json)(res, result);
                return [3 /*break*/, 3];
            case 2:
                res.status(400).send("Types not matching");
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
db_shortcut_router.post("/:db/InsertUser", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!DB_interface_1.req_types.is_users_body(req.body)) return [3 /*break*/, 2];
                return [4 /*yield*/, new DB_interface_1.DB_interface({
                        connectionString: res.locals.DB_URI
                    }).query("INSERT INTO Users (firebase_id, fk_language_id) VALUES ($1, $2);", [req.body.firebase_id, req.body.fk_language_id])];
            case 1:
                result = _a.sent();
                (0, app_1.send_json)(res, result);
                return [3 /*break*/, 3];
            case 2:
                res.status(400).send("Types not matching");
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
db_shortcut_router.post("/:db/InsertLanguages", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!DB_interface_1.req_types.is_languages_body(req.body)) return [3 /*break*/, 2];
                return [4 /*yield*/, new DB_interface_1.DB_interface({
                        connectionString: res.locals.DB_URI
                    }).query("INSERT INTO Languages (name, abbreviation) VALUES ($1, $2);", [req.body.name, req.body.abbreviation])];
            case 1:
                result = _a.sent();
                (0, app_1.send_json)(res, result);
                return [3 /*break*/, 3];
            case 2:
                res.status(400).send("Types not matching");
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
exports["default"] = db_shortcut_router;
