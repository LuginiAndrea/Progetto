import { Router, Request, Response } from 'express';
import { send_json } from '../utils';
import { DB_interface, req_types as types } from '../logic/db_interface/DB_interface';
import { table, values, error_codes, validate_rating } from '../logic/tables/utils';
import { get_language_of_user } from 'src/logic/users/utils';

/******************** CONSTANTS ***********************/
const monuments_router = Router();
const table_name = "monuments";
function exclude_fields_by_language(language: string) { //Exclude the fields in a different language
    return types.get_fields(table_name, true,
        x => x.startsWith("real_") || !((x.endsWith("_name") || x.endsWith("_description")) && !x.startsWith(language)),
        false
    )[0];
}
const join_city = (rest_of_query = "") => "JOIN cities ON monuments.fk_city_id = cities.id" + rest_of_query;
const join_city_filter = (func: (args: any) => string[], language: string) =>
    (args: any) => func(args).concat([`cities.${language}_name as city_name`]);

/***************************************** TABLE *********************************************/
monuments_router.post("/create_table", async (req, res) => {
    send_json(res,
        await table.create(table_name, res.locals.DB_INTERFACE, res.locals.is_admin),
        {success: 201}
    );
});
monuments_router.delete("/delete_table", async (req, res) => {
    send_json(res,
        await table.delete(table_name, res.locals.DB_INTERFACE, res.locals.is_admin)
    );
});
monuments_router.get("/table_schema", async (req, res) => {
    send_json(res,
        await table.schema(table_name, res.locals.DB_INTERFACE)
    );
});

/***************************************** GET *********************************************/
monuments_router.get("/list_all", async (req, res) => {
    const db_interface = res.locals.DB_INTERFACE;
    const language = await get_language_of_user(req, res.locals.uid, db_interface);
    send_json(res,
        await values.get.all(table_name, db_interface, join_city(), {
            func: join_city_filter(exclude_fields_by_language, language),
            args: language
        })
    );
});
monuments_router.get("/list_single/:id", async (req, res) => {
    const db_interface = res.locals.DB_INTERFACE;
    const language = await get_language_of_user(req, res.locals.uid, db_interface);
    send_json(res, 
        await values.get.by_id(table_name, db_interface, req.params.id, join_city(), {
            func: join_city_filter(exclude_fields_by_language, language),
            args: language
        })
    );
});
monuments_router.get("/list_by_rating", async (req, res) => {
    const {valid, operator, rating} = validate_rating(req);
    if(!valid)
        send_json(res, error_codes.INVALID_BODY(table_name));
    else {
        const db_interface = res.locals.DB_INTERFACE;
        const language = await get_language_of_user(req, res.locals.uid, db_interface);
        send_json(res, 
            await values.get.all(table_name, db_interface, join_city(`WHERE rating ${operator} ${rating}`), {
                func: join_city_filter(exclude_fields_by_language, language),
                args: language
            })
        );
    }
});

monuments_router.get("/monuments_in_cities", async (req, res) => {
    if(!req.query.city_ids) 
        send_json(res, error_codes.NO_REFERENCED_ITEM(table_name));
    else {
        const db_interface = res.locals.DB_INTERFACE;
        const language = await get_language_of_user(req, res.locals.UID, db_interface);
        send_json(res,
            await values.get.generic(table_name, db_interface, join_city(`WHERE fk_city_id = ANY ($1)`), 
                [(req.query.city_ids as string).split(",")], {
                func: join_city_filter(exclude_fields_by_language, language),
                args: language
            })
        );
    }
});

monuments_router.get("/monuments_of_visits", async (req, res) => {
    if(!req.query.visit_ids)
        send_json(res, error_codes.NO_REFERENCED_ITEM(table_name));
    else {
        const db_interface = res.locals.DB_INTERFACE
        const language = await get_language_of_user(req, res.locals.UID, db_interface);
        send_json(res,
            await values.get.generic(table_name, db_interface, join_city(`WHERE id = ANY (SELECT fk_monument_id = ANY ($1))`), 
                [(req.query.visit_ids as string).split(",")], {
                func: join_city_filter(exclude_fields_by_language, language),
                args: language
            })
        );
    }
});
/******************************** POST *****************************/
monuments_router.post("/insert", async (req, res) => {
    send_json(res,
        await values.insert(table_name, res.locals.DB_INTERFACE, res.locals.role, req.body),
        {success: 201}
    );
});
/************************************** PUT ***************************************************/
monuments_router.put("/update/:id", async (req, res) => {
    send_json(res,
        await values.update(table_name, res.locals.DB_INTERFACE, res.locals.role, req.body, req.params.id)
    );
});
/************************************** DELETE ***************************************************/
monuments_router.delete("/delete/:id", async (req, res) => {
    send_json(res,
        await values.delete(table_name, res.locals.DB_INTERFACE, res.locals.role, req.params.id)
    );
});