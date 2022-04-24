// *************************************************************************************************
// -------------------- This file is to be used only for development purposes. --------------------*
// -------------------- It is not to be used in production. -------------------------------------- *
// -------------------- In production also remove the SQL folder and the .env file. -------------- *
// *************************************************************************************************

import {Router, Request, Response} from 'express';
import * as bodyParser from 'body-parser';
import { DB_interface, types } from '../../db_interface/DB_interface';
import { table_arguments } from "./table_creates";

const db_shortcut_router: Router = Router();

const get_db_uri = (req, res, next) => {
    res.locals.DB_URI = 
        (req.params.db === "prod") ? process.env.PROD_DB_URI : process.env.DEV_DB_URI;
    next();
};
db_shortcut_router.use("/:db", get_db_uri);

// -------------------- General table stuff --------------------
// -------------------- GET TABLE SCHEMA --------------------
db_shortcut_router.get("/:db/table_schema/:table_name", async (req: Request, res: Response) => {;
    const result = await new DB_interface({
        connectionString: res.locals.DB_URI
    }).query("SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_name = $1;", [req.params.table_name]);

    if(result.ok) 
        res.status(200).send({
            table_name: req.params.table_name,
            columns: result.result[0].rows.map(row => [row.column_name, row.data_type])
        });
    else
        res.status(500).send(result.error);
});    
// -------------------- SELECT * --------------------
db_shortcut_router.get("/:db/select_table/:table_name", async (req: Request, res: Response) => {
    const result = await new DB_interface({
        connectionString: res.locals.DB_URI
    }).query(`SELECT * FROM ${req.params.table_name}`, []);
    
    if(result.ok)
        res.status(200).send(result.result);
    else
        res.status(500).send(result.error);
});
// -------------------- DROP TABLE --------------------
db_shortcut_router.get("/:db/drop_table/:table_name", async (req: Request, res: Response) => {
    const result = await new DB_interface({
        connectionString: res.locals.DB_URI
    }).query(`DROP TABLE ${req.params.table_name}`, []);

    if(result.ok)
        res.status(200).send(result.result);
    else
        res.status(500).send(result.error);
});
// -------------------- CREATE TABLE --------------------
db_shortcut_router.get("/:db/create_table/:table_name", async (req: Request, res: Response) => {
    const table_name: string = req.params.table_name;
    const db = new DB_interface({
        connectionString: res.locals.DB_URI
    });
    if(table_name !== "all") {
        const table = table_arguments[table_name];
        await db.query(table.query, table.args, false);
    } 
    else 
        for(const table in table_arguments) {
            const result = await db.query(table_arguments[table].query, table_arguments[table].args, false);
            if(!result.ok)
                res.status(500).send(result.error);
        }
    res.status(200).send("Created");
    db.close();
});

// -------------------- GET DB SCHEMA --------------------
db_shortcut_router.get('/:db/db_schema', async (req: Request, res: Response) => {
    const result = await new DB_interface({
        connectionString: res.locals.DB_URI
    }).query(`SELECT table_name FROM information_schema.tables 
        WHERE table_type != 'VIEW' 
        AND table_name NOT LIKE 'pg%'
        AND table_name NOT LIKE 'sql%'
        AND table_name NOT LIKE 'spatial%'`, []
    );
    if(result.ok)
        res.status(200).send(result.result);
    else
        res.status(500).send(result.error);
});

// -------------------- INSERTS --------------------
db_shortcut_router.get("/:db/insertContinents", async (req, res) => {
    const result = await new DB_interface({
        connectionString: res.locals.DB_URI
    }).query(
        `INSERT INTO continents (id, it_name, en_name) VALUES 
        (0, 'Europa', 'Europe'), 
        (1, 'Asia', 'Asia'), 
        (2, 'Nord America', 'North America'), 
        (3, 'Sud America', 'South America'), 
        (4, 'Africa', 'Africa'), 
        (5, 'Oceania', 'Oceania'), 
        (6, 'Antartica', 'Antarctica');`, []
    );
    if(result.ok)
        res.status(200).send(result.result);
    else
        res.status(500).send(result.error);
});

db_shortcut_router.post("/:db/insertCountries", bodyParser.json(), async (req, res) => {
    if(types.is_countries_body(req.body)) {
        const result = await new DB_interface({
            connectionString: res.locals.DB_URI
        }).query(
            `INSERT INTO Countries (real_name, it_name, en_name, iso_alpha_3, fk_continent_id) VALUES
            ($1, $2, $3, $4, $5);`, 
            [req.body.real_name, req.body.it_name, req.body.en_name, req.body.iso_alpha_3, req.body.fk_continent_id]
        );  
        if(result.ok)
            res.status(200).send(result.result);
        else
            res.status(500).send(result.error);
    }
    else 
        res.status(400).send("Types not matching");
});

export default db_shortcut_router;