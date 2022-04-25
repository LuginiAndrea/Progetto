import {Router, Request, Response} from 'express';
import { send_json } from '../../app';
import { DB_interface } from '../../logic/db_interface/DB_interface';

const continents_router: Router = Router();

continents_router.get("/list_all", async (req: Request, res: Response) => {
    const result = await new DB_interface({
        connectionString: res.locals.DB_URI
    }).query("SELECT * FROM continents", []);

    send_json(res, result);
});

continents_router.get("/single_continent/:continent_id", async (req: Request, res: Response) => {
    const result = await new DB_interface({
        connectionString: res.locals.DB_URI
    }).query("SELECT * FROM continents WHERE id = $1", [req.params.continent_id]);

    send_json(res, result);
});

continents_router.get("/continent_of_country/:country_id", async (req: Request, res: Response) => {
    const result = await new DB_interface({
        connectionString: res.locals.DB_URI
    }).query("SELECT fk_continent_id FROM countries WHERE id = $1", [req.params.country_id]);

    send_json(res, result);
});

export default continents_router;