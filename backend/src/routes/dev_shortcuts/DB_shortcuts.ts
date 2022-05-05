// *************************************************************************************************
// -------------------- This file is to be used only for development purposes. --------------------*
// -------------------- It is not to be used in production. -------------------------------------- *
// -------------------- In production also remove the SQL folder and the .env file. -------------- *
// *************************************************************************************************

// import {Router, Request, Response, NextFunction} from 'express';
// import * as bodyParser from 'body-parser';
// import { DB_interface, DB_result, req_types as types } from '../../logic/db_interface/DB_interface';
// import { table_creates as table_arguments } from "../../sql/table_creates";
// import { index_arguments } from "./index_creates";
// import { send_json } from "../../utils";

// const db_shortcut_router: Router = Router();

// const get_db_uri = (req: Request, res: Response, next: NextFunction) => {
//     res.locals.DB_URI = 
//         (req.params.db === "prod") ? process.env.PROD_DB_URI : process.env.DEV_DB_URI;
//     next();
// };
// db_shortcut_router.use("/:db", get_db_uri);

// // -------------------- General table stuff --------------------

// // -------------------- GET TABLE SCHEMA --------------------
// db_shortcut_router.get("/:db/table_schema/:table_name", async (req: Request, res: Response) => {;
//     const result = await new DB_interface({
//         connectionString: res.locals.DB_URI
//     }).query("SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_name = $1;", [req.params.table_name]);

//     send_json(res, result, {
//         processing_func: (internal_result) => {
//             return {
//                 table_name: req.params.table_name,
//                 columns: internal_result[0].rows.map(row => [row.column_name, row.data_type])
//             }
//         }
//     });
// });    
// // -------------------- SELECT * --------------------
// db_shortcut_router.get("/:db/select_table/:table_name", async (req: Request, res: Response) => {
//     const result = await new DB_interface({
//         connectionString: res.locals.DB_URI
//     }).query(`SELECT * FROM ${req.params.table_name}`, []);
    
//     send_json(res, result);
// });
// // -------------------- DROP TABLE --------------------
// db_shortcut_router.get("/:db/drop_table/:table_name", async (req: Request, res: Response) => {
//     const result = await new DB_interface({
//         connectionString: res.locals.DB_URI
//     }).query(`DROP TABLE ${req.params.table_name}`, []);

//     send_json(res, result);
// });
// // -------------------- CREATE TABLE --------------------
// db_shortcut_router.get("/:db/create_table/:table_name", async (req: Request, res: Response) => {
//     const table_name: string = req.params.table_name;
//     const db = new DB_interface({
//         connectionString: res.locals.DB_URI
//     });
//     let result : DB_result = {error: "no tables selected"};
//     if(table_name !== "all") {
//         const table = table_arguments[table_name];
//         result = await db.query(table, [], false);
//     }
//     else
//         for(const table in table_arguments) {
//             const single_result = await db.query(table_arguments[table], [], false);
//             if(!single_result.result) {
//                 result = single_result
//                 break;
//             }
//         }
//     send_json(res, result);
//     db.close();
// });
// // -------------------- CREATE INDEXES --------------------
// db_shortcut_router.get("/:db/create_indexes/:index_name", async (req: Request, res: Response) => {
//     const index_name: string = req.params.index_name;
//     const db = new DB_interface({
//         connectionString: res.locals.DB_URI
//     });
//     let result : DB_result = {error: "no indexes selected"};
//     if(index_name !== "all") {
//         const index = index_arguments[index_name];
//         result = await db.query(index, [], false);
//     }
//     else
//         for(const index in index_arguments) {
//             const single_result = await db.query(index_arguments[index], [], false);
//             if(!single_result.result) {
//                 result = single_result
//                 break;
//             }
//         }
//     send_json(res, result);
//     db.close();
// });
// // -------------------- GET DB SCHEMA --------------------
// db_shortcut_router.get('/:db/db_schema', async (req: Request, res: Response) => {
//     const result = await new DB_interface({
//         connectionString: res.locals.DB_URI
//     }).query(`SELECT table_name FROM information_schema.tables 
//         WHERE table_type != 'VIEW' 
//         AND table_name NOT LIKE 'pg%'
//         AND table_name NOT LIKE 'sql%'
//         AND table_name NOT LIKE 'spatial%'`, []
//     );
//     send_json(res, result);
// });

// // -------------------- INSERTS --------------------
// db_shortcut_router.post("/:db/insertContinents", async (req, res) => {
//     const result = await new DB_interface({
//         connectionString: res.locals.DB_URI
//     }).query(
//         `INSERT INTO continents (id, it_name, en_name) VALUES 
//         (0, 'Europa', 'Europe'), 
//         (1, 'Asia', 'Asia'), 
//         (2, 'Nord America', 'North America'), 
//         (3, 'Sud America', 'South America'),
//         (4, 'America Centrale', 'Central America'), 
//         (5, 'Africa', 'Africa'), 
//         (6, 'Oceania', 'Oceania'), 
//         (7, 'Antartica', 'Antarctica');`, []
//     );
//     send_json(res, result);
// });
// db_shortcut_router.get("/:db/insertAmericaCentrale", async (req, res) => {
//     const result = await new DB_interface({
//         connectionString: res.locals.DB_URI
//     }).query(
//         `INSERT INTO continents (id, it_name, en_name) VALUES 
//         (7, 'America Centrale', 'Central America');`, []
//     );
//     send_json(res, result);
// });


// db_shortcut_router.post("/:db/insertCountries", bodyParser.json(), async (req, res) => {
//     if(types.is_countries_body(req.body)) {
//         const result = await new DB_interface({
//             connectionString: res.locals.DB_URI
//         }).query(
//             `INSERT INTO Countries (real_name, it_name, en_name, iso_alpha_3, fk_continent_id) VALUES
//             ($1, $2, $3, $4, $5);`, 
//             [req.body.real_name, req.body.it_name, req.body.en_name, req.body.iso_alpha_3, req.body.fk_continent_id]
//         );  
//         send_json(res, result);
//     }
//     else 
//         res.status(400).send("Types not matching");
// });

// db_shortcut_router.post("/:db/InsertUser", async(req, res) => {
//     if(types.is_users_body(req.body)) {
//         const result = await new DB_interface({
//             connectionString: res.locals.DB_URI
//         }).query(`INSERT INTO Users (firebase_id, fk_language_id) VALUES ($1, $2);`, [req.body.firebase_id, req.body.fk_language_id]);
//         send_json(res, result);
//     }
//     else
//         res.status(400).send("Types not matching");
// });

// db_shortcut_router.post("/:db/InsertLanguages", async(req, res) => {
//     if(types.is_languages_body(req.body)) {
//         const result = await new DB_interface({
//             connectionString: res.locals.DB_URI
//         }).query(`INSERT INTO Languages (name, abbreviation) VALUES ($1, $2);`, [req.body.name, req.body.abbreviation]);
//         send_json(res, result);
//     }
//     else
//         res.status(400).send("Types not matching");
// });



// export default db_shortcut_router;