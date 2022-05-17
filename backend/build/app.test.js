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
jest.setTimeout(30000);
var utils_1 = require("./logic/tables/utils");
// describe("Top Level routes tests", () => {
//     // SETUP
//     const request = supertest(app);
//     app.locals.DEFAULT_DB_INTERFACE = new DB_interface({
//         connectionString: get_db_uri()
//     }, true);
//     //Tests
//     it("/", async() => {
//         const response = await request.get("/");
//         expect(response.status).toBe(200);
//         expect(response.body).toEqual({status: "Running"});
//     });
//     it("/not_real_endpoint", async() => {
//         const response = await request.get("/not_real_endpoint");
//         expect(response.status).toBe(404);
//         expect(response.body).toEqual({error: "Method not found"});
//     });
//     describe("/reconnect_db", () => {
//         it("Reconnect with open connection", async () => {
//             const response = await request.get("/reconnect_db");
//             expect(response.status).toBe(200);
//             expect(response.body).toEqual({status: "Already connected"});
//         });
//         it("Reconnect with closed connection", async () => {
//             app.locals.DEFAULT_DB_INTERFACE.close();
//             const response = await request.get("/reconnect_db");
//             expect(response.status).toBe(200);
//             expect(response.body).toEqual({status: "Connected"});
//         });
//         it("Reconnect with never opened connection", async () => {
//             app.locals.DEFAULT_DB_INTERFACE = null;
//             const response = await request.get("/reconnect_db");
//             expect(response.status).toBe(200);
//             expect(response.body).toEqual({status: "Connected"});
//         });
//     });
//     describe("Test first-level middleware", () => {
//         it("No database connection", async () => {
//             app.locals.DEFAULT_DB_INTERFACE.close();
//             const response = await request.get("/");
//             expect(response.status).toBe(500);
//             expect(response.body).toEqual({error: "Not connected"});
//         });
//         it("No database interface", async () => {
//             app.locals.DEFAULT_DB_INTERFACE = null;
//             const response = await request.get("/");
//             expect(response.status).toBe(500);
//             expect(response.body).toEqual({error: "No interface"});
//         });
//     });
//     afterAll(() => {
//         app.locals.DEFAULT_DB_INTERFACE?.close();
//     });
// });
describe("Benchmarks tests", function () {
    // SETUP
    var request = (0, supertest_1["default"])(app_1.app);
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        var db_interface, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    db_interface = new DB_interface_1.DB_interface({
                        connectionString: (0, DB_interface_1.get_db_uri)()
                    }, true);
                    app_1.app.locals.DEFAULT_DB_INTERFACE = new DB_interface_1.DB_interface({
                        connectionString: (0, DB_interface_1.get_db_uri)()
                    }, true);
                    return [4 /*yield*/, utils_1.table.create("continents", db_interface, true)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, utils_1.table.create("countries", db_interface, true)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, utils_1.table.create("cities", db_interface, true)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, utils_1.table.create("monuments", db_interface, true)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, utils_1.table.create("languages", db_interface, true)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, utils_1.table.create("users", db_interface, true)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, utils_1.table.create("visits", db_interface, true)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, utils_1.table.create("types_of_monuments", db_interface, true)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, utils_1.table.create("monument_types", db_interface, true)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, request.post("/continents/insert_continents").set("Authorization", "1")];
                case 10:
                    res = _a.sent();
                    // Country
                    return [4 /*yield*/, utils_1.values.insert("countries", db_interface, true, {
                            real_name: "Italia",
                            it_name: "Italia",
                            en_name: "Italy",
                            iso_alpha_3: "ITA",
                            fk_continent_id: 0
                        })];
                case 11:
                    // Country
                    _a.sent();
                    return [4 /*yield*/, utils_1.values.insert("countries", db_interface, true, {
                            real_name: "Polska",
                            it_name: "Polonia",
                            en_name: "Poland",
                            iso_alpha_3: "POL",
                            fk_continent_id: 0
                        })];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, utils_1.values.insert("countries", db_interface, true, {
                            real_name: "United States of America",
                            it_name: "Stati Uniti d'America",
                            en_name: "United States of America",
                            iso_alpha_3: "USA",
                            fk_continent_id: 2
                        })];
                case 13:
                    _a.sent();
                    // City
                    return [4 /*yield*/, utils_1.values.insert("cities", db_interface, true, {
                            real_name: "Roma",
                            it_name: "Roma",
                            en_name: "Rome",
                            fk_country_id: 1
                        })];
                case 14:
                    // City
                    _a.sent();
                    return [4 /*yield*/, utils_1.values.insert("cities", db_interface, true, {
                            real_name: "Milano",
                            it_name: "Milano",
                            en_name: "Milan",
                            fk_country_id: 1
                        })];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, utils_1.values.insert("cities", db_interface, true, {
                            real_name: "Kraków",
                            it_name: "Cracovia",
                            en_name: "Krakow",
                            fk_country_id: 2
                        })];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, utils_1.values.insert("cities", db_interface, true, {
                            real_name: "New York",
                            it_name: "New York",
                            en_name: "New York",
                            fk_country_id: 3
                        })];
                case 17:
                    _a.sent();
                    // Monument
                    return [4 /*yield*/, utils_1.values.insert("monuments", db_interface, true, {
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
                    return [4 /*yield*/, utils_1.values.insert("monuments", db_interface, true, {
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
                    return [4 /*yield*/, utils_1.values.insert("monuments", db_interface, true, {
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
                    return [4 /*yield*/, utils_1.values.insert("monuments", db_interface, true, {
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
                    return [4 /*yield*/, utils_1.values.insert("monuments", db_interface, true, {
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
                    // Language
                    return [4 /*yield*/, utils_1.values.insert("languages", db_interface, true, {
                            name: "English",
                            abbreviation: "EN"
                        })];
                case 23:
                    // Language
                    _a.sent();
                    // User
                    return [4 /*yield*/, utils_1.values.insert("users", db_interface, true, {
                            id: 2,
                            fk_language_id: 1
                        })];
                case 24:
                    // User
                    _a.sent();
                    // Visit
                    return [4 /*yield*/, utils_1.values.insert("visits", db_interface, true, {
                            rating: 3,
                            private_description: "Visita molto bella",
                            date_time: "2020-01-01",
                            fk_user_id: 2,
                            fk_monument_id: 1
                        })];
                case 25:
                    // Visit
                    _a.sent();
                    return [4 /*yield*/, utils_1.values.insert("visits", db_interface, true, {
                            rating: 4,
                            private_description: "Visita molto bella",
                            date_time: "2021-01-01",
                            fk_user_id: 2,
                            fk_monument_id: 2
                        })];
                case 26:
                    _a.sent();
                    return [4 /*yield*/, utils_1.values.insert("visits", db_interface, true, {
                            rating: 5,
                            private_description: "Visita molto bella",
                            date_time: "2022-01-01",
                            fk_user_id: 2,
                            fk_monument_id: 3
                        })];
                case 27:
                    _a.sent();
                    // types_of_monuments
                    return [4 /*yield*/, utils_1.values.insert("types_of_monuments", db_interface, true, {
                            real_name: "Museo",
                            it_name: "Museo",
                            en_name: "Museum",
                            it_description: "Museo di storia",
                            en_description: "History museum"
                        })];
                case 28:
                    // types_of_monuments
                    _a.sent();
                    return [4 /*yield*/, utils_1.values.insert("types_of_monuments", db_interface, true, {
                            real_name: "Palace",
                            it_name: "Palazzo",
                            en_name: "Palace",
                            it_description: "Palazzo di storia",
                            en_description: "History palace"
                        })];
                case 29:
                    _a.sent();
                    // monuments_types
                    return [4 /*yield*/, utils_1.values.insert("monument_types", db_interface, true, {
                            fk_type_id: 1,
                            fk_monument_id: 1
                        })];
                case 30:
                    // monuments_types
                    _a.sent();
                    return [4 /*yield*/, utils_1.values.insert("monument_types", db_interface, true, {
                            fk_type_id: 2,
                            fk_monument_id: 1
                        })];
                case 31:
                    _a.sent();
                    return [4 /*yield*/, utils_1.values.insert("monument_types", db_interface, true, {
                            fk_type_id: 1,
                            fk_monument_id: 2
                        })];
                case 32:
                    _a.sent();
                    db_interface.close();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        var db_interface;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    db_interface = new DB_interface_1.DB_interface({
                        connectionString: (0, DB_interface_1.get_db_uri)()
                    }, true);
                    return [4 /*yield*/, utils_1.table["delete"]("monument_types", db_interface, true)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, utils_1.table["delete"]("types_of_monuments", db_interface, true)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, utils_1.table["delete"]("visits", db_interface, true)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, utils_1.table["delete"]("monuments", db_interface, true)];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, utils_1.table["delete"]("cities", db_interface, true)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, utils_1.table["delete"]("users", db_interface, true)];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, utils_1.table["delete"]("languages", db_interface, true)];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, utils_1.table["delete"]("countries", db_interface, true)];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, utils_1.table["delete"]("continents", db_interface, true)];
                case 9:
                    _b.sent();
                    db_interface.close();
                    (_a = app_1.app.locals.DEFAULT_DB_INTERFACE) === null || _a === void 0 ? void 0 : _a.close();
                    return [2 /*return*/];
            }
        });
    }); });
    describe("Specific api tests", function () {
        describe("Get monuments in specified cities", function () {
            it("Cities that are in the DB", function () { return __awaiter(void 0, void 0, void 0, function () {
                var cities_id, monuments_name, response, i, monument;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cities_id = [1, 2];
                            monuments_name = ["Colosseo", "Piazza di Spagna", "Duomo"];
                            return [4 /*yield*/, request.get("/monuments/monuments_in_cities?ids=".concat(cities_id.join(",")))];
                        case 1:
                            response = _a.sent();
                            expect(response.status).toBe(200);
                            response.body = response.body[0];
                            expect(response.body.length).toBe(3);
                            for (i = 0; i < response.body.length; i++) {
                                monument = response.body[i];
                                expect(cities_id).toContain(monument.monuments_fk_city_id);
                                expect(monuments_name).toContain(monument.monuments_real_name);
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
            it("Cities not present in the DB", function () { return __awaiter(void 0, void 0, void 0, function () {
                var cities_id, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cities_id = [10];
                            return [4 /*yield*/, request.get("/monuments/monuments_in_cities?ids=".concat(cities_id.join(",")))];
                        case 1:
                            response = _a.sent();
                            expect(response.status).toBe(200);
                            response.body = response.body[0];
                            expect(response.body.length).toBe(0);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("No cities passed", function () { return __awaiter(void 0, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, request.get("/monuments/monuments_in_cities")];
                        case 1:
                            response = _a.sent();
                            expect(response.status).toBe(400);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
});
