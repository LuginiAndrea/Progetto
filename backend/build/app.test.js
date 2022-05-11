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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var app_1 = require("./app");
var DB_interface_1 = require("./logic/db_interface/DB_interface");
var supertest_1 = __importDefault(require("supertest"));
var utils_1 = require("./logic/tables/utils");
describe("Top Level routes tests", function () {
    // SETUP
    var request = (0, supertest_1["default"])(app_1.app);
    app_1.app.locals.DEFAULT_DB_INTERFACE = new DB_interface_1.DB_interface({
        connectionString: (0, DB_interface_1.get_db_uri)()
    }, true);
    //Tests
    it("/", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, request.get("/")];
                case 1:
                    response = _a.sent();
                    expect(response.status).toBe(200);
                    expect(response.body).toEqual({ status: "Running" });
                    return [2 /*return*/];
            }
        });
    }); });
    it("/not_real_endpoint", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, request.get("/not_real_endpoint")];
                case 1:
                    response = _a.sent();
                    expect(response.status).toBe(404);
                    expect(response.body).toEqual({ error: "Method not found" });
                    return [2 /*return*/];
            }
        });
    }); });
    describe("/reconnect_db", function () {
        it("Reconnect with open connection", function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request.get("/reconnect_db")];
                    case 1:
                        response = _a.sent();
                        expect(response.status).toBe(200);
                        expect(response.body).toEqual({ status: "Already connected" });
                        return [2 /*return*/];
                }
            });
        }); });
        it("Reconnect with closed connection", function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        app_1.app.locals.DEFAULT_DB_INTERFACE.close();
                        return [4 /*yield*/, request.get("/reconnect_db")];
                    case 1:
                        response = _a.sent();
                        expect(response.status).toBe(200);
                        expect(response.body).toEqual({ status: "Connected" });
                        return [2 /*return*/];
                }
            });
        }); });
        it("Reconnect with never opened connection", function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        app_1.app.locals.DEFAULT_DB_INTERFACE = null;
                        return [4 /*yield*/, request.get("/reconnect_db")];
                    case 1:
                        response = _a.sent();
                        expect(response.status).toBe(200);
                        expect(response.body).toEqual({ status: "Connected" });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("Test first-level middleware", function () {
        it("No database connection", function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        app_1.app.locals.DEFAULT_DB_INTERFACE.close();
                        return [4 /*yield*/, request.get("/")];
                    case 1:
                        response = _a.sent();
                        expect(response.status).toBe(500);
                        expect(response.body).toEqual({ error: "Not connected" });
                        return [2 /*return*/];
                }
            });
        }); });
        it("No database interface", function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        app_1.app.locals.DEFAULT_DB_INTERFACE = null;
                        return [4 /*yield*/, request.get("/")];
                    case 1:
                        response = _a.sent();
                        expect(response.status).toBe(500);
                        expect(response.body).toEqual({ error: "No interface" });
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
describe("Benchmarks tests", function () {
    // SETUP
    var request = (0, supertest_1["default"])(app_1.app);
    app_1.app.locals.DEFAULT_DB_INTERFACE = new DB_interface_1.DB_interface({
        connectionString: (0, DB_interface_1.get_db_uri)()
    }, true);
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, utils_1.table.create("continents", app_1.app.locals.DEFAULT_DB_INTERFACE, true)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, utils_1.table.create("countries", app_1.app.locals.DEFAULT_DB_INTERFACE, true)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, utils_1.table.create("cities", app_1.app.locals.DEFAULT_DB_INTERFACE, true)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, utils_1.table.create("monuments", app_1.app.locals.DEFAULT_DB_INTERFACE, true)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, utils_1.table.create("languages", app_1.app.locals.DEFAULT_DB_INTERFACE, true)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, utils_1.table.create("users", app_1.app.locals.DEFAULT_DB_INTERFACE, true)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, utils_1.table.create("visits", app_1.app.locals.DEFAULT_DB_INTERFACE, true)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, utils_1.table.create("monument_types", app_1.app.locals.DEFAULT_DB_INTERFACE, true)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, utils_1.table.create("types_of_monuments", app_1.app.locals.DEFAULT_DB_INTERFACE, true)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, request.post("/continents/insert_continents").set("Authorization", "1")];
                case 10:
                    _a.sent();
                    // Country
                    return [4 /*yield*/, utils_1.values.insert("countries", app_1.app.locals.DEFAULT_DB_INTERFACE, true, {
                            real_name: "Italia",
                            it_name: "Italia",
                            en_name: "Italy",
                            iso_alpha_3: "ITA",
                            fk_continent_id: 0
                        })];
                case 11:
                    // Country
                    _a.sent();
                    return [4 /*yield*/, utils_1.values.insert("countries", app_1.app.locals.DEFAULT_DB_INTERFACE, true, {
                            real_name: "Polska",
                            it_name: "Polonia",
                            en_name: "Poland",
                            iso_alpha_3: "POL",
                            fk_continent_id: 0
                        })];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, utils_1.values.insert("countries", app_1.app.locals.DEFAULT_DB_INTERFACE, true, {
                            real_name: "United States of America",
                            it_name: "Stati Uniti d'America",
                            en_name: "United States of America",
                            iso_alpha_3: "USA",
                            fk_continent_id: 2
                        })];
                case 13:
                    _a.sent();
                    // City
                    return [4 /*yield*/, utils_1.values.insert("cities", app_1.app.locals.DEFAULT_DB_INTERFACE, true, {
                            real_name: "Roma",
                            it_name: "Roma",
                            en_name: "Rome",
                            fk_country_id: 1
                        })];
                case 14:
                    // City
                    _a.sent();
                    return [4 /*yield*/, utils_1.values.insert("cities", app_1.app.locals.DEFAULT_DB_INTERFACE, true, {
                            real_name: "Milano",
                            it_name: "Milano",
                            en_name: "Milan",
                            fk_country_id: 1
                        })];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, utils_1.values.insert("cities", app_1.app.locals.DEFAULT_DB_INTERFACE, true, {
                            real_name: "Kraków",
                            it_name: "Cracovia",
                            en_name: "Krakow",
                            fk_country_id: 2
                        })];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, utils_1.values.insert("cities", app_1.app.locals.DEFAULT_DB_INTERFACE, true, {
                            real_name: "New York",
                            it_name: "New York",
                            en_name: "New York",
                            fk_country_id: 3
                        })];
                case 17:
                    _a.sent();
                    // Monument
                    return [4 /*yield*/, utils_1.values.insert("monuments", app_1.app.locals.DEFAULT_DB_INTERFACE, true, {
                            real_name: "Colosseo",
                            it_name: "Colosseo",
                            en_name: "Colosseum",
                            coordinates: "SRID=4326;POINT(10.491667 41.891944)",
                            it_description: "Il monumento più bello del mondo",
                            en_description: "The most beautiful monument in the world",
                            fk_city_id: 1
                        })];
                case 18:
                    // Monument
                    _a.sent();
                    return [4 /*yield*/, utils_1.values.insert("monuments", app_1.app.locals.DEFAULT_DB_INTERFACE, true, {
                            real_name: "Piazza di Spagna",
                            it_name: "Piazza di Spagna",
                            en_name: "Piazza di Spagna",
                            coordinates: "SRID=4326;POINT(11.491667 41.891944)",
                            it_description: "Il secondo monumento più bello del mondo",
                            en_description: "The second most beautiful monument in the world",
                            fk_city_id: 1
                        })];
                case 19:
                    _a.sent();
                    return [4 /*yield*/, utils_1.values.insert("monuments", app_1.app.locals.DEFAULT_DB_INTERFACE, true, {
                            real_name: "Duomo",
                            it_name: "Duomo",
                            en_name: "Duomo",
                            coordinates: "SRID=4326;POINT(45.491667 14.891944)",
                            it_description: "Il terzo monumento più bello del mondo",
                            en_description: "The third most beautiful monument in the world",
                            fk_city_id: 2
                        })];
                case 20:
                    _a.sent();
                    return [4 /*yield*/, utils_1.values.insert("monuments", app_1.app.locals.DEFAULT_DB_INTERFACE, true, {
                            real_name: "Monumento Polacco",
                            it_name: "Monumento Polacco",
                            en_name: "Polish monument",
                            coordinates: "SRID=4326;POINT(15.491667 41.891944)",
                            it_description: "Il quarto monumento più bello del mondo",
                            en_description: "The fourth most beautiful monument in the world",
                            fk_city_id: 3
                        })];
                case 21:
                    _a.sent();
                    return [4 /*yield*/, utils_1.values.insert("monuments", app_1.app.locals.DEFAULT_DB_INTERFACE, true, {
                            real_name: "Monumento USA",
                            it_name: "Monumento USA",
                            en_name: "American monument",
                            coordinates: "SRID=4326;POINT(23.491667 41.891944)",
                            it_description: "Il quinto monumento più bello del mondo",
                            en_description: "The fifth most beautiful monument in the world",
                            fk_city_id: 4
                        })];
                case 22:
                    _a.sent();
                    it("Monuments by city", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, request.get("/")];
                                case 1:
                                    response = _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    }); });
});
