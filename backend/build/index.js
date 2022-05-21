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
var service_account = require("../firebase-auth.json");
app_1.app.listen(process.env.PORT || 8080, function () {
    try {
        app_1.app.locals.DEFAULT_DB_INTERFACE = new DB_interface_1.DB_interface({
            connectionString: (0, DB_interface_1.get_db_uri)()
        }, true);
    }
    catch (error) {
        (0, email_1.send_generic_error_email)("Error initializing database: ", error);
    }
    try { // Do this
        app_1.app.locals.FIREBASE_APP = admin.initializeApp({
            credential: admin.credential.cert(service_account)
        });
    }
    catch (error) {
        (0, email_1.send_generic_error_email)("Error initializing firebase: ", error);
        process.exit(2);
    }
});
