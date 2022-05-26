import {Router} from 'express';
import { send_json } from '../utils';
import { table, values, error_codes } from "../logic/tables/utils";

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
users_router.post("/create_table", async (req, res) => {
    send_json(res,
        await table.create(table_name, res.locals.DB_INTERFACE, res.locals.is_admin),
        {success: 201}
    );
});
users_router.delete("/delete_table", async (req, res) => {
    send_json(res,
        await table.delete(table_name, res.locals.DB_INTERFACE, res.locals.is_admin)
    );
});
users_router.get("/table_schema", async (req, res) => {
    send_json(res,
        await table.schema(table_name, res.locals.DB_INTERFACE)
    );
});
users_router.get("/all", async (req, res) => {
    send_json(res,
        await values.get.all(table_name, res.locals.DB_INTERFACE, "*", "ORDER BY id"),
    );
});
users_router.get("/filter_by_id", async (req, res) => {
    const ids = (req.query.ids as string).split(",") || [];
    if(ids.length === 0) 
        send_json(res, error_codes.NO_REFERENCED_ITEM("ids"));
    else 
        send_json(res,
            await values.get.by_id(table_name, res.locals.DB_INTERFACE, ids)
        );
});

users_router.post("/insert", async (req, res) => {
    send_json(res,
        await values.insert(table_name, res.locals.DB_INTERFACE, res.locals.is_admin, req.body),
        {success: 201}
    );
});
users_router.put("/update/:id", async (req, res) => {
    send_json(res,
        await values.update(table_name, res.locals.DB_INTERFACE, res.locals.is_admin, req.body, req.params.id)
    );
});
users_router.delete("/delete/:id", async (req, res) => {
    send_json(res,
        await values.delete(table_name, res.locals.DB_INTERFACE, res.locals.is_admin, req.params.id)
    );
});

export default users_router;