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
            types.exclude_fields_by_language.continents(language).fields.filter(x => !x.includes(".id")):
            []
    );
}
const join_fields_query = `JOIN continents ON continents.id = countries.fk_continent_id`;
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
countries_router.get("/all", async (req, res) => {
    const db_interface = res.locals.DB_INTERFACE;
    const language = await get_language_of_user(res.locals.UID, db_interface);
    const fields = get_fields(req, language);
    send_json(res,
        await values.get.all(table_name, db_interface, fields, join_fields_query)
    );
});

countries_router.get("/filter_by_id", async (req, res) => {
    const ids = (req.query.ids as string).split(",") || [];
    if(ids.length === 0) 
        send_json(res, error_codes.NO_REFERENCED_ITEM("ids"));
    else {
        const db_interface = res.locals.DB_INTERFACE;
        const language = await get_language_of_user(res.locals.UID, db_interface);
        const fields = get_fields(req, language);
        send_json(res,
            await values.get.by_id(table_name, db_interface, ids, fields, join_fields_query)
        );
    }
});

countries_router.get("/filter_by_single_iso_code/:country_iso_code", async (req, res) => {
    const db_interface = res.locals.DB_INTERFACE;
    const language = await get_language_of_user(res.locals.UID, db_interface);
    const fields = get_fields(req, language);
    send_json(res,
        await values.get.generic(table_name, db_interface, fields, `${join_fields_query} WHERE iso_alpha_3 = $1`, [req.params.country_iso_code])
    );
});

countries_router.get("/filter_by_continents", async (req, res) => { 
    const ids = (req.query.ids as string).split(",") || [];
    if(ids.length === 0) 
        send_json(res, error_codes.NO_REFERENCED_ITEM("ids"));
    else {
        const db_interface = res.locals.DB_INTERFACE;
        const language = await get_language_of_user(res.locals.UID, db_interface);
        const fields = get_fields(req, language);
        send_json(res, 
            await values.get.generic(table_name, db_interface, fields, `${join_fields_query} WHERE fk_continent_id = ANY ($1)`, [ids]
            )
        );
    }
});

countries_router.get("/filter_by_cities", async (req, res) => {
    const ids = (req.query.ids as string).split(",") || [];
    if(ids.length === 0) 
        send_json(res, error_codes.NO_REFERENCED_ITEM("ids"));
    else {
        const db_interface = res.locals.DB_INTERFACE;
        const language = await get_language_of_user(res.locals.UID, db_interface);
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