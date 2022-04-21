"use strict";
// *************************************************************************************************
// -------------------- This file is to be used only for development purposes. --------------------*
// -------------------- It is not to be used in production. -------------------------------------- *
// -------------------- In production also remove the SQL folder and the .env file. -------------- *
// *************************************************************************************************
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
var DB_interface_1 = require("../../db_interface/DB_interface");
var db_shortcut_router = (0, express_1.Router)();
// -------------------- General table stuff --------------------
// -------------------- GET TABLE SCHEMA --------------------
db_shortcut_router.get("/:db/table_schema/:table_name", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var table_name, db, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                table_name = req.params.table_name;
                db = new DB_interface_1["default"]({
                    connectionString: (req.params.db === "prod") ? process.env.PROD_DB_URI : process.env.DEV_DB_URI
                });
                return [4 /*yield*/, db.query("SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_name = $1;", [table_name])];
            case 1:
                result = _a.sent();
                db.close();
                res.status(200).send({
                    table_name: table_name,
                    columns: (typeof result === "string") ? result : result.rows.map(function (row) { return [row.column_name, row.data_type]; })
                });
                return [2 /*return*/];
        }
    });
}); });
// -------------------- SELECT * --------------------
db_shortcut_router.get("/:db/select_table/:table_name", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var table_name, db, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                table_name = req.params.table_name;
                db = new DB_interface_1["default"]({
                    connectionString: (req.params.db === "prod") ? process.env.PROD_DB_URI : process.env.DEV_DB_URI
                });
                return [4 /*yield*/, db.query("SELECT * FROM ".concat(table_name, ";"), [])];
            case 1:
                result = _a.sent();
                res.status(200).send(result);
                db.close();
                return [2 /*return*/];
        }
    });
}); });
// -------------------- DROP TABLE --------------------
db_shortcut_router.get("/:db/drop_table/:table_name", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var table_name, db, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                table_name = req.params.table_name;
                db = new DB_interface_1["default"]({
                    connectionString: (req.params.db === "prod") ? process.env.PROD_DB_URI : process.env.DEV_DB_URI
                });
                return [4 /*yield*/, db.query("DROP TABLE ".concat(table_name, ";"), [])];
            case 1:
                result = _a.sent();
                res.status(200).send(result);
                db.close();
                return [2 /*return*/];
        }
    });
}); });
// -------------------- CREATE TABLE --------------------
db_shortcut_router.get("/:db/create_table/:table_name", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var table_name, db, table_arguments, table, _a, _b, _i, table;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                table_name = req.params.table_name;
                db = new DB_interface_1["default"]({
                    connectionString: (req.params.db === "prod") ? process.env.PROD_DB_URI : process.env.DEV_DB_URI
                });
                table_arguments = {
                    "continents": create_continents_table,
                    "countries": create_countries_table,
                    "cities": create_cities_table,
                    "languages": create_languages_table,
                    "users": create_users_table,
                    "monuments": create_monuments_table,
                    "visits": create_visits_table,
                    "types_of_monuments": create_types_of_monuments_table,
                    "monuments_types": create_monuments_types_table
                };
                if (!(table_name !== "all")) return [3 /*break*/, 2];
                table = table_arguments[table_name];
                return [4 /*yield*/, db.query(table.query, table.args)];
            case 1:
                _c.sent();
                return [3 /*break*/, 6];
            case 2:
                _a = [];
                for (_b in table_arguments)
                    _a.push(_b);
                _i = 0;
                _c.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 6];
                table = _a[_i];
                return [4 /*yield*/, db.query(table_arguments[table].query, table_arguments[table].args)];
            case 4:
                _c.sent();
                _c.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6:
                res.status(200).send("Created");
                db.close();
                return [2 /*return*/];
        }
    });
}); });
// -------------------- GET DB SCHEMA --------------------
db_shortcut_router.get('/:db/db_schema', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                db = new DB_interface_1["default"]({
                    connectionString: (req.params.db === "prod") ? process.env.PROD_DB_URI : process.env.DEV_DB_URI
                });
                return [4 /*yield*/, db.query("SELECT table_name FROM information_schema.tables \n        WHERE table_type != 'VIEW' \n        AND table_name NOT LIKE 'pg%'\n        AND table_name NOT LIKE 'sql%'\n        AND table_name NOT LIKE 'spatial%'", [])];
            case 1:
                result = _a.sent();
                res.status(200).send(result);
                db.close();
                return [2 /*return*/];
        }
    });
}); });
// -------------------- Continents table stuff --------------------
// -------------------- CREATE CONTINENTS TABLE --------------------
var create_continents_table = {
    query: "CREATE TABLE IF NOT EXISTS Continents (\n        id SMALLINT PRIMARY KEY,\n        it_name VARCHAR(20),\n        en_name VARCHAR(20)\n    );",
    args: []
};
// -------------------- INSERT CONTINENTS --------------------
db_shortcut_router.get("/insertContinents", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                db = new DB_interface_1["default"]({
                    connectionString: process.env.PROD_DB_URI
                });
                return [4 /*yield*/, db.query("INSERT INTO continents (id, it_name, en_name) VALUES \n    (0, 'Europa', 'Europe'), \n    (1, 'Asia', 'Asia'), \n    (2, 'Nord America', 'North America'), \n    (3, 'Sud America', 'South America'), \n    (4, 'Africa', 'Africa'), \n    (5, 'Oceania', 'Oceania'), \n    (6, 'Antartica', 'Antarctica');", [])];
            case 1:
                result = _a.sent();
                res.status(200).send(result);
                return [2 /*return*/];
        }
    });
}); });
// -------------------- Country table stuff --------------------
// -------------------- CREATE COUNTRIES TABLE --------------------
var create_countries_table = {
    query: "CREATE TABLE IF NOT EXISTS Countries (\n        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,\n        real_name VARCHAR(50) NOT NULL,\n        it_name VARCHAR(50) DEFAULT NULL,\n        en_name VARCHAR(50) DEFAULT NULL,\n        iso_alpha_3 CHAR(3) UNIQUE NOT NULL,\n        fk_continent_id SMALLINT REFERENCES Continents\n            ON DELETE SET NULL\n            ON UPDATE CASCADE\n    );",
    args: []
};
// -------------------- Cities table stuff --------------------
// -------------------- CREATE CITIES TABLE --------------------
var create_cities_table = {
    query: "CREATE TABLE IF NOT EXISTS Cities (\n        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,\n        real_name VARCHAR(50) NOT NULL,\n        it_name VARCHAR(50) DEFAULT NULL,\n        en_name VARCHAR(50) DEFAULT NULL,\n        rating SMALLINT DEFAULT NULL, \n        fk_country_id INTEGER REFERENCES Countries\n            ON DELETE CASCADE\n            ON UPDATE CASCADE\n    );",
    args: []
};
// -------------------- Languages table stuff --------------------
// -------------------- CREATE LANGUAGES TABLE --------------------
var create_languages_table = {
    query: "CREATE TABLE IF NOT EXISTS Languages (\n        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,\n        name VARCHAR(50) NOT NULL,\n        abbreviation CHAR(2) NOT NULL\n        );",
    args: []
};
// -------------------- Users table stuff --------------------
// -------------------- CREATE Users TABLE --------------------
var create_users_table = {
    query: "CREATE TABLE IF NOT EXISTS Users (\n        firebase_id INTEGER PRIMARY KEY,\n        fk_language_id INTEGER DEFAULT 0 REFERENCES Languages\n            ON DELETE SET DEFAULT\n            ON UPDATE CASCADE\n    );",
    args: []
};
// -------------------- Monuments table stuff --------------------
// -------------------- CREATE Monuments TABLE --------------------
var create_monuments_table = {
    query: "CREATE TABLE IF NOT EXISTS Monuments (\n        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,\n        real_name VARCHAR(50) NOT NULL, \n        it_name VARCHAR(50) DEFAULT NULL,\n        en_name VARCHAR(50) DEFAULT NULL,\n        coordinates GEOGRAPHY(POINT), \n        it_description TEXT DEFAULT NULL,\n        en_description TEXT DEFAULT NULL,\n        fk_city_id INTEGER REFERENCES Cities\n            ON DELETE CASCADE\n            ON UPDATE CASCADE\n    );",
    args: []
};
// -------------------- Visits table stuff --------------------
// -------------------- CREATE Visits TABLE --------------------
var create_visits_table = {
    query: "CREATE TABLE IF NOT EXISTS Visits ( \n        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,\n        rating SMALLINT NOT NULL, \n        private_description TEXT DEFAULT NULL,\n        date_time TIMESTAMP WITH TIME ZONE NOT NULL,\n        fk_user_id INTEGER REFERENCES Users\n            ON DELETE CASCADE\n            ON UPDATE CASCADE,\n        fk_monument_id INTEGER REFERENCES Monuments\n            ON DELETE CASCADE\n            ON UPDATE CASCADE\n    );",
    args: []
};
// -------------------- Types of monuments table stuff --------------------
// -------------------- CREATE Types_of_monuments TABLE --------------------
var create_types_of_monuments_table = {
    query: "CREATE TABLE IF NOT EXISTS Types_of_Monuments (\n        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,\n        real_name VARCHAR(50) NOT NULL, \n        it_name VARCHAR(50) DEFAULT NULL,\n        en_name VARCHAR(50) DEFAULT NULL,\n        it_description TEXT DEFAULT NULL,\n        en_description TEXT DEFAULT NULL,\n        period_start DATE NOT NULL,\n        period_end DATE DEFAULT NULL\n    );",
    args: []
};
// -------------------- Monuments type table stuff --------------------
// -------------------- CREATE Monuments_type TABLE --------------------
var create_monuments_types_table = {
    query: "CREATE TABLE IF NOT EXISTS Monuments_Types (\n        fk_monument_id INTEGER REFERENCES Monuments\n            ON DELETE CASCADE\n            ON UPDATE CASCADE,\n        fk_type_id INTEGER REFERENCES Types_of_Monuments\n            ON DELETE CASCADE\n            ON UPDATE CASCADE,\n        PRIMARY KEY (fk_monument_id, fk_type_id)\n    );",
    args: []
};
exports["default"] = db_shortcut_router;
