"use strict";
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
app.get("/", function (req, res) {
    res.status(200).send({ status: "Running" });
});
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
app.use("*", function (req, res) {
    (0, utils_2.send_json)(res, "Method not found", { error: 404 });
});
