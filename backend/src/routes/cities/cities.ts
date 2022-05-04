import {Router, Request, Response} from 'express';
import { get_language_of_user } from "../../logic/users/utils";
import { send_json } from "../../utils"
import { DB_interface, req_types as types } from '../../logic/db_interface/DB_interface';

const cities_router: Router = Router();

function exclude_fields_by_language(language: string) { //Exclude the fields in a different language
    return types.get_fields("cities",
        x => x.startsWith("real_") || !(x.endsWith("_name") && !x.startsWith(language)),
        false
    )[0];
}

const error_codes = {
    no_country_ids: "cities_1",
    no_monument_id: "cities_2",
    no_compatible_insert_body: "cities_3",
    no_compatible_update_body: "cities_4",
    no_city_found: "cities_5"
}
/************************************** GET ***************************************************/
cities_router.get("/list_all", async (req: Request, res: Response) => {
    const db_interface = res.locals.DB_INTERFACE as DB_interface;
    const language_of_user = await get_language_of_user(req, res.locals.UID, db_interface);
    const fields = exclude_fields_by_language(language_of_user);
    const result = await db_interface.query(`SELECT ${fields} FROM Cities`);
    send_json(res, result);
});

cities_router.get("/list_single/:city_id", async (req: Request, res: Response) => {
    const db_interface = res.locals.DB_INTERFACE as DB_interface;
    const language_of_user = await get_language_of_user(req, res.locals.UID, db_interface);
    const fields = exclude_fields_by_language(language_of_user);
    const result = await db_interface.query(`SELECT ${fields} FROM Cities WHERE id = $1`, [req.params.city_id]);
    send_json(res, result);
});

cities_router.get("/cities_in_countries", async (req: Request, res: Response) => {
    if(req.query.country_ids) {
        const db_interface = res.locals.DB_INTERFACE;
        const language_of_user = await get_language_of_user(req, res.locals.UID, db_interface);
        //Filter out the fields that are for different languages
        const fields = exclude_fields_by_language(language_of_user);
        const result = await db_interface.query(`SELECT ${fields} FROM cities WHERE fk_country_id = ANY ($1)`, [(req.query.country_ids as string).split(",")]);
        send_json(res, result);
    }
    else 
        send_json(res, {
            error: error_codes.no_country_ids,
        });
});

cities_router.get("/city_of_monument", async (req: Request, res: Response) => {
    if(req.query.monument_id) {
        const db_interface = res.locals.DB_INTERFACE;
        const language_of_user = await get_language_of_user(req, res.locals.UID, db_interface);
        //Filter out the fields that are for different languages
        const fields = exclude_fields_by_language(language_of_user);
        const result = await db_interface.query(`
            SELECT ${fields} FROM Cities WHERE id = (
                SELECT fk_city_id FROM Monuments WHERE id = $1
            )`, [req.query.monument_id]);
        send_json(res, result);
    }

    else 
        send_json(res, {
            error: error_codes.no_monument_id,
        });
});
/************************************** POST ***************************************************/
cities_router.post("/insert", async (req, res) => {
    if(res.locals.role !== "admin")
        send_json(res, "Unauthorized");

    else if(types.is_cities_body(req.body))  {
        const db_interface = res.locals.DB_INTERFACE as DB_interface;
        const [fields, placeholder_sequence] = types.get_fields("countries", Object.keys(req.body), true, true);
        const data = types.extract_values_of_fields(req.body, fields);
        const result = await db_interface.query(`
            INSERT INTO Countries (${fields}) VALUES (${placeholder_sequence})
            RETURNING id;`, 
            data
        ); 
        send_json(res, result, {
            statusCode: {
                success: 201
            }
        });
    }

    else
        send_json(res, {
            error: error_codes.no_compatible_insert_body
        });
});
cities_router.put("/update/:country_id", async (req, res) => {
    const updating_fields = req.body.updating_fields;
    if(res.locals.role !== "admin")
        send_json(res, "Unauthorized");
    else if(types.is_cities_body(req.body) && typeof updating_fields === "string") {
        const db_interface = res.locals.DB_INTERFACE as DB_interface;
        const [fields, placeholder_sequence] = types.get_fields("countries", updating_fields.split(","), 2);
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
                send_json(res, error_codes.no_city_found, { statusCode: { error: 404 } });
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
cities_router.delete("/delete/:country_id", async (req, res) => {
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
            send_json(res, error_codes.no_city_found, { statusCode: { error: 404 } });
        else
            send_json(res, result);
    }
});

export default cities_router;