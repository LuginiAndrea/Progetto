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
var utils_1 = require("../utils");
var utils_2 = require("../logic/tables/utils");
var users_router = (0, express_1.Router)();
var table_name = "users";
users_router.get("/routes", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var routes;
    return __generator(this, function (_a) {
        routes = [
            { method: "POST", path: "/create_table", body: "NO", is_admin: true },
            { method: "GET", path: "/table_schema", body: "NO", is_admin: true },
            { method: "DELETE", path: "/delete_table", body: "NO", is_admin: true },
            { method: "GET", path: "/all", body: "NO", is_admin: true },
            { method: "GET", path: "/filter_by_id", body: "Query_String", is_admin: true },
            { method: "GET", path: "/user", body: "NO", is_admin: false },
            { method: "GET", path: "/exists", body: "NO", is_admin: false },
            { method: "POST", path: "/insert", body: "JSON", is_admin: false },
            { method: "PUT", path: "/update/:id", body: "JSON", is_admin: false },
            { method: "DELETE", path: "/delete/:id", body: "NO", is_admin: false },
        ];
        res.status(200).json(res.locals.is_admin ? routes : routes.filter(function (x) { return !x.is_admin; }));
        return [2 /*return*/];
    });
}); });
function authorize(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!res.locals.is_admin)
                (0, utils_1.send_json)(res, utils_2.error_codes.UNAUTHORIZED(table_name));
            else
                next();
            return [2 /*return*/];
        });
    });
}
;
users_router.post("/create_table", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = utils_1.send_json;
                _b = [res];
                return [4 /*yield*/, utils_2.table.create(table_name, res.locals.DB_INTERFACE, res.locals.is_admin)];
            case 1:
                _a.apply(void 0, _b.concat([_c.sent(), { success: 201 }]));
                return [2 /*return*/];
        }
    });
}); });
users_router["delete"]("/delete_table", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = utils_1.send_json;
                _b = [res];
                return [4 /*yield*/, utils_2.table["delete"](table_name, res.locals.DB_INTERFACE, res.locals.is_admin)];
            case 1:
                _a.apply(void 0, _b.concat([_c.sent()]));
                return [2 /*return*/];
        }
    });
}); });
users_router.get("/table_schema", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = utils_1.send_json;
                _b = [res];
                return [4 /*yield*/, utils_2.table.schema(table_name, res.locals.DB_INTERFACE)];
            case 1:
                _a.apply(void 0, _b.concat([_c.sent()]));
                return [2 /*return*/];
        }
    });
}); });
users_router.get("/all", authorize, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = utils_1.send_json;
                _b = [res];
                return [4 /*yield*/, utils_2.values.get.all(table_name, res.locals.DB_INTERFACE, "*", "ORDER BY id")];
            case 1:
                _a.apply(void 0, _b.concat([_c.sent()]));
                return [2 /*return*/];
        }
    });
}); });
users_router.get("/filter_by_id", authorize, utils_1.validate_ids, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = utils_1.send_json;
                _b = [res];
                return [4 /*yield*/, utils_2.values.get.by_id(table_name, res.locals.DB_INTERFACE, res.locals.ids)];
            case 1:
                _a.apply(void 0, _b.concat([_c.sent()]));
                return [2 /*return*/];
        }
    });
}); });
users_router.get("/user", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = utils_1.send_json;
                _b = [res];
                return [4 /*yield*/, utils_2.values.get.by_id(table_name, res.locals.DB_INTERFACE, [res.locals.UID])];
            case 1:
                _a.apply(void 0, _b.concat([_c.sent()]));
                return [2 /*return*/];
        }
    });
}); });
users_router.get("/exists", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, utils_2.values.get.by_id(table_name, res.locals.DB_INTERFACE, [res.locals.UID])];
            case 1:
                result = _a.sent();
                if (typeof result === "string")
                    (0, utils_1.send_json)(res, result);
                else
                    res.status(200).json({ exists: result[0].rowCount === 1 });
                return [2 /*return*/];
        }
    });
}); });
users_router.post("/insert", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = utils_1.send_json;
                _b = [res];
                return [4 /*yield*/, utils_2.values.insert(table_name, res.locals.DB_INTERFACE, true, __assign({ id: res.locals.UID }, req.body))];
            case 1:
                _a.apply(void 0, _b.concat([_c.sent(), { success: 201 }]));
                return [2 /*return*/];
        }
    });
}); });
users_router.put("/update/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = utils_1.send_json;
                _b = [res];
                return [4 /*yield*/, utils_2.values.update(table_name, res.locals.DB_INTERFACE, true, req.body, res.locals.UID)];
            case 1:
                _a.apply(void 0, _b.concat([_c.sent()]));
                return [2 /*return*/];
        }
    });
}); });
users_router["delete"]("/delete/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = utils_1.send_json;
                _b = [res];
                return [4 /*yield*/, utils_2.values["delete"](table_name, res.locals.DB_INTERFACE, true, res.locals.UID)];
            case 1:
                _a.apply(void 0, _b.concat([_c.sent()]));
                return [2 /*return*/];
        }
    });
}); });
exports["default"] = users_router;
