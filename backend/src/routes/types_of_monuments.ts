import { Router, Request, Response } from 'express';
import { send_json } from '../utils';
import { table, values, error_codes } from "../logic/tables/utils";
import { exclude_fields_by_language } from '../logic/db_interface/types';
import { get_language_of_user } from '../logic/users/utils';

/******************** CONSTANTS ***********************/
const types_of_monuments = Router();
const table_name = "types_of_monuments";

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

types_of_monuments.get("/filter_by_id", async (req, res) => {
    const ids = (req.query.ids as string).split(",") || [];
    if(ids.length === 0) 
        send_json(res, error_codes.NO_REFERENCED_ITEM("ids"));
    else {
        const db_interface = res.locals.DB_INTERFACE;
        const language = await get_language_of_user(res.locals.UID, db_interface);
        const fields = exclude_fields_by_language[table_name](language).fields;
        send_json(res,
            await values.get.by_id(table_name, db_interface, ids, fields)
        );
    }
});
