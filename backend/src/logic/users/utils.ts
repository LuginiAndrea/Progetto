import { Response, Request, NextFunction } from "express";
import { language } from "googleapis/build/src/apis/language";
import { DB_interface } from "../db_interface/DB_interface";

async function authenticate_user (req: Request, res: Response, next: NextFunction) {
    // Authenticate user with firebase admin
    // puts the user UID in res.locals.UID
    // also puts in user.role the role of the user
    res.locals.UID = req.headers.authorization || "1234";
    // console.log(res.locals.UID);
    res.locals.is_admin = res.locals.UID === "1"
    // console.log("Authenticated user");
    next();
}

//Implementare lettura dall'header della risposta
// nel caso sia presente 

async function get_language_of_user (req: Request, uid: string, db_instance: DB_interface) {
    // The user uid is in res.locals.UID
    // Finish to check this
    // return "en";
    const result = await db_instance.query(
        `SELECT abbreviation FROM Languages
        WHERE id = (SELECT fk_language_id FROM Users WHERE id = $1)`, [uid]
    );
    if(typeof result === "string") throw Error(result);
    return result[0].rows[0].abbreviation || "en"; //return abbreviation or "en"
}

export { authenticate_user, get_language_of_user };