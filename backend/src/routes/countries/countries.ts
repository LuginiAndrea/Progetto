import {Router, Request, Response} from 'express';
import { send_json } from '../../app';
import { DB_interface, DB_result, req_types as types } from '../../logic/db_interface/DB_interface';
import { get_language_of_user } from '../../logic/users/utils';

const countries_router = Router();

// Return whole info about country
countries_router.get("/list_all", async (req: Request, res: Response) => {
    const result = await res.locals.DB_INTERFACE.query("SELECT * FROM countries");
    send_json(res, result);
});

countries_router.get("/list_single/:country_id", async (req: Request, res: Response) => {
    const result = await res.locals.DB_INTERFACE.query("SELECT * FROM countries WHERE id = $1", [req.params.country_id]);
    send_json(res, result);
});

countries_router.get("/list_single_by_iso_code/:country_iso_code", async (req: Request, res: Response) => {
    const result = await res.locals.DB_INTERFACE.query("SELECT * FROM countries WHERE iso_alpha_3 = $1", [req.params.country_iso_code]);
    send_json(res, result);
});

countries_router.get("/countries_in_continent", async (req: Request, res: Response) => { //Passes continent_id/s with it
    const db_interface = await new DB_interface({
        connectionString: res.locals.DB_URI
    });
    const language_of_user = await get_language_of_user(req, "1", db_interface);

    const result = await db_interface.query(
        `SELECT id, real_name, ${language_of_user}_name, iso_alpha_3 FROM countries WHERE fk_continent_id IN ($1`, [req.params.continent_ids]
    );
    send_json(res, result);
});

countries_router.get("/country_of_city/:city_id", async (req: Request, res: Response) => {
    const result = await new DB_interface({
        connectionString: res.locals.DB_URI
    }).query("SELECT fk_country_id FROM Cities WHERE id = $1", [req.params.city_id]);

    send_json(res, result);
});

countries_router.post("/insert", async (req, res) => {
    if(types.is_countries_body(req.body)) {
        const result = await new DB_interface({
            connectionString: res.locals.DB_URI
        }).query(`
            INSERT INTO Countries (real_name, it_name, en_name, iso_alpha_3, fk_continent_id) VALUES ($1, $2, $3, $4, $5)
            RETURNING id;`, 
            [req.body.real_name, req.body.it_name, req.body.en_name, req.body.iso_alpha_3, req.body.fk_continent_id]
        );  
        send_json(res, result);
    }
    else 
        send_json(res, {
            error:"i_1"
        });
});

countries_router.post("/delete", async (req, res) => {
    if(typeof req.body.id === "number") {
        const result = await new DB_interface({
            connectionString: res.locals.DB_URI
        }).query(`DELETE FROM Countries WHERE id = $1;`, [req.body.id]);
        console.log(result);
        send_json(res, result);
    }
    else
        send_json(res, {
            error:"i_1"
        });
});

export default countries_router;