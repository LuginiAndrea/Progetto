import { Router, Request, Response } from 'express';
import { send_json } from '../../utils';
import { DB_interface, req_types as types } from '../../logic/db_interface/DB_interface';
import { table, values } from '../../logic/tables/utils';
import { get_language_of_user } from 'src/logic/users/utils';

/******************** CONSTANTS ***********************/
const monuments_router = Router();
const table_name = "monuments";
function exclude_fields_by_language(language: string) { //Exclude the fields in a different language
    return types.get_fields("monuments",
        x => x.startsWith("real_") || !(x.endsWith("_name") && !x.startsWith(language)),
        false
    )[0];
}

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
    const language = get_language_of_user(req, res.locals.uid, db_interface);
    send_json(res,
        await values.get.all(table_name, db_interface, `ORDER BY rating, ${language}_name`, {
            func: exclude_fields_by_language,
            args: language
        })
    );
});
monuments_router.get("/list_single/:id", async (req: Request, res: Response) => {
    const db_interface = res.locals.DB_INTERFACE as DB_interface;
    send_json(res, 
        await values.get.single(table_name, db_interface, req.params.id, "", {
            func: exclude_fields_by_language,
            args: await get_language_of_user(req, res.locals.uid, db_interface)
        }
    ));
});
monuments_router.get("/list_by_rating/:rating", async (req: Request, res: Response) => {



