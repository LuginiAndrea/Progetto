import { Router, Request, Response } from 'express';
import { send_json } from '../../utils';
import { DB_interface, req_types as types } from '../../logic/db_interface/DB_interface';
import { get_language_of_user } from '../../logic/users/utils';
import { table, values, error_codes } from '../../logic/tables/utils';

/******************** CONSTANTS ***********************/
const countries_router = Router();
const table_name = "countries";

function exclude_fields_by_language(language: string) { //Exclude the fields in a different language
    return types.get_fields(table_name,
        x => x.startsWith("real_") || !(x.endsWith("_name") && !x.startsWith(language)),
        false
    )[0];
}
const join_continents = (rest_of_query = "") => "JOIN continents ON cities.fk_continent_id = continents.id" + rest_of_query;
const join_continents_filter = (func: (args: any) => string[], language: string) => 
    (args: any) => func(args).concat([`continents.${language}_name as country_name`]);
/****************************************** ROUTES **********************************************/
countries_router.options("/", (req: Request, res: Response) => {
    const method_list = [
        { verb: "post", method: "create_table", description: "Creates the table", role: "admin" },
        { verb: "delete", method: "delete_table", description: "Deletes the table", role: "admin" },
        { verb: "get", method: "table_schema", description: "Gets the schema of the table" },
        { verb: "get", method: "list_all", description: "Gives the fields of all the countries"},
        { verb: "get", method: "list_single/:id", description: "Gives the fields of a single country" },
        { verb: "get", method: "list_single_by_iso_code/:country_iso_code", description: "Gives the fields of a single country" },
        { verb: "get", method: "countries_in_continents", description: "Gives list of all countries in the continents passed with the query string" },
        { verb: "get", method: "countries_of_cities", description: "Gives the countries of the cities passed with the query string" },
        { verb: "post", method: "insert", description: "Inserts a new country. Parameters passed in the body", role: "admin" },
        { verb: "put", method: "update/:country_id", description: "Updates a country. Parameters passed in the body", role: "admin" },
        { verb: "delete", method: "delete/:country_id", description: "Deletes a country", role: "admin" },
    ];
    res.status(200).json(
        res.locals.role === "admin" ?
            method_list : 
            method_list.filter(x => x.role !== "admin")
    );
});
/************************************** TABLE ***************************************************/
countries_router.post("/create_table", async (req: Request, res: Response) => {
    send_json(res, 
        await table.create(table_name, res.locals.DB_INTERFACE as DB_interface, res.locals.role as string),
    );
});
countries_router.delete("/delete_table", async (req: Request, res: Response) => {
    send_json(res,
        await table.delete(table_name, res.locals.DB_INTERFACE as DB_interface, res.locals.role as string),
    );
});
countries_router.get("/table_schema", async (req: Request, res: Response) => {
    send_json(res,
        await table.schema(table_name, res.locals.DB_INTERFACE as DB_interface, res.locals.role as string),
    );
});

/************************************** GET ***************************************************/
countries_router.get("/list_all", async (req: Request, res: Response) => {
    const db_interface = res.locals.DB_INTERFACE as DB_interface;
    const language = await get_language_of_user(req, res.locals.UID, db_interface);
    send_json(res,
        await values.get.all(table_name, db_interface, join_continents(), {
            func: join_continents_filter(exclude_fields_by_language, language),
            args: language
        })
    );
});

countries_router.get("/list_single/:id", async (req: Request, res: Response) => {
    const db_interface = res.locals.DB_INTERFACE as DB_interface;
    const language = await get_language_of_user(req, res.locals.UID, db_interface);
    send_json(res,
        await values.get.single(table_name, db_interface, req.params.id, join_continents(), {
            func: join_continents_filter(exclude_fields_by_language, language),
            args: language
        })
    )
});

countries_router.get("/list_single_by_iso_code/:country_iso_code", async (req: Request, res: Response) => {
    const db_interface = res.locals.DB_INTERFACE as DB_interface;
    const language = await get_language_of_user(req, res.locals.UID, db_interface);
    send_json(res,
        await values.get.generic(table_name, db_interface, join_continents(`WHERE iso_alpha_3 = $1`), [req.params.country_iso_code], {
            func: join_continents_filter(exclude_fields_by_language, language),
            args: language
        })
    );
});

countries_router.get("/countries_in_continents", async (req: Request, res: Response) => { 
    if(!req.query.continent_ids) 
        send_json(res, error_codes.No_referenced_item(table_name));
    else {
        const db_interface = res.locals.DB_INTERFACE as DB_interface;
        const language = await get_language_of_user(req, res.locals.UID, db_interface);
        send_json(res, 
            await values.get.generic(table_name, db_interface, 
                join_continents(`WHERE fk_continent_id = ANY ($1)`), [(req.query.continent_ids as string).split(",")], {
                func: join_continents_filter(exclude_fields_by_language, language),
                args: language
            })
        );
    }
});

countries_router.get("/countries_of_cities", async (req: Request, res: Response) => {
    if(!req.query.city_ids) 
        send_json(res, error_codes.No_referenced_item(table_name));
    else {
        const db_interface = res.locals.DB_INTERFACE as DB_interface;
        const language = await get_language_of_user(req, res.locals.UID, db_interface);
        send_json(res, 
            await values.get.generic(table_name, db_interface, 
                join_continents(`WHERE id = ANY (SELECT fk_country_id FROM cities WHERE id = ANY ($1))`), 
                [(req.query.city_ids as string).split(",")], {
                func: join_continents_filter(exclude_fields_by_language, language),
                args: language
            })
        );
    }
});

/************************************** POST ***************************************************/
countries_router.post("/insert", async (req, res) => {
    send_json(res,
        await values.insert(table_name, res.locals.DB_INTERFACE as DB_interface, res.locals.role as string, req.body)
    );
});
/************************************** PUT ***************************************************/
countries_router.put("/update/:id", async (req, res) => {
    send_json(res,
        await values.update(table_name, res.locals.DB_INTERFACE as DB_interface, res.locals.role as string, req.body, req.params.id)
    );
});
/************************************** DELETE ***************************************************/
countries_router.delete("/delete/:id", async (req, res) => {
    send_json(res,
        await values.delete(table_name, res.locals.DB_INTERFACE as DB_interface, res.locals.role as string, req.params.id)
    );
});

export default countries_router;