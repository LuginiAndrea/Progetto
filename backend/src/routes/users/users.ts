import {Router, Request, Response} from 'express';
import { send_json } from '../../utils';
import {DB_interface, req_types as types} from '../../logic/db_interface/DB_interface';

const users_router: Router = Router();

const error_codes = {
    "no_compatible_insert_body": "users_2",
}
    
users_router.post("/create_user", async(req: Request, res: Response) => {
    if(res.locals.role !== "admin") 
        send_json(res, {
            error: "Unauthorized",
        });
    else {
        const data = {
            firebase_id: res.locals.UID,
            ...req.body
        }
        if(types.is_users_body(data)) {
            const db_interface = res.locals.DB_INTERFACE as DB_interface;
            const result = await db_interface.query(`INSERT INTO users (id, language) VALUES ($1, $2)`, [res.locals.UID, req.body.fk_language_id]);
            send_json(res, result);        
        }
        send_json(res, {
            error: error_codes.no_compatible_insert_body
        });
    }
});


users_router.get("/visited_monuments", async(req: Request, res: Response) => {
    const result = await new DB_interface({
        connectionString: res.locals.DB_URI
    }).query(`SELECT DISTINCT fk_monument_id FROM visited_monuments WHERE fk_user_id = $1`, [res.locals.UID]);
});


export default users_router;