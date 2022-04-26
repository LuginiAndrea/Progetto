import { Response, Request, NextFunction } from "express";
import { DB_interface } from "../db_interface/DB_interface";
const authenticate_user = (req: Request, res: Response, next: NextFunction) => {
    // Authenticate user with firebase admin
    // puts the user UID in res.locals.uid
    console.log("Authenticated user");
    next();
}

const get_language_of_user = async (uid: string, db_instance: DB_interface) => {
    // The user uid is in res.locals.uid
    // Finish to check this
    const result = await db_instance.query(
        `SELECT abbreviation FROM Languages
        WHERE id = (SELECT fk_language_id FROM Users WHERE firebase_id = $1)`,
        [uid]
    );
    if(result.result)
        return result.result[0].rows
}

export { authenticate_user, get_language_of_user };