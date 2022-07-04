import { app } from "./app"
import { get_db_uri, DB_interface } from "./logic/db_interface/DB_interface";
import { send_generic_error_email } from "./logic/email/email";
import * as admin from "firebase-admin";
import * as fs from "fs/promises";
import * as child_process from "child_process"

app.listen(process.env.PORT || 8080, async () => { // On start connect to Database
    try {
        app.locals.DEFAULT_DB_INTERFACE = new DB_interface({
            connectionString: get_db_uri()
        }, true);
    } 
    catch (error) {
        console.log(error);
        await send_generic_error_email("Error initializing database: ", error);
        process.exit(3);
    }
    try { // Do this
        const service_account = {
            type: process.env.FIREBASE_TYPE,
            project_id: process.env.FIREBASE_PROJECT_ID,
            private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
            private_key: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
            client_email: process.env.FIREBASE_CLIENT_EMAIL,
            client_id: process.env.FIREBASE_CLIENT_ID,
            auth_uri: process.env.FIREBASE_AUTH_URI,
            token_uri: process.env.FIREBASE_TOKEN_URI,
            auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
            client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
        } as any; //Has to be put as any or cert admin.credential.cert will throw type error
        app.locals.FIREBASE_APP = admin.initializeApp({
            credential: admin.credential.cert(service_account),
            storageBucket: process.env.FIREBASE_BUCKET_URL
        });
    }
    catch(error) {
        console.log(error);
        await send_generic_error_email("Error initializing firebase: ", error);
        process.exit(2);
    }
    try { //Download asset from dropbox with the python sdk
        const proc = child_process.spawn("python3", ["./download.py"])
        proc.on("exit", exit_code => {
            if(exit_code === 0) {
                app.locals.MODEL_READY_TO_USE = true;
                console.log("Ready to use");
            }
            else {
                console.log(exit_code)
                process.exit(4);
            }
        });
    }  
    catch(error) {
        console.log(error);
        await send_generic_error_email("Error downloading dropbox: ", error);
        process.exit(4);
    }
});
