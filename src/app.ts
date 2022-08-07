import "dotenv/config";
import cors from "cors";
import express from "express";
import users_router from "./routes/users";
import countries_router from "./routes/countries";
import continents_router from "./routes/continents";
import cities_router from "./routes/cities";
import languages_router from "./routes/languages";
import monuments_router from "./routes/monuments";
import visits_router from "./routes/visits";
import monument_types from "./routes/monument_types";
import types_of_monuments from "./routes/types_of_monuments";
import { validate_db_status, DB_interface, get_db_uri } from "./logic/db_interface/DB_interface";
import { authenticate_user } from "./logic/users/utils";
import bodyParser from "body-parser";
import { send_json } from "./utils";
import { error_codes } from "./logic/tables/utils";
import { validate_ids } from "./utils";
const app = express();

app.use(validate_db_status);
app.use(cors());
// Authenticate user
app.use(bodyParser.json({limit: '10mb'}));
app.use(authenticate_user)

app.use("/languages", languages_router);
app.use("/countries", countries_router);
app.use("/users", users_router);
app.use("/continents", continents_router);
app.use("/cities", cities_router);
app.use("/monuments", monuments_router);
app.use("/visits", visits_router);
app.use("/monument_types", monument_types);
app.use("/types_of_monuments", types_of_monuments);

app.get("/", async (req, res) => {
    res.status(200).send({status: "Running"});
});

app.connect("/reconnect_db", (req, res) => {
    const not_valid_connection = !app.locals.DEFAULT_DB_INTERFACE || !app.locals.DEFAULT_DB_INTERFACE.connected();
    if(res.locals.is_admin) {
        if(not_valid_connection) {
            app.locals.DEFAULT_DB_INTERFACE = new DB_interface({
                connectionString: get_db_uri()
            }, true);
            if(app.locals.DEFAULT_DB_INTERFACE.connected())
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
        send_json(res, error_codes.UNAUTHORIZED("reconnect db"));
});

app.use("*", async (req, res) => {
    send_json(res, "Method not found", { error: 404 })
});

export { app };