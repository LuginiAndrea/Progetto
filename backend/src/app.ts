// *************************************************************************************************
// -------------------- In production remove the dev_shortcuts folder -----------------------------*
// -------------------- In production also remove the SQL folder and the .env file. -------------- *
// *************************************************************************************************

import "dotenv/config";
import express from "express";
import db_shortcut_router from "./routes/dev_shortcuts/DB_shortcuts"; // Remove this in production code
import users_router from "./routes/users/users";
import countries_router from "./routes/countries/countries";
import continents_router from "./routes/continents/continents";
import cities_router from "./routes/cities/cities";
import { validating_db_status, DB_result, QueryResult } from "./logic/db_interface/DB_interface";
import { authenticate_user } from "./logic/users/utils";
import bodyParser from "body-parser";

const app = express();

app.use(validating_db_status);
// Authenticate user
app.use(bodyParser.json());
app.use(authenticate_user)

app.use("/db_shortcuts", db_shortcut_router); // Remove this in production code

app.use("/countries", countries_router);
app.use("/users", users_router);
app.use("/continents", continents_router);
app.use("/cities", cities_router);


app.get("/", (req, res) => {
    res.status(200).send("Hello World!");
});


const send_json = (res: express.Response, result: DB_result | string, processing_func?: (arg: Array<QueryResult<any>>) => Object) => {
    if(typeof result === "string")
        result = {
            error: result
        } as DB_result;

    if (result.result) {
        if(processing_func === undefined) processing_func = (result) => { return result[0].rows; };
        res.status(200).send(processing_func(result.result));
    }
    else {
        const status = (result.error?.startsWith("i")) ? 500 : 400;
        res.status(status).send(result.error);
    }
}

export { send_json, app };