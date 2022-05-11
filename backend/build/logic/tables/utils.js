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
exports.convert_error_code = exports.validate_rating = exports.error_codes_to_status_code = exports.error_codes = exports.values = exports.table = void 0;
var table_creates_1 = require("../../sql/table_creates");
var DB_interface_1 = require("../db_interface/DB_interface");
function gen_error_code(error_code) {
    return function (table_name) {
        return "".concat(error_code, ".").concat(table_name);
    };
}
var error_codes = {
    Unauthorized: gen_error_code("e_0_Unauthorized"),
    Invalid_body: gen_error_code("e_1_Invalid Body"),
    No_referenced_item: gen_error_code("e_1_No Referenced Item"),
    No_row_affected: gen_error_code("e_2_No Row Affected"),
    No_existing_table: gen_error_code("e_2_No Existing Table")
};
exports.error_codes = error_codes;
function error_codes_to_status_code(error_code) {
    if (error_code[0].startsWith("i"))
        return 500;
    if (error_code[0] === "23505")
        return 409;
    if (error_code[1] === "0_")
        return 403;
    if (error_code[1] === "1_")
        return 400;
    if (error_code[0] === "42P01" || error_code[1] === "2_")
        return 404;
    return 400;
}
exports.error_codes_to_status_code = error_codes_to_status_code;
function convert_error_code(error_code) {
    var _a = error_code.split(/_(.*)/s), code = _a[0], tb_name = _a[1], _ = _a[2];
    switch (code) {
        case "42P01": return error_codes.No_existing_table(tb_name);
        default: return error_code;
    }
}
exports.convert_error_code = convert_error_code;
function create_table(table_name, db_interface, is_admin) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!is_admin)
                        return [2 /*return*/, error_codes.Unauthorized(table_name)];
                    return [4 /*yield*/, db_interface.query(table_creates_1.table_creates[table_name])];
                case 1:
                    result = _a.sent();
                    typeof result === "string" ?
                        convert_error_code(result) :
                        result;
                    return [2 /*return*/];
            }
        });
    });
}
function delete_table(table_name, db_interface, is_admin) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!is_admin)
                        return [2 /*return*/, error_codes.Unauthorized(table_name)];
                    return [4 /*yield*/, db_interface.query("DROP TABLE ".concat(table_name))];
                case 1:
                    result = _a.sent();
                    typeof result === "string" ?
                        convert_error_code(result) :
                        result;
                    return [2 /*return*/];
            }
        });
    });
}
function get_schema(table_name, db_interface) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_interface.query("\n        SELECT column_name, data_type, character_maximum_length, is_nullable\n        FROM information_schema.columns\n        WHERE table_name = '".concat(table_name, "'\n    "))];
                case 1:
                    result = _a.sent();
                    if (typeof result !== "string")
                        return [2 /*return*/, result[0].rowCount === 0 ? // Check if a row was affected
                                error_codes.No_row_affected(table_name) :
                                result];
                    return [2 /*return*/, result];
            }
        });
    });
}
function get_all_values(table_name, db_interface, rest_of_query, filter) {
    if (rest_of_query === void 0) { rest_of_query = ""; }
    return __awaiter(this, void 0, void 0, function () {
        var fields;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fields = (filter === null || filter === void 0 ? void 0 : filter.func(filter === null || filter === void 0 ? void 0 : filter.args)) || "".concat(table_name, ".*");
                    return [4 /*yield*/, db_interface.query("SELECT ".concat(fields, " FROM ").concat(table_name, " ").concat(rest_of_query))];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function get_single_value(table_name, db_interface, id, rest_of_query, filter) {
    if (rest_of_query === void 0) { rest_of_query = ""; }
    return __awaiter(this, void 0, void 0, function () {
        var fields;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fields = (filter === null || filter === void 0 ? void 0 : filter.func(filter === null || filter === void 0 ? void 0 : filter.args)) || "".concat(table_name, ".*");
                    return [4 /*yield*/, db_interface.query("SELECT ".concat(fields, " FROM ").concat(table_name, " WHERE id = $1 ").concat(rest_of_query), [id])];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function get_generic(table_name, db_interface, rest_of_query, args, filter) {
    if (rest_of_query === void 0) { rest_of_query = ""; }
    return __awaiter(this, void 0, void 0, function () {
        var fields;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fields = (filter === null || filter === void 0 ? void 0 : filter.func(filter === null || filter === void 0 ? void 0 : filter.args)) || "".concat(table_name, ".*");
                    return [4 /*yield*/, db_interface.query("SELECT ".concat(fields, " FROM ").concat(table_name, " ").concat(rest_of_query), args)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function insert_values(table_name, db_interface, is_admin, data) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, fields, placeholder_sequence, values;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!is_admin)
                        return [2 /*return*/, error_codes.Unauthorized(table_name)];
                    if (!DB_interface_1.req_types.body_validators[table_name](data))
                        return [2 /*return*/, error_codes.Invalid_body(table_name)];
                    _a = DB_interface_1.req_types.get_fields(table_name, Object.keys(data), 2), fields = _a[0], placeholder_sequence = _a[1];
                    values = DB_interface_1.req_types.extract_values_of_fields(data, fields);
                    return [4 /*yield*/, db_interface.query("\n        INSERT INTO ".concat(table_name, " (").concat(fields, ") VALUES (").concat(placeholder_sequence, ")\n        RETURNING id;"), values)];
                case 1: return [2 /*return*/, _b.sent()];
            }
        });
    });
}
function update_values(table_name, db_interface, is_admin, data, id) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, fields, placeholder_sequence, values, result, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!is_admin)
                        return [2 /*return*/, error_codes.Unauthorized(table_name)];
                    if (!id)
                        return [2 /*return*/, error_codes.No_referenced_item(table_name)];
                    if (!DB_interface_1.req_types.body_validators[table_name](data))
                        error_codes.Invalid_body(table_name);
                    _a = DB_interface_1.req_types.get_fields(table_name, Object.keys(data), 2, true), fields = _a[0], placeholder_sequence = _a[1];
                    if (fields.length === 0)
                        return [2 /*return*/, error_codes.Invalid_body(table_name)];
                    values = DB_interface_1.req_types.extract_values_of_fields(data, fields);
                    if (!(fields.length > 1)) return [3 /*break*/, 2];
                    return [4 /*yield*/, db_interface.query("\n            UPDATE ".concat(table_name, " SET (").concat(fields, ") = (").concat(placeholder_sequence, ")\n            WHERE id = $1\n            RETURNING *;"), __spreadArray([id], values, true))];
                case 1:
                    _b = _c.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, db_interface.query("\n            UPDATE ".concat(table_name, " SET ").concat(fields, " = $2\n            WHERE id = $1\n            RETURNING *;"), __spreadArray([id], values, true))];
                case 3:
                    _b = _c.sent();
                    _c.label = 4;
                case 4:
                    result = _b;
                    if (typeof result !== "string")
                        return [2 /*return*/, result[0].rowCount === 0 ? // Check if a row was affected
                                error_codes.No_row_affected(table_name) :
                                result];
                    return [2 /*return*/, result];
            }
        });
    });
}
function delete_values(table_name, db_interface, is_admin, id) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!is_admin)
                        return [2 /*return*/, error_codes.Unauthorized(table_name)];
                    if (!id)
                        return [2 /*return*/, error_codes.No_referenced_item(table_name)];
                    return [4 /*yield*/, db_interface.query("\n        DELETE FROM ".concat(table_name, "\n        WHERE id = $1\n        RETURNING id;"), [id])];
                case 1:
                    result = _a.sent();
                    if (typeof result !== "string")
                        return [2 /*return*/, result[0].rowCount === 0 ? // Check if a row was affected
                                error_codes.No_row_affected(table_name) :
                                result];
                    return [2 /*return*/, result];
            }
        });
    });
}
var table = {
    create: create_table,
    "delete": delete_table,
    schema: get_schema
};
exports.table = table;
var values = {
    insert: insert_values,
    update: update_values,
    "delete": delete_values,
    get: {
        all: get_all_values,
        single: get_single_value,
        generic: get_generic
    }
};
exports.values = values;
function validate_rating(req) {
    var operator = req.query.operator.toUpperCase();
    var rating = req.query.rating === "NULL" ?
        "NULL" :
        parseInt(req.query.rating);
    if (!operator || !rating)
        return { valid: false, operator: operator, rating: rating };
    var valid = (rating === "NULL" && ["IS NULL", "IS NOT NULL"].includes(operator)) || (["=", "!=", ">", "<", ">=", "<="].includes(operator) && rating >= 0 && rating <= 5);
    return { valid: valid, operator: operator, rating: rating };
}
exports.validate_rating = validate_rating;
