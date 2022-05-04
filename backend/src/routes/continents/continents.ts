import {Router, Request, Response} from 'express';
import { get_language_of_user } from "../../logic/users/utils";
import { send_json } from '../../utils';
import { DB_interface, req_types as types } from '../../logic/db_interface/DB_interface';

const continents_router: Router = Router();
const error_codes = {
    no_country_id: "continents_1"
}

function exclude_fields_by_language(language: string) { //Exclude the fields in a different language
    return types.get_fields("continents",
        x => !(x.endsWith("_name") && !x.startsWith(language)),
        false
    )[0];
}

/************************************** GET ***************************************************/

continents_router.get("/list_all", async (req: Request, res: Response) => {
    const db_interface = res.locals.DB_INTERFACE as DB_interface;
    const language_of_user = await get_language_of_user(req, res.locals.UID, db_interface);
    //Filter out the fields that are for different languages
    const fields = exclude_fields_by_language(language_of_user);
    const result = await db_interface.query(`SELECT ${fields} FROM Continents ORDER BY ${language_of_user}_name`);
    send_json(res, result);
});

continents_router.get("/list_single/:continent_id", async (req: Request, res: Response) => {
    const db_interface = res.locals.DB_INTERFACE as DB_interface;
    const language_of_user = await get_language_of_user(req, res.locals.UID, db_interface);
    //Filter out the fields that are for different languages
    const fields = exclude_fields_by_language(language_of_user);
    const result = await db_interface.query(`SELECT ${fields} FROM Continents WHERE id = $1`, [req.params.continent_id]);
    send_json(res, result);
});

continents_router.get("/continent_of_country", async (req: Request, res: Response) => {
    if(req.query.country_id) {
        const db_interface = res.locals.DB_INTERFACE as DB_interface;
        const language_of_user = await get_language_of_user(req, res.locals.UID, db_interface);
        //Filter out the fields that are for different languages
        const fields = exclude_fields_by_language(language_of_user);
        const result = await db_interface.query(`
            SELECT ${fields} FROM Continents 
            WHERE id = (
                SELECT fk_continent_id FROM Countries WHERE id = $1
            )`, [req.query.country_id]);

        send_json(res, result);
    }
    else
        send_json(res, {
            error:error_codes.no_country_id
        });
});

export default continents_router;