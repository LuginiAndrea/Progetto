import {Router, Request, Response} from 'express';
import {DB_interface} from '../../db_interface/DB_interface';

const users_router: Router = Router();
    
users_router.post("/create_user", async(req: Request, res: Response) => {
    if(typeof req.body.fk_language_id === "number") {
        const db = new DB_interface({
            connectionString: res.locals.DB_URI
        });
        const result = await db.query(`INSERT INTO users (id, language) VALUES ($1, $2)`, [res.locals.uid, req.body.fk_language_id]);
        if(result.ok)
            res.status(200).send(result.result);
        else
            res.status(500).send(result.error);
    }
});

export default users_router;