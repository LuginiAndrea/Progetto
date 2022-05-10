import { Request, Response, NextFunction } from "express";
import { app } from "../../app";

const error_codes = {
    "no_db_interface": "i_db_1",
    "no_db_connection": "i_db_2"
}

function get_db_uri() {
    const DB_URI = process.env.DATABASE_URL || process.env.DEV_DB_URI;
    if(!DB_URI) 
        throw new Error(`Can't connect to Database: Database URL is ${DB_URI}`);
    else
        return DB_URI;
}

function validate_db_status(req: Request, res: Response, next: NextFunction) {
    if(req.originalUrl.endsWith("/reconnect_db")) {
        res.locals.DB_INTERFACE = app.locals.DEFAULT_DB_INTERFACE;
        next();
    }
    if(!app.locals.DEFAULT_DB_INTERFACE)
        res.status(500).send({
            error: error_codes.no_db_interface
        });
    else if (!app.locals.DEFAULT_DB_INTERFACE.connected())
        res.status(500).send({
            error: error_codes.no_db_connection
        });
    else {
        res.locals.DB_INTERFACE = app.locals.DEFAULT_DB_INTERFACE;
        next();
    }
}

function validate_rating(req: Request) {
    const operator = req.query.operator as string;
    const rating = parseInt(req.query.rating as string);
    return [
        ["=", "!=", ">", "<", ">=", "<="].includes(operator) && 
        rating >= 0 &&
        rating <= 5,
        operator,
        rating
    ];
}

    

export { get_db_uri, validate_db_status, error_codes, validate_rating };