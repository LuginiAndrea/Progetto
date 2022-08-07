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
exports.app = void 0;
require("dotenv/config");
var cors_1 = __importDefault(require("cors"));
var express_1 = __importDefault(require("express"));
var users_1 = __importDefault(require("./routes/users"));
var countries_1 = __importDefault(require("./routes/countries"));
var continents_1 = __importDefault(require("./routes/continents"));
var cities_1 = __importDefault(require("./routes/cities"));
var languages_1 = __importDefault(require("./routes/languages"));
var monuments_1 = __importDefault(require("./routes/monuments"));
var visits_1 = __importDefault(require("./routes/visits"));
var monument_types_1 = __importDefault(require("./routes/monument_types"));
var types_of_monuments_1 = __importDefault(require("./routes/types_of_monuments"));
var DB_interface_1 = require("./logic/db_interface/DB_interface");
var utils_1 = require("./logic/users/utils");
var body_parser_1 = __importDefault(require("body-parser"));
var utils_2 = require("./utils");
var utils_3 = require("./logic/tables/utils");
var app = (0, express_1["default"])();
exports.app = app;
app.use(DB_interface_1.validate_db_status);
app.use((0, cors_1["default"])());
// Authenticate user
app.use(body_parser_1["default"].json({ limit: '10mb' }));
app.use(utils_1.authenticate_user);
app.use("/languages", languages_1["default"]);
app.use("/countries", countries_1["default"]);
app.use("/users", users_1["default"]);
app.use("/continents", continents_1["default"]);
app.use("/cities", cities_1["default"]);
app.use("/monuments", monuments_1["default"]);
app.use("/visits", visits_1["default"]);
app.use("/monument_types", monument_types_1["default"]);
app.use("/types_of_monuments", types_of_monuments_1["default"]);
app.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.status(200).send({ status: "Running" });
        return [2 /*return*/];
    });
}); });
app.connect("/reconnect_db", function (req, res) {
    var not_valid_connection = !app.locals.DEFAULT_DB_INTERFACE || !app.locals.DEFAULT_DB_INTERFACE.connected();
    if (res.locals.is_admin) {
        if (not_valid_connection) {
            app.locals.DEFAULT_DB_INTERFACE = new DB_interface_1.DB_interface({
                connectionString: (0, DB_interface_1.get_db_uri)()
            }, true);
            if (app.locals.DEFAULT_DB_INTERFACE.connected())
                res.status(200).send({
                    status: "Connected"
                });
            else
                res.status(500).send({
                    error: "Not connected"
                });
        }
        else
            res.status(200).send({
                status: "Already connected"
            });
    }
    else
        (0, utils_2.send_json)(res, utils_3.error_codes.UNAUTHORIZED("reconnect db"));
});
app.use("*", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        (0, utils_2.send_json)(res, "Method not found", { error: 404 });
        return [2 /*return*/];
    });
}); });
