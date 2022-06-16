import {Router, Request, Response} from 'express';
import { get_language_of_user } from "../logic/users/utils";
import { send_json } from '../utils';
import { req_types as types } from '../logic/db_interface/DB_interface';
import { table, values, error_codes } from '../logic/tables/utils';

/******************** CONSTANTS ***********************/
const continents_router: Router = Router();
const table_name = "continents";
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
    send_json(res, result, {success: 201});
});
/************************************** GET ***************************************************/
continents_router.get("/all", async (req, res) => {
    const db_interface = res.locals.DB_INTERFACE;
    send_json(res,
        await values.get.all(table_name, db_interface, types.exclude_fields_by_language[table_name](
                await get_language_of_user(res.locals.UID, db_interface),
            ).fields, "ORDER BY id"
        )
    );
});

continents_router.get("/filter_by_id", async (req, res) => {
    const ids = (req.query.ids as string).split(",") || [];
    if(ids.length === 0) 
        send_json(res, error_codes.NO_REFERENCED_ITEM("ids"));
    else {
        const db_interface = res.locals.DB_INTERFACE;
        send_json(res,
            await values.get.by_id(table_name, db_interface, ids, types.exclude_fields_by_language[table_name](
                    await get_language_of_user(res.locals.UID, db_interface),
                ).fields, "ORDER BY id"
            ),
        );
    }
});

continents_router.get("/filter_by_countries", async (req, res) => {
    const ids = (req.query.ids as string).split(",") || [];
    if(ids.length === 0) 
        send_json(res, error_codes.NO_REFERENCED_ITEM("ids"));
    else {
        const db_interface = res.locals.DB_INTERFACE;
        send_json(res,
            await values.get.generic(table_name, db_interface, types.exclude_fields_by_language[table_name](
                    await get_language_of_user(res.locals.UID, db_interface),
                ).fields, 
                "WHERE id = ANY (SELECT fk_continent_id FROM Countries WHERE id = ANY($1)) ORDER BY id", 
                [ids]
            )
        );
    }
});

export default continents_router;