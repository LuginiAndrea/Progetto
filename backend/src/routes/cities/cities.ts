import {Router, Request, Response} from 'express';
import { get_language_of_user } from "../../logic/users/utils";
import { send_json } from "../../app"
import { DB_interface } from '../../logic/db_interface/DB_interface';

const cities_router: Router = Router();

cities_router.get("/list_all", async (req: Request, res: Response) => {
    const db_interface = res.locals.DB_INTERFACE as DB_interface;
    const language_of_user = await get_language_of_user(req, "1", db_interface);
    const result = await db_interface.query(
        `SELECT id, real_name, ${language_of_user}_name, rating, fk_country_id FROM Cities`
    );
    send_json(res, result);
});

cities_router.get("/list_single", async (req: Request, res: Response) => {
    const result = await new DB_interface({
        connectionString: res.locals.DB_URI
    }).query("SELECT * FROM cities WHERE id = $1", [req.params.city_id]);

    send_json(res, result);
});

cities_router.get("/cities_in_country/:country_id", async (req: Request, res: Response) => {
    const result = await new DB_interface({
        connectionString: res.locals.DB_URI
    }).query("SELECT * FROM cities WHERE fk_country_id = $1", [req.params.country_id]);

    send_json(res, result);
});

cities_router.get("/city_of_monument/:monument_id", async (req: Request, res: Response) => {
    const result = await new DB_interface({
        connectionString: res.locals.DB_URI
    }).query("SELECT fk_city_id FROM monuments WHERE id = $1", [req.params.monument_id]);

    send_json(res, result);
});

export default cities_router;