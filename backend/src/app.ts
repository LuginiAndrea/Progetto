// *************************************************************************************************
// -------------------- In production remove the dev_shortcuts folder -----------------------------*
// -------------------- In production also remove the SQL folder and the .env file. -------------- *
// *************************************************************************************************

import "dotenv/config";
import express from "express";
// import db_shortcut_router from "./routes/dev_shortcuts/DB_shortcuts"; // Remove this in production code
import users_router from "./routes/users";
import countries_router from "./routes/countries";
import continents_router from "./routes/continents";
import cities_router from "./routes/cities";
import languages_router from "./routes/languages";
import monuments_router from "./routes/monuments";
import monument_types_router from "./routes/monument_types";
import visits_router from "./routes/visits";
import { validate_db_status, DB_interface, get_db_uri } from "./logic/db_interface/DB_interface";
import { authenticate_user } from "./logic/users/utils";
import bodyParser from "body-parser";
import { send_json } from "./utils";

const app = express();

app.use(validate_db_status);
// Authenticate user
app.use(bodyParser.json());
app.use(authenticate_user)

// app.use("/db_shortcuts", db_shortcut_router); // Remove this in production code
app.use("/languages", languages_router);
app.use("/countries", countries_router);
app.use("/users", users_router);
app.use("/continents", continents_router);
app.use("/cities", cities_router);
app.use("/monuments", monuments_router);
app.use("/monument_types", monument_types_router);
app.use("/visits", visits_router);

app.get("/", (req, res) => {
    res.status(200).send({status: "Running"});
});

app.get("/reconnect_db", (req, res) => {
    const not_valid_connection = !app.locals.DEFAULT_DB_INTERFACE || !app.locals.DEFAULT_DB_INTERFACE.connected();
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
});

app.use("*", (req, res) => {
    send_json(res, "Method not found", { error: 404 })
});

export { app };