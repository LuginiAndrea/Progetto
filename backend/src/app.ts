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
    res.status(200).send({"Status": "Running"});
});

export { app };