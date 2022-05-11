import {Router, Request, Response, NextFunction} from 'express';
import { send_json } from '../../utils';
import { DB_interface } from '../../logic/db_interface/DB_interface';
import { table, values, error_codes } from "../../logic/tables/utils";

/*TODO: Implement use of firebase API such as:
    - retrieve data in selects
    - retrieve user by email
*/

const users_router = Router();
const table_name = "users";

users_router.use((req, res, next) => {
    if(!res.locals.is_admin)
        send_json(res, error_codes.UNAUTHORIZED(table_name));
    else
        next();
});

users_router.options("/", (req, res) => {
    let method_list = [
        { verb: "post", method: "create_table", description: "Creates the table" },
        { verb: "delete", method: "delete_table", description: "Deletes the table" },
        { verb: "get", method: "table_schema", description: "Gets the schema of the table" },
        { verb: "get", method: "list_all", description: "Gives the fields of all the users" },
        { verb: "get", method: "list_single/:id", description: "Gives the fields of a single user" },
        { verb: "get", method: "list_single_by_email/:user_email", description: "Gives the fields of a single user" },
        { verb: "post", method: "insert", description: "Inserts a new user. Parameters passed in the body" },
        { verb: "put", method: "update/:user_id", description: "Updates a user. Parameters passed in the body", },
        { verb: "delete", method: "delete/:user_id", description: "Deletes a user", },
    ];
    res.status(200).json(method_list)
});

users_router.post("/create_table", async (req, res) => {
    send_json(res,
        await table.create(table_name, res.locals.DB_INTERFACE, res.locals.is_admin),
    );
});
users_router.delete("/delete_table", async (req, res) => {
    send_json(res,
        await table.delete(table_name, res.locals.DB_INTERFACE, res.locals.is_admin),
    );
});
users_router.get("/table_schema", async (req, res) => {
    send_json(res,
        await table.schema(table_name, res.locals.DB_INTERFACE),
    );
});

users_router.get("/list_all", async (req, res) => {
    send_json(res,
        await values.get.all(table_name, res.locals.DB_INTERFACE, "ORDER BY id"),
    );
});
users_router.get("/list_single/:id", async (req, res) => {
    send_json(res,
        await values.get.single(table_name, res.locals.DB_INTERFACE, req.params.id)
    )
});

users_router.post("/insert", async (req, res) => {
    send_json(res,
        await values.insert(table_name, res.locals.DB_INTERFACE, res.locals.is_admin, req.body),
    );
});
users_router.put("/update/:id", async (req, res) => {
    send_json(res,
        await values.update(table_name, res.locals.DB_INTERFACE, res.locals.is_admin, req.body, req.params.id),
    );
});
users_router.delete("/delete/:id", async (req, res) => {
    send_json(res,
        await values.delete(table_name, res.locals.DB_INTERFACE, res.locals.is_admin, req.params.id),
    );
});

export default users_router;