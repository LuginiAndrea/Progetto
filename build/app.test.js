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
jest.setTimeout(50000);
var utils_1 = require("./logic/tables/utils");
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
                    return [4 /*yield*/, request.post("/continents/insert").set("Authorization", "1")];
                case 10:
                    res = _a.sent();
                    return [4 /*yield*/, utils_1.values.insert("countries", db_interface, true, [
                            {
                                real_name: "Italia",
                                it_name: "Italia",
                                en_name: "Italy",
                                iso_alpha_3: "ITA",
                                fk_continent_id: 0
                            },
                            {
                                real_name: "Polska",
                                it_name: "Polonia",
                                en_name: "Poland",
                                iso_alpha_3: "POL",
                                fk_continent_id: 0
                            },
                            {
                                real_name: "United States of America",
                                it_name: "Stati Uniti d'America",
                                en_name: "United States of America",
                                iso_alpha_3: "USA",
                                fk_continent_id: 2
                            }
                        ])];
                case 11:
                    _a.sent();
                    // City
                    return [4 /*yield*/, utils_1.values.insert("cities", db_interface, true, [
                            {
                                real_name: "Roma",
                                it_name: "Roma",
                                en_name: "Rome",
                                fk_country_id: 1
                            },
                            {
                                real_name: "Milano",
                                it_name: "Milano",
                                en_name: "Milan",
                                fk_country_id: 1
                            },
                            {
                                real_name: "Krak??w",
                                it_name: "Cracovia",
                                en_name: "Krakow",
                                fk_country_id: 2
                            },
                            {
                                real_name: "New York",
                                it_name: "New York",
                                en_name: "New York",
                                fk_country_id: 3
                            }
                        ])];
                case 12:
                    // City
                    _a.sent();
                    // Monument
                    return [4 /*yield*/, utils_1.values.insert("monuments", db_interface, true, [
                            {
                                real_name: "Colosseo",
                                it_name: "Colosseo",
                                en_name: "Colosseum",
                                coordinates: "SRID=4326;POINT(12.4877369 41.8906032)",
                                it_description: "Il monumento pi?? bello del mondo",
                                en_description: "The most beautiful monument in the world",
                                fk_city_id: 1
                            },
                            {
                                real_name: "Piazza di Spagna",
                                it_name: "Piazza di Spagna",
                                en_name: "Piazza di Spagna",
                                coordinates: "SRID=4326;POINT(12.4803623 41.9058439)",
                                it_description: "Il secondo monumento pi?? bello del mondo",
                                en_description: "The second most beautiful monument in the world",
                                fk_city_id: 1
                            },
                            {
                                real_name: "Barcaccia",
                                it_name: "Barcaccia",
                                en_name: "Barcaccia",
                                coordinates: "SRID=4326;POINT(12.4903623 41.9258439)",
                                it_description: "Il quarto monumento pi?? bello del mondo",
                                en_description: "The second most beautiful monument in the world",
                                fk_city_id: 1
                            },
                            {
                                real_name: "Duomo",
                                it_name: "Duomo",
                                en_name: "Duomo",
                                coordinates: "SRID=4326;POINT(31.491667 14.891944)",
                                it_description: "Il terzo monumento pi?? bello del mondo",
                                en_description: "The third most beautiful monument in the world",
                                fk_city_id: 2
                            },
                            {
                                real_name: "Monumento Polacco",
                                it_name: "Monumento Polacco",
                                en_name: "Polish monument",
                                coordinates: "SRID=4326;POINT(5.491667 41.891944)",
                                it_description: "Il quarto monumento pi?? bello del mondo",
                                en_description: "The fourth most beautiful monument in the world",
                                fk_city_id: 3
                            },
                            {
                                real_name: "Monumento USA",
                                it_name: "Monumento USA",
                                en_name: "American monument",
                                coordinates: "SRID=4326;POINT(56.491667 41.891944)",
                                it_description: "Il quinto monumento pi?? bello del mondo",
                                en_description: "The fifth most beautiful monument in the world",
                                fk_city_id: 4
                            }
                        ])];
                case 13:
                    // Monument
                    _a.sent();
                    // Language
                    return [4 /*yield*/, utils_1.values.insert("languages", db_interface, true, {
                            name: "English",
                            abbreviation: "EN"
                        })];
                case 14:
                    // Language
                    _a.sent();
                    // User
                    return [4 /*yield*/, utils_1.values.insert("users", db_interface, true, {
                            id: 2,
                            fk_language_id: 1
                        })];
                case 15:
                    // User
                    _a.sent();
                    return [4 /*yield*/, utils_1.values.insert("users", db_interface, true, {
                            id: 3,
                            fk_language_id: 1
                        })];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, utils_1.values.insert("users", db_interface, true, {
                            id: 4,
                            fk_language_id: 1
                        })];
                case 17:
                    _a.sent();
                    // Visit
                    return [4 /*yield*/, utils_1.values.insert("visits", db_interface, true, [
                            {
                                rating: 3,
                                private_description: "Visita molto bella",
                                date_time: "2020-01-01",
                                fk_user_id: 2,
                                fk_monument_id: 1 //Colosseo
                            },
                            {
                                rating: 2,
                                private_description: "Visita molto bella",
                                date_time: "2021-01-01",
                                fk_user_id: 2,
                                fk_monument_id: 2 //Piazza di spagna
                            },
                            {
                                rating: 4,
                                private_description: "Visita molto bella",
                                date_time: "2022-01-01",
                                fk_user_id: 4,
                                fk_monument_id: 3 //Barcaccia
                            },
                            {
                                rating: 4,
                                private_description: "Visita molto bella",
                                date_time: "2022-01-01",
                                fk_user_id: 3,
                                fk_monument_id: 3 //Barcaccia
                            },
                            {
                                rating: 5,
                                private_description: "Visita molto bella",
                                date_time: "2022-01-01",
                                fk_user_id: 3,
                                fk_monument_id: 4 //Duomo
                            },
                            {
                                rating: 5,
                                private_description: "Visita molto bella",
                                date_time: "2022-01-01",
                                fk_user_id: 3,
                                fk_monument_id: 5 //Polacco
                            },
                            {
                                rating: 5,
                                private_description: "Visita molto bella",
                                date_time: "2022-01-01",
                                fk_user_id: 4,
                                fk_monument_id: 5 //Polacco
                            }
                        ])];
                case 18:
                    // Visit
                    _a.sent();
                    // types_of_monuments
                    return [4 /*yield*/, utils_1.values.insert("types_of_monuments", db_interface, true, {
                            real_name: "Museo",
                            it_name: "Museo",
                            en_name: "Museum",
                            it_description: "Museo di storia",
                            en_description: "History museum"
                        })];
                case 19:
                    // types_of_monuments
                    _a.sent();
                    return [4 /*yield*/, utils_1.values.insert("types_of_monuments", db_interface, true, {
                            real_name: "Palace",
                            it_name: "Palazzo",
                            en_name: "Palace",
                            it_description: "Palazzo di storia",
                            en_description: "History palace"
                        })];
                case 20:
                    _a.sent();
                    return [4 /*yield*/, utils_1.values.insert("types_of_monuments", db_interface, true, {
                            real_name: "Castle",
                            it_name: "Castello",
                            en_name: "Castle",
                            it_description: "Castello di storia",
                            en_description: "History castle"
                        })];
                case 21:
                    _a.sent();
                    // monuments_types
                    return [4 /*yield*/, utils_1.values.insert("monument_types", db_interface, true, {
                            fk_type_id: 1,
                            fk_monument_id: 1 //Colosseo
                        })];
                case 22:
                    // monuments_types
                    _a.sent();
                    return [4 /*yield*/, utils_1.values.insert("monument_types", db_interface, true, {
                            fk_type_id: 2,
                            fk_monument_id: 1 //Colosseo
                        })];
                case 23:
                    _a.sent();
                    return [4 /*yield*/, utils_1.values.insert("monument_types", db_interface, true, {
                            fk_type_id: 1,
                            fk_monument_id: 2 //Piazza di spagna
                        })];
                case 24:
                    _a.sent();
                    return [4 /*yield*/, utils_1.values.insert("monument_types", db_interface, true, {
                            fk_type_id: 2,
                            fk_monument_id: 3 //Barcaccia
                        })];
                case 25:
                    _a.sent();
                    return [4 /*yield*/, utils_1.values.insert("monument_types", db_interface, true, {
                            fk_type_id: 1,
                            fk_monument_id: 4 //Duomo
                        })];
                case 26:
                    _a.sent();
                    return [4 /*yield*/, utils_1.values.insert("monument_types", db_interface, true, {
                            fk_type_id: 3,
                            fk_monument_id: 4 //Polacco
                        })];
                case 27:
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
        // describe("Get monuments in specified cities", () => {
        //     it("Cities that are in the DB", async () => { 
        //         const cities_id = [1, 2];
        //         const monuments_name = ["Colosseo", "Piazza di Spagna", "Duomo"];
        //         const response = await request.get(`/monuments/monuments_in_cities?ids=${cities_id.join(",")}`);
        //         expect(response.status).toBe(200);
        //         response.body = response.body[0];
        //         expect(response.body.length).toBe(3);
        //         for (let i = 0; i < response.body.length; i++) {
        //             const monument = response.body[i];
        //             expect(cities_id).toContain(monument.monuments_fk_city_id);
        //             expect(monuments_name).toContain(monument.monuments_real_name);
        //         }
        //     });
        //     it("Cities not present in the DB", async () => {
        //         const cities_id = [10];
        //         const response = await request.get(`/monuments/monuments_in_cities?ids=${cities_id.join(",")}`);
        //         expect(response.status).toBe(200);
        //         response.body = response.body[0];
        //         expect(response.body.length).toBe(0);
        //     });
        //     it("No cities passed", async () => {
        //         const response = await request.get(`/monuments/monuments_in_cities`);
        //         expect(response.status).toBe(400);
        //     });
        // });
        // describe("Markers", () => {
        //     it("Markers by distance", async () => {
        //         const distance = 3000;
        //         const latitude = 41.8981325;
        //         const longitude = 12.4785729;
        //         const response = await request.get(`/monuments/markers_by_distance?distance=${distance}&latitude=${latitude}&longitude=${longitude}`);
        //         expect(response.status).toBe(200);
        //         response.body = response.body[0];
        //         expect(response.body.length).toBe(2);
        //         expect(response.body[0].real_name).toBe("Piazza di Spagna");
        //         expect(response.body[1].real_name).toBe("Colosseo");
        //     });
        // });
        describe("Monuments", function () {
            it("Visited monument", function () { return __awaiter(void 0, void 0, void 0, function () {
                var id, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            id = 1;
                            return [4 /*yield*/, request.get("/monuments/filter_by_id?ids=".concat(id)).set("Authorization", "2")];
                        case 1:
                            response = _a.sent();
                            expect(response.status).toBe(200);
                            console.dir(response.body, { depth: null });
                            return [2 /*return*/];
                    }
                });
            }); });
            it("By types", function () { return __awaiter(void 0, void 0, void 0, function () {
                var types, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            types = 2;
                            return [4 /*yield*/, request.get("/monuments/filter_by_types?ids=".concat(types))];
                        case 1:
                            response = _a.sent();
                            expect(response.status).toBe(200);
                            console.dir(response.body, { depth: null });
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe("Visits", function () {
            it("Get visits", function () { return __awaiter(void 0, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, request.get("/visits/filter_by_single_user").set("Authorization", "2")];
                        case 1:
                            response = _a.sent();
                            expect(response.status).toBe(200);
                            console.dir(response.body, { depth: null });
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe("Reccomendations", function () {
            it("Get reccomendations", function () { return __awaiter(void 0, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, request.get("/monuments/discover").set("Authorization", "2")];
                        case 1:
                            response = _a.sent();
                            expect(response.status).toBe(200);
                            console.dir(response.body, { depth: null });
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
});
