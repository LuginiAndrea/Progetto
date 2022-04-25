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
exports.get_db_uri = exports.req_types = exports.DB_interface = void 0;
var pg_1 = require("pg");
var req_types = __importStar(require("./types"));
exports.req_types = req_types;
var utils_1 = require("./utils");
exports.get_db_uri = utils_1.get_db_uri;
var DB_interface = /** @class */ (function () {
    function DB_interface(credentials, connect) {
        if (connect === void 0) { connect = true; }
        this.pool = null;
        this.credentials = credentials;
        if (connect)
            this.connect();
    }
    DB_interface.prototype.connect = function () {
        if (this.connected())
            return true; //if it is already connected do nothing
        try {
            this.pool = new pg_1.Pool(__assign(__assign({}, this.credentials), { ssl: {
                    rejectUnauthorized: false
                } })); //Connects to the DB
        }
        catch (error) {
            console.log(error);
            throw error;
        }
        finally {
            return this.connected();
        }
    };
    DB_interface.prototype.query = function (query, params, close_connection) {
        if (close_connection === void 0) { close_connection = true; }
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.pool) return [3 /*break*/, 1];
                        return [2 /*return*/, {
                                error: "i_0"
                            }];
                    case 1:
                        _b.trys.push([1, 3, 4, 5]);
                        _a = {};
                        return [4 /*yield*/, this.pool.query(query, params)];
                    case 2: return [2 /*return*/, (_a.result = [_b.sent()],
                            _a)];
                    case 3:
                        error_1 = _b.sent();
                        console.log("On query ".concat(query, ":\n ").concat(error_1, ": ").concat(error_1.code));
                        return [2 /*return*/, {
                                error: error_1.code
                            }];
                    case 4:
                        if (close_connection)
                            this.close();
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DB_interface.prototype.transiction = function (queries, params, close_connection) {
        if (close_connection === void 0) { close_connection = true; }
        return __awaiter(this, void 0, void 0, function () {
            var result, i, _a, _b, error_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!this.pool) { //If the connection is not open return error code
                            return [2 /*return*/, {
                                    error: "i_0"
                                }];
                        }
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 8, 10, 11]);
                        result = [];
                        return [4 /*yield*/, this.pool.query('BEGIN')];
                    case 2:
                        _c.sent();
                        i = 0;
                        _c.label = 3;
                    case 3:
                        if (!(i < queries.length)) return [3 /*break*/, 6];
                        _b = (_a = result).push;
                        return [4 /*yield*/, this.pool.query(queries[i], params[i])];
                    case 4:
                        _b.apply(_a, [_c.sent()]);
                        _c.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 3];
                    case 6: return [4 /*yield*/, this.pool.query('COMMIT')];
                    case 7:
                        _c.sent();
                        return [2 /*return*/, {
                                result: result
                            }];
                    case 8:
                        error_2 = _c.sent();
                        console.log("On transiction:\n ".concat(error_2, ": ").concat(error_2.code));
                        return [4 /*yield*/, this.pool.query('ROLLBACK')];
                    case 9:
                        _c.sent();
                        return [2 /*return*/, {
                                error: error_2.code
                            }];
                    case 10:
                        if (close_connection)
                            this.close();
                        return [7 /*endfinally*/];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    DB_interface.prototype.connected = function () {
        return this.pool !== null;
    };
    DB_interface.prototype.close = function () {
        if (this.pool)
            this.pool.end();
        this.pool = null;
    };
    return DB_interface;
}());
exports.DB_interface = DB_interface;
