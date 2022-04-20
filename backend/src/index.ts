import "dotenv/config";
import * as express from "express";

const app = express();

app.get("/", (req, res) => {
    res.status(200).send("Hello World!");
});
app.get("/test", (req, res) => {
    res.status(200).send("Hello Test!");
});

app.listen(8080);