"use strict";
exports.__esModule = true;
var app_1 = require("./app");
var DB_interface_1 = require("./logic/db_interface/DB_interface");
var email_1 = require("./logic/email/email");
app_1.app.listen(process.env.PORT || 8080, function () {
    try {
        app_1.app.locals.DEFAULT_DB_INTERFACE = new DB_interface_1.DB_interface({
            connectionString: (0, DB_interface_1.get_db_uri)()
        }, true);
    }
    catch (error) {
        (0, email_1.send_generic_error_email)("Error initializing database: ", error);
        app_1.app.locals.DEFAULT_DB_INTERFACE = null;
    }
});
