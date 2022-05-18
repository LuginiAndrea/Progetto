import { app } from "./app"
import { get_db_uri, DB_interface } from "./logic/db_interface/DB_interface";
import { send_generic_error_email } from "./logic/email/email";
import { initializeApp } from "firebase/app";

app.listen(process.env.PORT || 8080, () => { // On start connect to Database
    try {
        app.locals.DEFAULT_DB_INTERFACE = new DB_interface({
            connectionString: get_db_uri()
        }, true);
    } 
    catch (error) {
        send_generic_error_email("Error initializing database: ", error);
        process.exit(2);
    }
    try { // Do this
        app.locals.FIREBASE_APP = initializeApp({
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,
            projectId: process.env.FIREBASE_PROJECT_ID,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            appId: process.env.FIREBASE_APP_ID,
            measurementId: process.env.FIREBASE_MEASUREMENT_ID
        });
    }
    catch(error) {
        send_generic_error_email("Error initializing firebase: ", error);
        process.exit(3);
    }
});
