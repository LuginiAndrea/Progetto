import {Router, Request, Response} from 'express';
import DB_interface from '../../db_interface/DB_interface';

const continents_router: Router = Router();

continents_router.get("/all_continents", async (req: Request, res: Response) => {
    const result = await new DB_interface({
        connectionString: process.env.PROD_DB_URI
    }).query("SELECT * FROM continents", []);

    if(result.ok)
        res.status(200).send(result.result[0].rows);
    else
        res.status(500).send(result.error);
});
continents_router.get("/single_continents/:continent_id", async (req: Request, res: Response) => {
    const result = await new DB_interface({
        connectionString: process.env.PROD_DB_URI
    }).query("SELECT * FROM continents WHERE continent_id = $1", [req.params.continent_id]);

    if(result.ok)
        res.status(200).send(result.result[0].rows);
    else
        res.status(500).send(result.error);
});
