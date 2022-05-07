import {Router, Request, Response} from 'express';
import { get_language_of_user } from "../../logic/users/utils";
import { send_json } from '../../utils';
import { DB_interface, req_types as types } from '../../logic/db_interface/DB_interface';
import { table, values, error_codes } from '../../logic/tables/utils';

/******************** CONSTANTS ***********************/
const continents_router: Router = Router();
const table_name = "continents";
function exclude_fields_by_language(language: string) { //Exclude the fields in a different language
    return types.get_fields("continents",
        x => !(x.endsWith("_name") && !x.startsWith(language)),
        false
    )[0];
}

/****************************************** ROUTES **********************************************/
continents_router.options("/", (req: Request, res: Response) => {
    let method_list = [
        { verb: "post", method: "create_table", description: "Creates the table", role: "admin" },
        { verb: "delete", method: "delete_table", description: "Deletes the table", role: "admin" },
        { verb: "get", method: "table_schema", description: "Gets the schema of the table" },
        { verb: "post", method: "insert_continents", description: "Inserts all the continents. To be used only when table is reset", role: "admin" },
        { verb: "get", method: "list_all", description: "Gives the fields of all the continents"},
        { verb: "get", method: "list_single/:continent_id", description: "Gives the fields of a single continents" },
        { verb: "get", method: "continent_of_country", description: "Gives the continent of a country passed with the query string" },
    ];
    res.status(200).json(
        res.locals.role === "admin" ?
            method_list : 
            method_list.filter(x => x.role !== "admin")
    );
});
/************************************** TABLE ***************************************************/
continents_router.post("/create_table", async (req: Request, res: Response) => {
    send_json(res, 
        await table.create(table_name, res.locals.DB_INTERFACE as DB_interface, res.locals.role as string),
    );
});
continents_router.delete("/delete_table", async (req: Request, res: Response) => {
    send_json(res,
        await table.delete(table_name, res.locals.DB_INTERFACE as DB_interface, res.locals.role as string),
    );
});
continents_router.get("/table_schema", async (req: Request, res: Response) => {
    send_json(res,
        await table.schema(table_name, res.locals.DB_INTERFACE as DB_interface, res.locals.role as string),
    );
});
continents_router.post("/insert_continents", async (req: Request, res: Response) => {
    const db_interface = res.locals.DB_INTERFACE as DB_interface;
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
continents_router.get("/list_all", async (req: Request, res: Response) => {
    const db_interface = res.locals.DB_INTERFACE as DB_interface;
    send_json(res,
        await values.get.all(table_name, db_interface, "ORDER BY id", {
            func: exclude_fields_by_language,
            args: await get_language_of_user(req, res.locals.UID, db_interface)
        })
    );
});

continents_router.get("/list_single/:continent_id", async (req: Request, res: Response) => {
    const db_interface = res.locals.DB_INTERFACE as DB_interface;
    send_json(res,
        await values.get.single(table_name, db_interface, req.params.continent_id, "", {
            func: exclude_fields_by_language,
            args: await get_language_of_user(req, res.locals.UID, db_interface)
        })
    );
});

continents_router.get("/continent_of_country", async (req: Request, res: Response) => {
    if(!req.query.country_id) 
        send_json(res, {
            error: error_codes.No_referenced_item(table_name)
        });
    else {
        const db_interface = res.locals.DB_INTERFACE as DB_interface;
        send_json(res,
            await values.get.generic(table_name, db_interface, "WHERE id = (SELECT fk_continent_id FROM Countries WHERE id = $1)", [req.query.country_id], {
                func: exclude_fields_by_language,
                args: await get_language_of_user(req, res.locals.UID, db_interface)
            })
        );
    }
});

export default continents_router;