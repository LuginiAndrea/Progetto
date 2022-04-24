// *************************************************************************************************
// -------------------- In production remove the dev_shortcuts folder -----------------------------*
// -------------------- In production also remove the SQL folder and the .env file. -------------- *
// *************************************************************************************************

import "dotenv/config";
import * as express from "express";
import db_shortcut_router from "./routes/dev_shortcuts/DB_shortcuts"; // Remove this in production code
import users_router from "./routes/users/users";
import countries_router from "./routes/countries/countries";
import continents_router from "./routes/continents/continents";
import { get_db_uri } from "./db_interface/DB_interface";
import { authenticate_user } from "./users/utils";
import * as bodyParser from 'body-parser';

const app = express();
//Choose Database URI
app.use(get_db_uri);

// Authenticate user
app.use(bodyParser.json());
app.use(authenticate_user)

app.use("/db_shortcuts", db_shortcut_router); // Remove this in production code

app.use("/countries", countries_router);
app.use("/users", users_router);
app.use("/continents", continents_router);


app.get("/", (req, res) => {
    res.status(200).send("Hello World!");
});


app.listen(process.env.PORT || 8080, () => {
    console.log(`Server is running on port ${process.env.PORT || 8080}`);
});