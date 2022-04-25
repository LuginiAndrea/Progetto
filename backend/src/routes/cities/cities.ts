import {Router, Request, Response} from 'express';
import { send_json } from "../../app"
import { DB_interface } from '../../logic/db_interface/DB_interface';

const cities_router: Router = Router();

cities_router.get("/all_cities", async (req: Request, res: Response) => {
    const result = await new DB_interface({
        connectionString: res.locals.DB_URI
    }).query("SELECT * FROM cities", []);

    send_json(res, result);
});

cities_router.get("/single_city", async (req: Request, res: Response) => {
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

export default cities_router;