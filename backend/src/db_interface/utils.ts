import { send_generic_error_email } from "../email/email";
const get_db_uri = (req, res, next) => {
    res.locals.DB_URI = process.env.DATABASE_URL || process.env.DEV_DB_URI;
    if(res.locals.DB_URI === undefined) {
        send_generic_error_email(
            "Error connecting to Database",
            "Can't connect to Database: Database URL is undefined"
        );
        res.status(500).send("Can't connect to Database");
    }
    else 
        next();
}

export { get_db_uri };