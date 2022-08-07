import { Router } from 'express';
import { get_language_of_user } from "../logic/users/utils";
import { send_json, validate_ids } from '../utils';
import { req_types as types } from '../logic/db_interface/DB_interface';
import { table, values, error_codes } from '../logic/tables/utils';

/******************** CONSTANTS ***********************/
const continents_router: Router = Router();
const table_name = "continents";

continents_router.get("/routes", async (req, res) => {
    const routes = [
        { method: "POST", path: "/create_table", body: "NO", is_admin: true },
        { method: "GET", path: "/table_schema", body: "NO", is_admin: false },
        { method: "DELETE", path: "/delete_table", body: "NO", is_admin: true },
        { method: "GET", path: "/all", body: "NO", is_admin: false },
        { method: "GET", path: "/filter_by_id", body: "Query_String", is_admin: false },
        { method: "GET", path: "/filter_by_countries", body: "Query_String", is_admin: false },
        { method: "POST", path: "/insert", body: "NO", is_admin: true }
    ];
    res.status(200).json(res.locals.is_admin ? routes : routes.filter(x => !x.is_admin));
});
/************************************** TABLE ***************************************************/
continents_router.post("/create_table", async (req, res) => {
    send_json(res, 
        await table.create(table_name, res.locals.DB_INTERFACE, res.locals.is_admin),
        { success: 201 }
    );
});
continents_router.delete("/delete_table", async (req, res) => {
    send_json(res,
        await table.delete(table_name, res.locals.DB_INTERFACE, res.locals.is_admin),
    );
});
continents_router.get("/table_schema", async (req, res) => {
    send_json(res,
        await table.schema(table_name, res.locals.DB_INTERFACE),
    );
});
continents_router.post("/insert", async (req, res) => {
    const db_interface = res.locals.DB_INTERFACE;
    const result = await db_interface.query(`
        INSERT INTO continents (id, it_name, en_name) VALUES 
        (1, 'Europa', 'Europe'), 
        (2, 'Asia', 'Asia'), 
        (3, 'Nord America', 'North America'), 
        (4, 'Sud America', 'South America'),
        (5, 'America Centrale', 'Central America'), 
        (6, 'Africa', 'Africa'), 
        (7, 'Oceania', 'Oceania'), 
        (8, 'Antartica', 'Antarctica');`
    );
    send_json(res, result, { success: 201 });
});
/************************************** GET ***************************************************/
continents_router.get("/all", async (req, res) => {
    const db_interface = res.locals.DB_INTERFACE;
    const language = await get_language_of_user(res.locals.UID, db_interface);
    const fields = types.exclude_fields_by_language[table_name](language).fields;
    send_json(res,
        await values.get.all(table_name, db_interface, fields, "ORDER BY id")
    );
});

continents_router.get("/filter_by_id", validate_ids, async (req, res) => {
    const db_interface = res.locals.DB_INTERFACE;
    const language = await get_language_of_user(res.locals.UID, db_interface);
    const fields = types.exclude_fields_by_language[table_name](language).fields;
    send_json(res,
        await values.get.by_id(table_name, db_interface, res.locals.ids, fields, "ORDER BY id")
    );
});

continents_router.get("/filter_by_countries", validate_ids, async (req, res) => {
    const db_interface = res.locals.DB_INTERFACE;
    const language = await get_language_of_user(res.locals.UID, db_interface);
    const fields = types.exclude_fields_by_language[table_name](language).fields;
    send_json(res,
        await values.get.generic(
            table_name, db_interface, fields,
            "WHERE id = ANY (SELECT fk_continent_id FROM Countries WHERE id = ANY($1)) ORDER BY id", 
            [res.locals.ids]
        )
    );
});

export default continents_router;