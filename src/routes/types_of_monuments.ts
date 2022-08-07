import { Router } from 'express';
import { send_json, validate_ids } from '../utils';
import { table, values } from "../logic/tables/utils";
import { exclude_fields_by_language } from '../logic/db_interface/types';
import { get_language_of_user } from '../logic/users/utils';

/******************** CONSTANTS ***********************/
const types_of_monuments = Router();
const table_name = "types_of_monuments";

types_of_monuments.get("/routes", async (req, res) => {
    const routes = [
        { method: "POST", path: "/create_table", body: "NO", is_admin: true },
        { method: "GET", path: "/table_schema", body: "NO", is_admin: false },
        { method: "DELETE", path: "/delete_table", body: "NO", is_admin: true },
        { method: "GET", path: "/all", body: "NO", is_admin: false },
        { method: "GET", path: "/filter_by_id", body: "Query_String", is_admin: false },
        { method: "POST", path: "/insert", body: "JSON", is_admin: true },
        { method: "PUT", path: "/update/:id", body: "JSON", is_admin: true },
        { method: "DELETE", path: "/delete/:id", body: "NO", is_admin: true },
    ];
    res.status(200).json(res.locals.is_admin ? routes : routes.filter(x => !x.is_admin));
});
/************************************** TABLE ***************************************************/
types_of_monuments.post("/create_table", async (req, res) => {
    send_json(res, 
        await table.create(table_name, res.locals.DB_INTERFACE, res.locals.is_admin),
        {success: 201}
    );
});
types_of_monuments.delete("/delete_table", async (req, res) => {
    send_json(res,
        await table.delete(table_name, res.locals.DB_INTERFACE, res.locals.is_admin)
    );
});
types_of_monuments.get("/table_schema", async (req, res) => {
    send_json(res,
        await table.schema(table_name, res.locals.DB_INTERFACE)
    );
});

/************************************** GET ***************************************************/
types_of_monuments.get("/all", async (req, res) => {
    const db_interface = res.locals.DB_INTERFACE;
    const language = await get_language_of_user(res.locals.UID, db_interface);
    const fields = exclude_fields_by_language[table_name](language).fields;
    send_json(res, 
        await values.get.all(table_name, db_interface, fields)
    );
});

types_of_monuments.get("/filter_by_id", validate_ids, async (req, res) => {
    const db_interface = res.locals.DB_INTERFACE;
    const language = await get_language_of_user(res.locals.UID, db_interface);
    const fields = exclude_fields_by_language[table_name](language).fields;
    send_json(res,
        await values.get.by_id(table_name, db_interface, res.locals.ids, fields)
    );
});

/************************************** POST ***************************************************/
types_of_monuments.post("/insert", async (req, res) => {
    send_json(res,
        await values.insert(table_name, res.locals.DB_INTERFACE, res.locals.is_admin, req.body),
        {success: 201}
    );
});
/************************************** PUT ***************************************************/
types_of_monuments.put("/update/:id", async (req, res) => {
    send_json(res,
        await values.update(table_name, res.locals.DB_INTERFACE, res.locals.is_admin, req.body, req.params.id)
    );
});
/************************************** DELETE ***************************************************/
types_of_monuments.delete("/delete/:id", async (req, res) => {
    send_json(res,
        await values.delete(table_name, res.locals.DB_INTERFACE, res.locals.is_admin, req.params.id)
    );
});

export default types_of_monuments;