import { Router, Request, Response } from 'express';
import { send_json } from '../../utils';
import { DB_interface, req_types as types, validate_rating } from '../../logic/db_interface/DB_interface';
import { table, values, error_codes } from '../../logic/tables/utils';
import { get_language_of_user } from 'src/logic/users/utils';

/******************** CONSTANTS ***********************/
const monuments_router = Router();
const table_name = "monuments";
function exclude_fields_by_language(language: string) { //Exclude the fields in a different language
    return types.get_fields("monuments",
        x => x.startsWith("real_") || !((x.endsWith("_name") || x.endsWith("_description")) && !x.startsWith(language)),
        false
    )[0];
}
const join_city = (rest_of_query = "") => "JOIN cities ON monuments.fk_city_id = cities.id" + rest_of_query;
const join_city_filter = (func: (args: any) => string[], language: string) =>
    (args: any) => func(args).concat([`cities.${language}_name as city_name`]);

/***************************************** TABLE *********************************************/
monuments_router.post("/create_table", async (req: Request, res: Response) => {
    send_json(res,
        await table.create(table_name, res.locals.DB_INTERFACE as DB_interface, res.locals.role as string)
    );
});
monuments_router.delete("/delete_table", async (req: Request, res: Response) => {
    send_json(res,
        await table.delete(table_name, res.locals.DB_INTERFACE as DB_interface, res.locals.role as string)
    );
});
monuments_router.get("/table_schema", async (req: Request, res: Response) => {
    send_json(res,
        await table.schema(table_name, res.locals.DB_INTERFACE as DB_interface, res.locals.role as string)
    );
});

/***************************************** GET *********************************************/
monuments_router.get("/list_all", async (req: Request, res: Response) => {
    const db_interface = res.locals.DB_INTERFACE as DB_interface;
    const language = await get_language_of_user(req, res.locals.uid, db_interface);
    send_json(res,
        await values.get.all(table_name, db_interface, join_city(), {
            func: join_city_filter(exclude_fields_by_language, language),
            args: language
        })
    );
});
monuments_router.get("/list_single/:id", async (req: Request, res: Response) => {
    const db_interface = res.locals.DB_INTERFACE as DB_interface;
    const language = await get_language_of_user(req, res.locals.uid, db_interface);
    send_json(res, 
        await values.get.single(table_name, db_interface, req.params.id, join_city(), {
            func: join_city_filter(exclude_fields_by_language, language),
            args: language
        })
    );
});
monuments_router.get("/list_by_rating", async (req: Request, res: Response) => {
    const {valid, operator, rating} = validate_rating(req);
    if(!valid)
        send_json(res, error_codes.Invalid_body(table_name));
    else {
        const db_interface = res.locals.DB_INTERFACE as DB_interface;
        const language = await get_language_of_user(req, res.locals.uid, db_interface);
        send_json(res, 
            await values.get.all(table_name, db_interface, join_city(`WHERE rating ${operator} ${rating}`), {
                func: join_city_filter(exclude_fields_by_language, language),
                args: language
            })
        );
    }
});
//TO CHANGE
monuments_router.get("/monuments_in_cities", async (req: Request, res: Response) => {
    if(!req.query.city_ids) 
        send_json(res, error_codes.No_referenced_item(table_name));
    else {
        const db_interface = res.locals.DB_INTERFACE;
        const language = await get_language_of_user(req, res.locals.UID, db_interface);
        send_json(res,
            await values.get.generic(table_name, db_interface, 
            `WHERE fk_city_id = ANY ($1) ORDER BY fk_city_id, rating, ${language}_name`, [(req.query.city_ids as string).split(",")], {
                func: exclude_fields_by_language,
                args: language
            })
        );
    }
});
monuments_router.get("/monuments_of_visits", async(req: Request, res: Response) => {
    if(!req.query.visit_ids)
        send_json(res, error_codes.No_referenced_item(table_name));
    else {
        const db_interface = res.locals.DB_INTERFACE;
        const language = await get_language_of_user(req, res.locals.UID, db_interface);
        send_json(res,
            await values.get.generic(table_name, db_interface,
            `WHERE id = ANY (SELECT fk_monument_id = ANY ($1)) ORDER BY fk_city_id, rating, ${language}_name`, [(req.query.visit_ids as string).split(",")], {
                func: exclude_fields_by_language,
                args: language
            })
        );
    }
});