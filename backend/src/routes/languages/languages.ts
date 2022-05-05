import { Router, Request, Response } from 'express';
import { send_json } from '../../utils';
import { DB_interface, req_types as types } from '../../logic/db_interface/DB_interface';
import { create_table, delete_table, get_schema } from '../../logic/tables/utils';
import { get_language_of_user } from 'src/logic/users/utils';

/******************** CONSTANTS ***********************/
const languages_router = Router();
const table_name = "languages";
const error_codes = {
    table_not_found: `${table_name}_1_1`,
    country_not_found: `${table_name}_1_2`,
    no_compatible_insert_body: `${table_name}_2_1`,
    no_compatible_update_body: `${table_name}_2_2`,
    no_continent_ids: `${table_name}_2_3`,
    no_city_id: `${table_name}_2_4`,
}
function exclude_fields_by_language(language: string) { //Exclude the fields in a different language
    return types.get_fields("countries",
        x => x.startsWith("real_") || !(x.endsWith("_name") && !x.startsWith(language)),
        false
    )[0];
}

/****************************************** ROUTES **********************************************/
languages_router.options("/", (req: Request, res: Response) => {
    let method_list = [
        { verb: "post", method: "create_table", description: "Creates the table", role: "admin" },
        { verb: "get", method: "table_schema", description: "Gets the schema of the table" },
        { verb: "get", method: "list_all", description: "Gives the fields of all the countries"},
        { verb: "get", method: "list_single/:continent_id", description: "Gives the fields of a single country" },
        { verb: "get", method: "list_single_by_iso_code/:country_iso_code", description: "Gives the fields of a single country" },
        { verb: "get", method: "countries_in_continents", description: "Gives list of all countries in the continents passed with the query string" },
        { verb: "get", method: "country_of_city", description: "Gives the country of a city passed with the query string" },
        { verb: "post", method: "insert", description: "Inserts a new country. Parameters passed in the body", role: "admin" },
        { verb: "put", method: "update/:country_id", description: "Updates a country. Parameters passed in the body", role: "admin" },
        { verb: "delete", method: "delete/:country_id", description: "Deletes a country", role: "admin" },
    ];
    res.status(200).json(
        res.locals.role === "admin" ?
            method_list : 
            method_list.filter(x => x.role !== "admin")
    );
});
/************************************** TABLE ***************************************************/
languages_router.post("/create_table", async (req: Request, res: Response) => {
    send_json(res, 
        await create_table(table_name, res.locals.DB_INTERFACE as DB_interface, res.locals.role as string),
    );
});
languages_router.get("/table_schema", async (req: Request, res: Response) => {
    send_json(res,
        await get_schema(table_name, res.locals.DB_INTERFACE as DB_interface, res.locals.role as string) || error_codes.table_not_found,
    );
});
languages_router.delete("/delete_table", async (req: Request, res: Response) => {
    send_json(res,
        await delete_table(table_name, res.locals.DB_INTERFACE as DB_interface, res.locals.role as string),
    );
});
/************************************** GET ***************************************************/
languages_router.get("/list_all", async (req: Request, res: Response) => {
    const db_interface = res.locals.DB_INTERFACE as DB_interface;
    const result = await db_interface.query(`SELECT * FROM languages order by language_name`);
    send_json(res, result);
});

languages_router.get("/list_single/:lang_id", async (req: Request, res: Response) => {
    const db_interface = res.locals.DB_INTERFACE as DB_interface;
    const result = await db_interface.query(`SELECT * FROM countries WHERE id = $1`, [req.params.lang_id]);
    send_json(res, result);
});

languages_router.get("/list_single_by_abbreviation/:abbreviation", async (req: Request, res: Response) => {
    const db_interface = res.locals.DB_INTERFACE as DB_interface;
    const result = await db_interface.query(`SELECT * FROM countries WHERE abbreviation = $1`, [req.params.abbreviation]);
    send_json(res, result);
});

languages_router.get("/language_of_user", async (req: Request, res: Response) => {
    const db_interface = res.locals.DB_INTERFACE as DB_interface;
    const result = await db_interface.query(
        `SELECT * FROM Languages
        WHERE id = (SELECT fk_language_id FROM Users WHERE firebase_id = $1)`, [res.locals.uid]
    );
    send_json(res, result);
});
/************************************** POST ***************************************************/
languages_router.post("/insert", async (req: Request, res: Response) => {
    if(res.locals.role !== "admin") {
    const db_interface = res.locals.DB_INTERFACE as DB_interface;
    if(types.is_languages_body(req.body)) {
