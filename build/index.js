"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
exports.__esModule = true;
var app_1 = require("./app");
var DB_interface_1 = require("./logic/db_interface/DB_interface");
var email_1 = require("./logic/email/email");
var admin = __importStar(require("firebase-admin"));
app_1.app.listen(process.env.PORT || 8080, function () {
    (0, email_1.send_generic_error_email)("Server started", "Server started");
    try {
        app_1.app.locals.DEFAULT_DB_INTERFACE = new DB_interface_1.DB_interface({
            connectionString: (0, DB_interface_1.get_db_uri)()
        }, true);
    }
    catch (error) {
        (0, email_1.send_generic_error_email)("Error initializing database: ", error);
    }
    try { // Do this
        var service_account = {
            type: process.env.FIREBASE_TYPE,
            project_id: process.env.FIREBASE_PROJECT_ID,
            private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
            private_key: process.env.FIREBASE_PRIVATE_KEY,
            client_email: process.env.FIREBASE_CLIENT_EMAIL,
            client_id: process.env.FIREBASE_CLIENT_ID,
            auth_uri: process.env.FIREBASE_AUTH_URI,
            token_uri: process.env.FIREBASE_TOKEN_URI,
            auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
            client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
        }; //Has to be put as any or cert admin.credential.cert will throw type error
        app_1.app.locals.FIREBASE_APP = admin.initializeApp({
            credential: admin.credential.cert(service_account),
            storageBucket: process.env.FIREBASE_BUCKET_URL
        });
    }
    catch (error) {
        console.log(error);
        (0, email_1.send_generic_error_email)("Error initializing firebase: ", error);
        process.exit(2);
    }
});
