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
exports.delete_table = exports.get_schema = exports.create_table = void 0;
var table_creates_1 = require("../../sql/table_creates");
var DB_interface_1 = require("../db_interface/DB_interface");
function create_table(table_name, db_interface, role) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (role !== "admin")
                        return [2 /*return*/, "Unauthorized"];
                    return [4 /*yield*/, db_interface.query(table_creates_1.table_creates[table_name])];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.create_table = create_table;
function delete_table(table_name, db_interface, role) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (role !== "admin")
                        return [2 /*return*/, "Unauthorized"];
                    return [4 /*yield*/, db_interface.query("DROP TABLE ".concat(table_name))];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.delete_table = delete_table;
function get_schema(table_name, db_interface, role) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, db_interface.query("\n        SELECT column_name, data_type, character_maximum_length, is_nullable\n        FROM information_schema.columns\n        WHERE table_name = '".concat(table_name, "'\n    "))];
                case 1:
                    result = _b.sent();
                    return [2 /*return*/, ((_a = result === null || result === void 0 ? void 0 : result.result) === null || _a === void 0 ? void 0 : _a[0].rowCount) === 0 ?
                            null :
                            result];
            }
        });
    });
}
exports.get_schema = get_schema;
function insert_into(table_name, db_interface, role, data) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, fields, placeholder_sequence, values;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (role !== "admin")
                        return [2 /*return*/, "Unauthorized"];
                    if (!DB_interface_1.req_types.is_countries_body(data)) return [3 /*break*/, 2];
                    _a = DB_interface_1.req_types.get_fields(table_name, Object.keys(data), 2), fields = _a[0], placeholder_sequence = _a[1];
                    values = DB_interface_1.req_types.extract_values_of_fields(data, fields);
                    return [4 /*yield*/, db_interface.query("\n            INSERT INTO Countries (".concat(fields, ") VALUES (").concat(placeholder_sequence, ")\n            RETURNING id;"), values)];
                case 1: return [2 /*return*/, _b.sent()];
                case 2: return [2 /*return*/, null];
            }
        });
    });
}
var x = [
    { name: "no_continents_table", category: 1 },
    { name: "no_countries_table", category: 2 },
];
