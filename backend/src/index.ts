// *************************************************************************************************
// -------------------- In production remove the dev_shortcuts folder -----------------------------*
// -------------------- In production also remove the SQL folder and the .env file. -------------- *
// *************************************************************************************************
import "dotenv/config";
import * as express from "express";
import db_shortcut_router from "./routes/dev_shortcuts/DB_shortcuts"; // Remove this in production code

const app = express();

app.use("/db_shortcuts", db_shortcut_router); // Remove this in production code


app.get("/", (req, res) => {
    res.status(200).send("Hello World!");
});



app.listen(8080);