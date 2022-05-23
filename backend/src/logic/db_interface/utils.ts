import { Request, Response, NextFunction } from "express";
import { app } from "../../app";
import { send_json } from "../../utils";

const error_codes = {
    NO_DB_INTERFACE: "i_No interface",
    NO_DB_CONNECTION: "i_Not connected"
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
    }   //Check the database connection status
    if(!app.locals.DEFAULT_DB_INTERFACE)
        send_json(res, error_codes.NO_DB_INTERFACE)
    else if (!app.locals.DEFAULT_DB_INTERFACE.connected())
        send_json(res, error_codes.NO_DB_CONNECTION)
    else {
        res.locals.DB_INTERFACE = app.locals.DEFAULT_DB_INTERFACE;
        next();
    }
}
   
export { get_db_uri, validate_db_status, error_codes };