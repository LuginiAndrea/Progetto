import {Router, Request, Response} from 'express';
import { get_language_of_user } from "../logic/users/utils";
import { send_json } from '../utils';
import { req_types as types } from '../logic/db_interface/DB_interface';
import { table, values, error_codes } from '../logic/tables/utils';

/******************** CONSTANTS ***********************/
const continents_router: Router = Router();
const table_name = "continents";
/****************************************** ROUTES **********************************************/
continents_router.options("/", (req, res) => {
    const method_list = [
        { verb: "post", method: "create_table", description: "Creates the table", is_admin: true },
        { verb: "delete", method: "delete_table", description: "Deletes the table", is_admin: true },
        { verb: "get", method: "table_schema", description: "Gets the schema of the table" },
        { verb: "post", method: "insert_continents", description: "Inserts all the continents. To be used only when table is reset", is_admin: true },
        { verb: "get", method: "list_all", description: "Gives the fields of all the continents"},
        { verb: "get", method: "list_single/:id", description: "Gives the fields of a single continents" },
        { verb: "get", method: "continents_of_countries", description: "Gives the continents of the countries passed with the query string" },
    ];
    res.status(200).json(
        res.locals.is_admin ?
            method_list : 
            method_list.filter(x => x.is_admin)
    );
});
/************************************** TABLE ***************************************************/
continents_router.post("/create_table", async (req, res) => {
    send_json(res, 
        await table.create(table_name, res.locals.DB_INTERFACE, res.locals.is_admin),
        {success: 201}
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
continents_router.post("/insert_continents", async (req, res) => {
    const db_interface = res.locals.DB_INTERFACE;
    const result = await db_interface.query(`
        INSERT INTO continents (id, it_name, en_name) VALUES 
        (0, 'Europa', 'Europe'), 
        (1, 'Asia', 'Asia'), 
        (2, 'Nord America', 'North America'), 
        (3, 'Sud America', 'South America'),
        (4, 'America Centrale', 'Central America'), 
        (5, 'Africa', 'Africa'), 
        (6, 'Oceania', 'Oceania'), 
        (7, 'Antartica', 'Antarctica');`
    );
    send_json(res, result, {success: 201});
});
/************************************** GET ***************************************************/
continents_router.get("/list_all", async (req, res) => {
    const db_interface = res.locals.DB_INTERFACE;
    send_json(res,
        await values.get.all(table_name, db_interface, types.exclude_fields_by_language[table_name](
                await get_language_of_user(req, res.locals.UID, db_interface),
            ).fields, "ORDER BY id"
        )
    );
});

continents_router.get("/list_by_id", async (req, res) => {
    const ids = (req.query.ids as string).split(",") || [];
    if(ids.length === 0) 
        send_json(res, error_codes.NO_REFERENCED_ITEM("ids"));
    else {
        const db_interface = res.locals.DB_INTERFACE;
        send_json(res,
            await values.get.by_id(table_name, db_interface, ids, types.exclude_fields_by_language[table_name](
                    await get_language_of_user(req, res.locals.UID, db_interface),
                ).fields, "ORDER BY id"
            ),
        );
    }
});

continents_router.get("/continents_of_countries", async (req, res) => {
    const ids = (req.query.ids as string).split(",") || [];
    if(ids.length === 0) 
        send_json(res, error_codes.NO_REFERENCED_ITEM("ids"));
    else {
        const db_interface = res.locals.DB_INTERFACE;
        send_json(res,
            await values.get.generic(table_name, db_interface, types.exclude_fields_by_language[table_name](
                    await get_language_of_user(req, res.locals.UID, db_interface),
                ).fields, 
                "WHERE id = ANY (SELECT fk_continent_id FROM Countries WHERE id = ANY($1)) ORDER BY id", 
                [ids]
            )
        );
    }
});

export default continents_router;