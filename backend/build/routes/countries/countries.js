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
var app_1 = require("../../app");
var DB_interface_1 = require("../../logic/db_interface/DB_interface");
var countries_router = (0, express_1.Router)();
// Return whole info about country
countries_router.get("/list_all", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new DB_interface_1.DB_interface({
                    connectionString: res.locals.DB_URI
                }).query("SELECT * FROM countries", [])];
            case 1:
                result = _a.sent();
                (0, app_1.send_json)(res, result);
                return [2 /*return*/];
        }
    });
}); });
countries_router.get("/list_single/:country_id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new DB_interface_1.DB_interface({
                    connectionString: res.locals.DB_URI
                }).query("SELECT * FROM countries WHERE id = $1", [req.params.country_id])];
            case 1:
                result = _a.sent();
                (0, app_1.send_json)(res, result);
                return [2 /*return*/];
        }
    });
}); });
countries_router.get("/list_single_by_iso_code/:country_iso_code", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new DB_interface_1.DB_interface({
                    connectionString: res.locals.DB_URI
                }).query("SELECT * FROM countries WHERE iso_alpha_3 = $1", [req.params.country_iso_code])];
            case 1:
                result = _a.sent();
                (0, app_1.send_json)(res, result);
                return [2 /*return*/];
        }
    });
}); });
// Return country id/s
countries_router.get("/countries_in_continent/:continent_id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new DB_interface_1.DB_interface({
                    connectionString: res.locals.DB_URI
                }).query("SELECT id FROM countries WHERE fk_continent_id = $1", [req.params.continent_id])];
            case 1:
                result = _a.sent();
                (0, app_1.send_json)(res, result);
                return [2 /*return*/];
        }
    });
}); });
countries_router.get("/country_of_city/:city_id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new DB_interface_1.DB_interface({
                    connectionString: res.locals.DB_URI
                }).query("SELECT fk_country_id FROM Cities WHERE id = $1", [req.params.city_id])];
            case 1:
                result = _a.sent();
                (0, app_1.send_json)(res, result);
                return [2 /*return*/];
        }
    });
}); });
countries_router.post("/insert", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!DB_interface_1.req_types.is_countries_body(req.body)) return [3 /*break*/, 2];
                return [4 /*yield*/, new DB_interface_1.DB_interface({
                        connectionString: res.locals.DB_URI
                    }).query("\n            INSERT INTO Countries (real_name, it_name, en_name, iso_alpha_3, fk_continent_id) VALUES ($1, $2, $3, $4, $5)\n            RETURNING id;", [req.body.real_name, req.body.it_name, req.body.en_name, req.body.iso_alpha_3, req.body.fk_continent_id])];
            case 1:
                result = _a.sent();
                (0, app_1.send_json)(res, result);
                return [3 /*break*/, 3];
            case 2:
                (0, app_1.send_json)(res, {
                    error: "i_1"
                });
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
countries_router.post("/delete", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(typeof req.body.id === "number")) return [3 /*break*/, 2];
                return [4 /*yield*/, new DB_interface_1.DB_interface({
                        connectionString: res.locals.DB_URI
                    }).query("DELETE FROM Countries WHERE id = $1;", [req.body.id])];
            case 1:
                result = _a.sent();
                console.log(result);
                (0, app_1.send_json)(res, result);
                return [3 /*break*/, 3];
            case 2:
                (0, app_1.send_json)(res, {
                    error: "i_1"
                });
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
exports["default"] = countries_router;
