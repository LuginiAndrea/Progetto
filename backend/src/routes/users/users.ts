import {Router, Request, Response} from 'express';
import { send_json } from '../../app';
import {DB_interface} from '../../logic/db_interface/DB_interface';

const users_router: Router = Router();
    
users_router.post("/create_user", async(req: Request, res: Response) => {
    if(typeof req.body.fk_language_id === "number") {
        const result = await new DB_interface({
            connectionString: res.locals.DB_URI
        }).query(`INSERT INTO users (id, language) VALUES ($1, $2)`, [res.locals.uid, req.body.fk_language_id]);
        send_json(res, result);        
    }
    res.status(400).send("Fk_language_id is not a number");
});


users_router.get("/visited_monuments", async(req: Request, res: Response) => {
    const result = await new DB_interface({
        connectionString: res.locals.DB_URI
    }).query(`SELECT DISTINCT fk_monument_id FROM visited_monuments WHERE fk_user_id = $1`, [res.locals.uid]);
});


export default users_router;