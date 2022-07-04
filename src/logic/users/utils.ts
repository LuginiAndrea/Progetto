import { Response, Request, NextFunction } from "express";
import { DB_interface } from "../db_interface/DB_interface";
import { app } from "../../app";
import * as admin from "firebase-admin";
import { error_codes } from "../tables/utils";
import { send_json } from "../../utils";

async function authenticate_user(req: Request, res: Response, next: NextFunction) {
    // Authenticate user with firebase admin
    // puts the user UID in res.locals.UID
    /******************** ENABLE IN PROD ***************/
    // const firebase_app = app.locals.FIREBASE_APP as admin.app.App;
    // const auth_token = req.headers.authorization;
    // if(auth_token) {
    //     try {
    //         const decoded_token = await firebase_app.auth().verifyIdToken(auth_token);
    //         res.locals.UID = decoded_token.uid;
    //         res.locals.is_admin = (res.locals.UID === process.env.FIREBASE_SUPERADMIN_UID);
    //         next();
    //     }
    //     catch(error) {
    //         console.log(`Token ${auth_token} not valid`);
    //         send_json(res, error_codes.NOT_VALID_TOKEN("authentication"));
    //     }
    // }
    // else {
    //     send_json(res, error_codes.NO_AUTH_TOKEN("authentication"));
    // }
    /******************** DISABLE IN PROD ***************/
    res.locals.UID = req.headers.authorization || "1234";
    res.locals.is_admin = res.locals.UID === "1";
    next();
}

//Implementare lettura dall'header della risposta
// nel caso sia presente 

async function get_language_of_user(uid: string, db_instance: DB_interface) {
    const result = await db_instance.query(
        `SELECT abbreviation FROM Languages
        WHERE id = (SELECT fk_language_id FROM Users WHERE id = $1)`, [uid]
    );
    if(result === "42P01") return "en";
    if(typeof result === "string") throw Error(result);
    return result[0].rows[0]?.abbreviation || "en"; //return abbreviation or "en"
}

export { authenticate_user, get_language_of_user };