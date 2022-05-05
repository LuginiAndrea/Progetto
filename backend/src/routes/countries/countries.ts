import { Router, Request, Response } from 'express';
import { send_json } from '../../utils';
import { DB_interface, req_types as types } from '../../logic/db_interface/DB_interface';
import { get_language_of_user } from '../../logic/users/utils';
import { create_table, delete_table, get_schema } from '../../logic/tables/utils';

/******************** CONSTANTS ***********************/
const countries_router = Router();
const table_name = "countries";
const error_codes = {
    table_not_found: `${table_name}_1_1`,
    country_not_found: `${table_name}_1_2`,
    no_compatible_insert_body: `${table_name}_2_1`,
    no_compatible_update_body: `${table_name}_2_2`,
    no_continent_ids: `${table_name}_2_3`,
    no_city_id: `${table_name}_2_4`,
}
function exclude_fields_by_language(language: string) { //Exclude the fields in a different language
    return types.get_fields("countries",
        x => x.startsWith("real_") || !(x.endsWith("_name") && !x.startsWith(language)),
        false
    )[0];
}

/****************************************** ROUTES **********************************************/
countries_router.options("/", (req: Request, res: Response) => {
    let method_list = [
        { verb: "post", method: "create_table", description: "Creates the table", role: "admin" },
        { verb: "get", method: "table_schema", description: "Gets the schema of the table" },
        { verb: "get", method: "list_all", description: "Gives the fields of all the countries"},
        { verb: "get", method: "list_single/:continent_id", description: "Gives the fields of a single country" },
        { verb: "get", method: "list_single_by_iso_code/:country_iso_code", description: "Gives the fields of a single country" },
        { verb: "get", method: "countries_in_continents", description: "Gives list of all countries in the continents passed with the query string" },
        { verb: "get", method: "country_of_city", description: "Gives the country of a city passed with the query string" },
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
        await create_table(table_name, res.locals.DB_INTERFACE as DB_interface, res.locals.role as string),
    );
});
countries_router.delete("/delete_table", async (req: Request, res: Response) => {
    send_json(res,
        await delete_table(table_name, res.locals.DB_INTERFACE as DB_interface, res.locals.role as string),
    );
});
countries_router.get("/table_schema", async (req: Request, res: Response) => {
    send_json(res,
        await get_schema(table_name, res.locals.DB_INTERFACE as DB_interface, res.locals.role as string) || error_codes.table_not_found,
    );
});

/************************************** GET ***************************************************/
countries_router.get("/list_all", async (req: Request, res: Response) => {
    const db_interface = res.locals.DB_INTERFACE as DB_interface;
    const language_of_user = await get_language_of_user(req, res.locals.UID, db_interface);
    const fields = exclude_fields_by_language(language_of_user);
    const result = await db_interface.query(`SELECT ${fields} FROM countries ORDER BY fk_continent_id, ${language_of_user}_name`);
    send_json(res, result);
});

countries_router.get("/list_single/:country_id", async (req: Request, res: Response) => {
    const db_interface = res.locals.DB_INTERFACE as DB_interface;
    const language_of_user = await get_language_of_user(req, res.locals.UID, db_interface);
    const fields = exclude_fields_by_language(language_of_user);
    const result = await db_interface.query(`SELECT ${fields} FROM countries WHERE id = $1`, [req.params.country_id]);
    send_json(res, result);
});

countries_router.get("/list_single_by_iso_code/:country_iso_code", async (req: Request, res: Response) => {
    const db_interface = res.locals.DB_INTERFACE as DB_interface;
    const language_of_user = await get_language_of_user(req, res.locals.UID, db_interface);
    const fields = exclude_fields_by_language(language_of_user);
    const result = await db_interface.query(`SELECT ${fields} FROM countries WHERE iso_alpha_3 = $1`, [req.params.country_iso_code]);
    send_json(res, result);
});

countries_router.get("/countries_in_continents", async (req: Request, res: Response) => { 
    if(req.query.continent_ids) {
        const db_interface = res.locals.DB_INTERFACE;
        const language_of_user = await get_language_of_user(req, res.locals.UID, db_interface);
        const fields = exclude_fields_by_language(language_of_user);
        const result = await db_interface.query(`
            SELECT ${fields} FROM countries 
            WHERE fk_continent_id = ANY ($1)
            ORDER BY fk_continent_id, ${language_of_user}_name`, 
            [(req.query.continent_ids as string).split(",")]
        );
        send_json(res, result);
    }
    else 
        send_json(res, {
            error: error_codes.no_continent_ids,
        });
});

countries_router.get("/country_of_city", async (req: Request, res: Response) => {
    if(req.query.city_id) {
        const db_interface = res.locals.DB_INTERFACE;
        const language_of_user = await get_language_of_user(req, res.locals.UID, db_interface);
        //Filter out the fields that are for different languages
        const fields = exclude_fields_by_language(language_of_user);
        const result = await db_interface.query(`
            SELECT ${fields} FROM Countries 
            WHERE id = (
                SELECT fk_country_id FROM Cities WHERE id = $1
            )`, [req.query.city_id]);
        send_json(res, result);
    }

    else 
        send_json(res, {
            error: error_codes.no_city_id,
        });
});

/************************************** POST ***************************************************/
countries_router.post("/insert", async (req, res) => {
    if(res.locals.role !== "admin")
        send_json(res, "Unauthorized");

    else if(types.is_countries_body(req.body))  {
        const db_interface = res.locals.DB_INTERFACE as DB_interface;
        const [fields, placeholder_sequence] = types.get_fields("countries", Object.keys(req.body), true, true);
        const data = types.extract_values_of_fields(req.body, fields);
        console.log(data);
        const result = await db_interface.query(`
            INSERT INTO Countries (${fields}) VALUES (${placeholder_sequence})
            RETURNING id;`, 
            data
        ); 
        send_json(res, result, { success: 201 });
    }

    else
        send_json(res, {
            error: error_codes.no_compatible_insert_body
        });
});
/************************************** PUT ***************************************************/
countries_router.put("/update/:country_id", async (req, res) => {
    const updating_fields = req.body.updating_fields;
    if(res.locals.role !== "admin")
        send_json(res, "Unauthorized");
    else if(types.is_countries_body(req.body) && typeof updating_fields === "string") {
        const db_interface = res.locals.DB_INTERFACE as DB_interface;
        const [fields, placeholder_sequence] = types.get_fields("countries", updating_fields.split(","), 2, true);
        console.log(fields);
        const data = types.extract_values_of_fields(req.body, fields); 

        if(fields.length === 0) { //Check if there is at least one field to update
            send_json(res, {
                error: error_codes.no_compatible_update_body
            });
        }
        else {
            const result = fields.length > 1 ? //If there are more than 1 field to update we need to change syntax
                await db_interface.query(`
                    UPDATE Countries SET (${fields}) = (${placeholder_sequence})
                    WHERE id = $1
                    RETURNING *;`,
                    [req.params.country_id, ...data]
                ) :
                await db_interface.query(`
                    UPDATE Countries SET ${fields} = $2
                    WHERE id = $1
                    RETURNING *;`,
                    [req.params.country_id, ...data]
                );

            if(result?.result?.[0].rowCount === 0) // Check if a row was affected
                send_json(res, error_codes.country_not_found);
            else
                send_json(res, result);
        }
    }
    else
        send_json(res, {
            error: error_codes.no_compatible_update_body
        });
});
/************************************** DELETE ***************************************************/
countries_router.delete("/delete/:country_id", async (req, res) => {
    if(res.locals.role !== "admin")
        send_json(res, {
            error: "Unauthorized",
        });
    else {
        const db_interface = res.locals.DB_INTERFACE as DB_interface;
        const result = await db_interface.query(`
            DELETE FROM Countries WHERE id = $1
            RETURNING id;`, 
            [req.params.country_id]
        );
        if(result?.result?.[0].rowCount === 0) //Check if a row was affected
            send_json(res, error_codes.country_not_found);
        else
            send_json(res, result);
    }
});

export default countries_router;