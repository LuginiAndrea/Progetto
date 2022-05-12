import { Router, Request, Response } from 'express';
import { send_json } from '../utils';
import { req_types as types } from '../logic/db_interface/DB_interface';
import { get_language_of_user } from '../logic/users/utils';
import { table, values, error_codes } from '../logic/tables/utils';

/******************** CONSTANTS ***********************/
const countries_router = Router();
const table_name = "countries";
function get_fields(req : Request, language: string) {
    return types.exclude_fields_by_language[table_name](language).fields.concat(
        req.query.join === "1" ?
            types.exclude_fields_by_language.cities(language).fields.filter(x => x !== "id") :
            []
    );
}
const join_fields_query = `JOIN continents ON continents.id = countries.fk_continent_id`;
/****************************************** ROUTES **********************************************/
countries_router.options("/", (req, res) => {
    const method_list = [
        { verb: "post", method: "create_table", description: "Creates the table", is_admin: true },
        { verb: "delete", method: "delete_table", description: "Deletes the table", is_admin: true },
        { verb: "get", method: "table_schema", description: "Gets the schema of the table" },
        { verb: "get", method: "list_all", description: "Gives the fields of all the countries"},
        { verb: "get", method: "list_single/:id", description: "Gives the fields of a single country" },
        { verb: "get", method: "list_single_by_iso_code/:country_iso_code", description: "Gives the fields of a single country" },
        { verb: "get", method: "countries_in_continents", description: "Gives list of all countries in the continents passed with the query string" },
        { verb: "get", method: "countries_of_cities", description: "Gives the countries of the cities passed with the query string" },
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
countries_router.post("/create_table", async (req, res) => {
    send_json(res, 
        await table.create(table_name, res.locals.DB_INTERFACE, res.locals.is_admin),
        {success: 201}
    );
});
countries_router.delete("/delete_table", async (req, res) => {
    send_json(res,
        await table.delete(table_name, res.locals.DB_INTERFACE, res.locals.is_admin)
    );
});
countries_router.get("/table_schema", async (req, res) => {
    send_json(res,
        await table.schema(table_name, res.locals.DB_interface)
    );
});

/************************************** GET ***************************************************/
countries_router.get("/list_all", async (req, res) => {
    const db_interface = res.locals.DB_INTERFACE;
    const language = await get_language_of_user(req, res.locals.UID, db_interface);
    const fields = get_fields(req, language);
    send_json(res,
        await values.get.all(table_name, db_interface, fields, join_fields_query)
    );
});

countries_router.get("/list_by_id", async (req, res) => {
    const ids = (req.query.ids as string).split(",") || [];
    if(ids.length === 0) 
        send_json(res, error_codes.NO_REFERENCED_ITEM("ids"));
    else {
        const db_interface = res.locals.DB_INTERFACE;
        const language = await get_language_of_user(req, res.locals.UID, db_interface);
        const fields = get_fields(req, language);
        send_json(res,
            await values.get.by_id(table_name, db_interface, ids, fields, join_fields_query)
        );
    }
});

countries_router.get("/list_single_by_iso_code/:country_iso_code", async (req, res) => {
    const db_interface = res.locals.DB_INTERFACE;
    const language = await get_language_of_user(req, res.locals.UID, db_interface);
    const fields = get_fields(req, language);
    send_json(res,
        await values.get.generic(table_name, db_interface, fields, `${join_fields_query} WHERE iso_alpha_3 = $1`, [req.params.country_iso_code])
    );
});

countries_router.get("/countries_in_continents", async (req, res) => { 
    const ids = (req.query.ids as string).split(",") || [];
    if(ids.length === 0) 
        send_json(res, error_codes.NO_REFERENCED_ITEM("ids"));
    else {
        const db_interface = res.locals.DB_INTERFACE;
        const language = await get_language_of_user(req, res.locals.UID, db_interface);
        const fields = get_fields(req, language);
        send_json(res, 
            await values.get.generic(table_name, db_interface, fields, `${join_fields_query} WHERE fk_continent_id = ANY ($1)`, [ids]
            )
        );
    }
});

countries_router.get("/countries_of_cities", async (req, res) => {
    const ids = (req.query.ids as string).split(",") || [];
    if(ids.length === 0) 
        send_json(res, error_codes.NO_REFERENCED_ITEM("ids"));
    else {
        const db_interface = res.locals.DB_INTERFACE;
        const language = await get_language_of_user(req, res.locals.UID, db_interface);
        const fields = get_fields(req, language);
        send_json(res, 
            await values.get.generic(table_name, db_interface, fields, 
                    `${join_fields_query} WHERE id = ANY (SELECT fk_country_id FROM cities WHERE id = ANY ($1))`, 
                    [ids]
            )
        );
    }
});

/************************************** POST ***************************************************/
countries_router.post("/insert", async (req, res) => {
    send_json(res,
        await values.insert(table_name, res.locals.DB_INTERFACE, res.locals.is_admin, req.body),
        {success: 201}
    );
});
/************************************** PUT ***************************************************/
countries_router.put("/update/:id", async (req, res) => {
    send_json(res,
        await values.update(table_name, res.locals.DB_INTERFACE, res.locals.is_admin, req.body, req.params.id)
    );
});
/************************************** DELETE ***************************************************/
countries_router.delete("/delete/:id", async (req, res) => {
    send_json(res,
        await values.delete(table_name, res.locals.DB_INTERFACE, res.locals.is_admin, req.params.id)
    );
});

export default countries_router;