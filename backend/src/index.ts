import { app } from "./app"
import { get_db_uri, DB_interface } from "./logic/db_interface/DB_interface";
import { send_generic_error_email } from "./logic/email/email";

app.listen(process.env.PORT || 8080, () => { // On start connect to Database
    try {
        app.locals.DEFAULT_DB_INTERFACE = new DB_interface({
            connectionString: get_db_uri()
        }, true);
    } 
    catch (error) {
        send_generic_error_email("Error initializing database: ", error);
        app.locals.DEFAULT_DB_INTERFACE = null;
    }
});
