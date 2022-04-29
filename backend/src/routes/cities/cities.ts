import {Router, Request, Response} from 'express';
import { get_language_of_user } from "../../logic/users/utils";
import { send_json } from "../../utils"
import { DB_interface, req_types as types } from '../../logic/db_interface/DB_interface';

const cities_router: Router = Router();

function exclude_fields_by_language(language: string) { //Exclude the fields in a different language
    return types.get_continents_fields(x => x.startsWith("real_") || !(x.endsWith("_name") && !x.startsWith(language)));
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

cities_router.get("/cities_in_country/:country_id", async (req: Request, res: Response) => {
    const db_interface = res.locals.DB_INTERFACE as DB_interface;
    const language_of_user = await get_language_of_user(req, res.locals.UID, db_interface);
    const fields = exclude_fields_by_language(language_of_user);
    const result = await db_interface.query(`SELECT ${fields} FROM Cities WHERE fk_country_id = $1`, [req.params.country_id]);
    send_json(res, result);
});

cities_router.get("/city_of_monument/:monument_id", async (req: Request, res: Response) => {
    const db_interface = res.locals.DB_INTERFACE as DB_interface;
    const language_of_user = await get_language_of_user(req, res.locals.UID, db_interface);
    const fields = exclude_fields_by_language(language_of_user);
    const result = await db_interface.query(`SELECT ${fields} FROM Cities WHERE id = (SELECT fk_city_id FROM Monuments WHERE id = $1)`, [req.params.monument_id]);
    send_json(res, result);
});

// cities_router.post("/add_city", async (req: Request, res: Response) => {


export default cities_router;