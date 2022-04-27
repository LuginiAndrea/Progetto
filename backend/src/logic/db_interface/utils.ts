import { Request, Response, NextFunction } from "express";
import { app } from "../../app";

const get_db_uri = () => {
    const DB_URI = process.env.DATABASE_URL || process.env.DEV_DB_URI;
    if(!DB_URI) 
        throw Error(`Can't connect to Database: Database URL is ${DB_URI}`);
    else
        return DB_URI;
}

const validating_db_status = (req: Request, res: Response, next: NextFunction) => {
    if(!app.locals.DEFAULT_DB_INTERFACE)
        res.status(500).send("Database is not available");
    else {
        res.locals.DB_INTERFACE = app.locals.DEFAULT_DB_INTERFACE;
        next();
    }
}

    

export { get_db_uri, validating_db_status};