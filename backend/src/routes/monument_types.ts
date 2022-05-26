import { Router, Request, Response } from 'express';
import { send_json } from '../utils';
import { table, values, error_codes } from "../logic/tables/utils";

/******************** CONSTANTS ***********************/
const monument_types = Router();
const table_name = "monument_types";

/************************************** TABLE ***************************************************/
monument_types.post("/create_table", async (req, res) => {
    send_json(res, 
        await table.create(table_name, res.locals.DB_INTERFACE, res.locals.is_admin),
        {success: 201}
    );
});
monument_types.delete("/delete_table", async (req, res) => {
    send_json(res,
        await table.delete(table_name, res.locals.DB_INTERFACE, res.locals.is_admin)
    );
});
monument_types.get("/table_schema", async (req, res) => {
    send_json(res,
        await table.schema(table_name, res.locals.DB_INTERFACE)
    );
});

/************************************** GET ***************************************************/
monument_types.get("/all", async (req, res) => {
    const db_interface = res.locals.DB_INTERFACE;
    send_json(res, 
        await values.get.all(table_name, db_interface, "*")
    );
});

monument_types.get("/filter_by_id", async (req, res) => {
    const ids = (req.query.ids as string).split(",") || [];
    if(ids.length === 0) 
        send_json(res, error_codes.NO_REFERENCED_ITEM("ids"));
    else {
        const db_interface = res.locals.DB_INTERFACE;
        send_json(res,
            await values.get.by_id(table_name, db_interface, ids)
        );
    }
});