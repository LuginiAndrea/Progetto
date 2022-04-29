import { Request, Response, NextFunction } from "express";
import { app } from "../../app";

const error_codes = {
    "no_db_istance": "i_db_1",
    "no_db_connection": "i_db_2"
}

function get_db_uri() {
    const DB_URI = process.env.DATABASE_URL || process.env.DEV_DB_URI;
    if(!DB_URI) 
        throw new Error(`Can't connect to Database: Database URL is ${DB_URI}`);
    else
        return DB_URI;
}

function validating_db_status(req: Request, res: Response, next: NextFunction) {
    if(!app.locals.DEFAULT_DB_INTERFACE)
        res.status(500).send({
            error: error_codes.no_db_istance
        });
    else {
        res.locals.DB_INTERFACE = app.locals.DEFAULT_DB_INTERFACE;
        next();
    }
}

    

export { get_db_uri, validating_db_status, error_codes };