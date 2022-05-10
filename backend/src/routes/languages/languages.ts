import { Router, Request, Response } from 'express';
import { send_json } from '../../utils';
import { DB_interface } from '../../logic/db_interface/DB_interface';
import { table, values } from '../../logic/tables/utils';

/******************** CONSTANTS ***********************/
const languages_router = Router();
const table_name = "languages";

/****************************************** ROUTES **********************************************/
languages_router.options("/", (req, res) => {
    let method_list = [
        { verb: "post", method: "create_table", description: "Creates the table", is_admin: true },
        { verb: "delete", method: "delete_table", description: "Deletes the table", is_admin: true },
        { verb: "get", method: "table_schema", description: "Gets the schema of the table" },
        { verb: "get", method: "list_all", description: "Gives the fields of all the countries"},
        { verb: "get", method: "list_single/:id", description: "Gives the fields of a single country" },
        { verb: "get", method: "list_single_by_iso_code/:country_iso_code", description: "Gives the fields of a single country" },
        { verb: "get", method: "countries_in_continents", description: "Gives list of all countries in the continents passed with the query string" },
        { verb: "get", method: "country_of_city", description: "Gives the country of a city passed with the query string" },
        { verb: "post", method: "insert", description: "Inserts a new country. Parameters passed in the body", is_admin: true },
        { verb: "put", method: "update/:country_id", description: "Updates a country. Parameters passed in the body", is_admin: true },
        { verb: "delete", method: "delete/:country_id", description: "Deletes a country", is_admin: true },
    ];
    res.status(200).json(
        res.locals.is_admin ?
            method_list : 
            method_list.filter(x => x.is_admin)
    );
});
/************************************** TABLE ***************************************************/
languages_router.post("/create_table", async (req, res) => {
    send_json(res, 
        await table.create(table_name, res.locals.DB_INTERFACE, res.locals.is_admin)
    );
});
languages_router.delete("/delete_table", async (req, res) => {
    send_json(res,
        await table.delete(table_name, res.locals.DB_INTERFACE, res.locals.is_admin)
    );
});
languages_router.get("/table_schema", async (req, res) => {
    send_json(res,
        await table.schema(table_name, res.locals.DB_INTERFACE)
    );
});

/************************************** GET ***************************************************/
languages_router.get("/list_all", async (req, res) => {
    const db_interface = res.locals.DB_INTERFACE;
    send_json(res, 
        await values.get.all(table_name, db_interface, "ORDER BY language_name")
    );
});

languages_router.get("/list_single/:id", async (req, res) => {
    const db_interface = res.locals.DB_INTERFACE;
    send_json(res,
        await values.get.single(table_name, db_interface, req.params.id)
    );
});

languages_router.get("/list_single_by_abbreviation/:abbreviation", async (req, res) => {
    const db_interface = res.locals.DB_INTERFACE;
    send_json(res,
        await values.get.generic(table_name, db_interface, "WHERE abbreviation = $1", [req.params.abbreviation])
    );
});

languages_router.get("/language_of_user", async (req, res) => {
    const db_interface = res.locals.DB_INTERFACE;
    send_json(res,
        await values.get.generic(table_name, db_interface, "id = (SELECT fk_language_id FROM Users WHERE id = $1)", [res.locals.uid])
    );
});
/************************************** POST ***************************************************/
languages_router.post("/insert", async (req, res) => {
    send_json(res,
        await values.insert(table_name, res.locals.DB_INTERFACE, res.locals.is_admin, req.body)
    );
});
/************************************** PUT ***************************************************/
languages_router.put("/update/:id", async (req, res) => {
    send_json(res,
        await values.update(table_name, res.locals.DB_INTERFACE, res.locals.is_admin, req.body, req.params.id)
    );
});
/************************************** DELETE ***************************************************/
languages_router.delete("/delete/:id", async (req, res) => {
    send_json(res,
        await values.delete(table_name, res.locals.DB_INTERFACE, res.locals.is_admin, req.params.id)
    );
});

export default languages_router;