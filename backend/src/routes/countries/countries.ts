import {Router, Request, Response} from 'express';
import { DB_interface } from '../../db_interface/DB_interface';

const countries_router = Router();

countries_router.get("/all_countries", async (req: Request, res: Response) => {
    const result = await new DB_interface({
        connectionString: res.locals.DB_URI
    }).query("SELECT * FROM countries", []);

    if(result.ok)
        res.status(200).send(result.result[0].rows);
    else
        res.status(500).send(result.error);
});

countries_router.get("/single_countries/:country_id", async (req: Request, res: Response) => {
    const result = await new DB_interface({
        connectionString: res.locals.DB_URI
    }).query("SELECT * FROM countries WHERE id = $1", [req.params.country_id]);

    if(result.ok)
        res.status(200).send(result.result[0].rows);
    else
        res.status(500).send(result.error);
});

countries_router.get("/countries_in_continent/:continent_id", async (req: Request, res: Response) => {
    const result = await new DB_interface({
        connectionString: res.locals.DB_URI
    }).query("SELECT * FROM countries WHERE fk_continent_id = $1", [req.params.continent_id]);

    if(result.ok)
        res.status(200).send(result.result[0].rows);
    else
        res.status(500).send(result.error);
});

countries_router.get("/country_by_iso_code/:country_iso_code", async (req: Request, res: Response) => {
    const result = await new DB_interface({
        connectionString: res.locals.DB_URI
    }).query("SELECT * FROM countries WHERE iso_alpha_3 = $1", [req.params.country_iso_code]);

    if(result.ok)
        res.status(200).send(result.result[0].rows);
    else
        res.status(500).send(result.error);
});

export default countries_router;