import { Router, Request, Response } from 'express';
import { send_json } from '../../utils';
import { DB_interface } from '../../logic/db_interface/DB_interface';
import { table, values } from '../../logic/tables/utils';
import { get_language_of_user } from 'src/logic/users/utils';

/******************** CONSTANTS ***********************/
const monuments_router = Router();
const table_name = "monuments";

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

monuments_router.get("/list_all", async (req: Request, res: Response) => {
    const db_interface = res.locals.DB_INTERFACE as DB_interface;
    const language = get_language_of_user(req, res.locals.uid, db_interface);
    
    send_json(res,
        await values.get.all(table_name, db_interface, "ORDER BY monument_name", {

        })
    );



