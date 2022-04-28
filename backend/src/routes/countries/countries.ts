import {Router, Request, Response} from 'express';
import { send_json } from '../../app';
import { DB_interface, req_types as types } from '../../logic/db_interface/DB_interface';
import { get_language_of_user } from '../../logic/users/utils';

const countries_router = Router();

function exclude_fields_by_language(language: string) { //Exclude the fields in a different language
    return types.get_countries_fields(x => x.startsWith("real_") || !(x.endsWith("_name") && !x.startsWith(language)));
}
const error_codes = {
    "no_continent_ids": "countries_1",
    "no_city_id": "countries_2",
    "no_compatible_insert_body": "countries_3",
}

/************************************** GET ***************************************************/

// Return whole info about country
countries_router.get("/list_all", async (req: Request, res: Response) => {
    const db_interface = res.locals.DB_INTERFACE as DB_interface;
    const language_of_user = await get_language_of_user(req, res.locals.UID, db_interface);
    //Filter out the fields that are for different languages
    const fields = exclude_fields_by_language(language_of_user);
    const result = await db_interface.query(`SELECT ${fields} FROM countries`);
    send_json(res, result);
});

countries_router.get("/list_single/:country_id", async (req: Request, res: Response) => {
    const db_interface = res.locals.DB_INTERFACE as DB_interface;
    const language_of_user = await get_language_of_user(req, res.locals.UID, db_interface);
    //Filter out the fields that are for different languages
    const fields = exclude_fields_by_language(language_of_user);
    const result = await db_interface.query(`SELECT ${fields} FROM countries WHERE id = $1`, [req.params.country_id]);
    send_json(res, result);
});

countries_router.get("/list_single_by_iso_code/:country_iso_code", async (req: Request, res: Response) => {
    const db_interface = res.locals.DB_INTERFACE as DB_interface;
    const language_of_user = await get_language_of_user(req, res.locals.UID, db_interface);
    //Filter out the fields that are for different languages
    const fields = exclude_fields_by_language(language_of_user);
    const result = await db_interface.query(`SELECT ${fields} FROM countries WHERE iso_alpha_3 = $1`, [req.params.country_iso_code]);
    send_json(res, result);
});

countries_router.get("/countries_in_continents", async (req: Request, res: Response) => { //Passes continent_id/s with it
    if(req.query.continent_ids) {
        const db_interface = res.locals.DB_INTERFACE;
        const language_of_user = await get_language_of_user(req, res.locals.UID, db_interface);
        //Filter out the fields that are for different languages
        const fields = exclude_fields_by_language(language_of_user);
        const result = await db_interface.query(`SELECT ${fields} FROM countries WHERE fk_continent_id = ANY ($1)`, [(req.query.continent_ids as string).split(",")]);
        send_json(res, result);
    }
    else 
        send_json(res, {
            error: error_codes.no_continent_ids,
        });
});

countries_router.get("/country_of_city/:city_id", async (req: Request, res: Response) => {
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

countries_router.post("/insert_single", async (req, res) => {
    if(res.locals.role !== "admin")
        send_json(res, {
            error: "Unauthorized",
        }, 401);

    else if(types.is_countries_body(req.body))  {
        const result = await res.locals.DB_INTERFACE.query(`
            INSERT INTO Countries (real_name, it_name, en_name, iso_alpha_3, fk_continent_id) VALUES ($1, $2, $3, $4, $5)
            RETURNING id;`, 
            [req.body.real_name, req.body.it_name, req.body.en_name, req.body.iso_alpha_3, req.body.fk_continent_id]
        );  
        send_json(res, result);
    }

    else
        send_json(res, {
            error: error_codes.no_compatible_insert_body
        });
});

countries_router.post("/delete/:country_id", async (req, res) => {
    if(res.locals.role !== "admin")
        send_json(res, {
            error: "Unauthorized",
        }, 401);
    else {
        const result = await res.locals.DB_INTERFACE.query(`DELETE FROM Countries WHERE id = $1;`, [req.query.country_id]);
        send_json(res, result);
    }
});

export default countries_router;