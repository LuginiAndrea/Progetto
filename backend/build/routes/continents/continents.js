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
var table_creates_1 = require("../dev_shortcuts/table_creates");
var continents_router = (0, express_1.Router)();
var error_codes = {
    no_continents_table: "continents_1_1",
    no_country_id: "continents_2_1"
};
function exclude_fields_by_language(language) {
    return DB_interface_1.req_types.get_fields("continents", function (x) { return !(x.endsWith("_name") && !x.startsWith(language)); }, false)[0];
}
continents_router.options("/", function (req, res) {
    var method_list = [
        { verb: "post", method: "create_table", description: "Creates the table", role: "admin" },
        { verb: "get", method: "table_schema", description: "Gets the schema of the table", role: "admin" },
        { verb: "post", method: "insert_continents", description: "Inserts all the continents. To be used only when table is reset", role: "admin" },
        { verb: "get", method: "list_all", description: "Gives the fields of all the continents" },
        { verb: "get", method: "list_single/:continent_id", description: "Gives the fields of a single continents" },
        { verb: "get", method: "continent_of_country", description: "Gives the continent of a country passed with the query string" },
    ];
    res.status(200).json(res.locals.role === "admin" ?
        method_list :
        method_list.filter(function (x) { return x.role !== "admin"; }));
});
/************************************** TABLE ***************************************************/
continents_router.post("/create_table", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db_interface, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(res.locals.role !== "admin")) return [3 /*break*/, 1];
                (0, utils_2.send_json)(res, "Unauthorized");
                return [3 /*break*/, 3];
            case 1:
                db_interface = res.locals.DB_INTERFACE;
                return [4 /*yield*/, db_interface.query(table_creates_1.table_creates.continents)];
            case 2:
                result = _a.sent();
                (0, utils_2.send_json)(res, result, { success: 201 });
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
continents_router.get("/table_schema", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db_interface, result;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                db_interface = res.locals.DB_INTERFACE;
                return [4 /*yield*/, db_interface.query("\n        SELECT column_name, data_type, character_maximum_length, is_nullable\n        FROM information_schema.columns\n        WHERE table_name = 'continents'\n    ")];
            case 1:
                result = _b.sent();
                ((_a = result === null || result === void 0 ? void 0 : result.result) === null || _a === void 0 ? void 0 : _a[0].rowCount) === 0 ?
                    (0, utils_2.send_json)(res, { error: error_codes.no_continents_table }) :
                    (0, utils_2.send_json)(res, result);
                return [2 /*return*/];
        }
    });
}); });
continents_router.post("/insert_continents", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db_interface, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                db_interface = res.locals.DB_INTERFACE;
                return [4 /*yield*/, db_interface.query("\n        INSERT INTO continents (id, it_name, en_name) VALUES \n        (0, 'Europa', 'Europe'), \n        (1, 'Asia', 'Asia'), \n        (2, 'Nord America', 'North America'), \n        (3, 'Sud America', 'South America'),\n        (4, 'America Centrale', 'Central America'), \n        (5, 'Africa', 'Africa'), \n        (6, 'Oceania', 'Oceania'), \n        (7, 'Antartica', 'Antarctica');")];
            case 1:
                result = _a.sent();
                (0, utils_2.send_json)(res, result, { success: 201 });
                return [2 /*return*/];
        }
    });
}); });
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
                return [4 /*yield*/, db_interface.query("SELECT ".concat(fields, " FROM Continents ORDER BY ").concat(language_of_user, "_name"))];
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
                console.log(result);
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
