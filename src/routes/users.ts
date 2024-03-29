import { NextFunction, Router, Request, Response } from 'express';
import { send_json, validate_ids } from '../utils';
import { table, values, error_codes } from "../logic/tables/utils";

const users_router = Router();
const table_name = "users";

users_router.get("/routes", async (req, res) => {
    const routes = [
        { method: "POST", path: "/create_table", body: "NO", is_admin: true },
        { method: "GET", path: "/table_schema", body: "NO", is_admin: true },
        { method: "DELETE", path: "/delete_table", body: "NO", is_admin: true },
        { method: "GET", path: "/all", body: "NO", is_admin: true },
        { method: "GET", path: "/filter_by_id", body: "Query_String", is_admin: true },
        { method: "GET", path: "/user", body: "NO", is_admin: false},
        { method: "GET", path: "/exists", body: "NO", is_admin: false},
        { method: "POST", path: "/insert", body: "JSON", is_admin: false },
        { method: "PUT", path: "/update/:id", body: "JSON", is_admin: false },
        { method: "DELETE", path: "/delete/:id", body: "NO", is_admin: false },
    ];
    res.status(200).json(res.locals.is_admin ? routes : routes.filter(x => !x.is_admin));
});

async function authorize (req: Request, res: Response, next: NextFunction) {
    if(!res.locals.is_admin)
        send_json(res, error_codes.UNAUTHORIZED(table_name));
    else
        next();
};

users_router.post("/create_table", async (req, res) => {
    send_json(res,
        await table.create(table_name, res.locals.DB_INTERFACE, res.locals.is_admin),
        { success: 201 }
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
users_router.get("/all", authorize, async (req, res) => {
    send_json(res,
        await values.get.all(table_name, res.locals.DB_INTERFACE, "*", "ORDER BY id"),
    );
});
users_router.get("/filter_by_id", authorize, validate_ids, async (req, res) => {
    send_json(res,
        await values.get.by_id(table_name, res.locals.DB_INTERFACE, res.locals.ids)
    );
});

users_router.get("/user", async (req, res) => {
    send_json(res, 
        await values.get.by_id(table_name, res.locals.DB_INTERFACE, [res.locals.UID])   
    );
})

users_router.get("/exists", async(req, res) => {
    const result = await values.get.by_id(table_name, res.locals.DB_INTERFACE, [res.locals.UID])   
    if(typeof result === "string") 
        send_json(res, result);
    else
        res.status(200).json({exists: result[0].rowCount === 1});
});

users_router.post("/insert", async (req, res) => {
    send_json(res,
        await values.insert(table_name, res.locals.DB_INTERFACE, true, {id: res.locals.UID, ...req.body}),
        { success: 201 }
    );
});
users_router.put("/update/:id", async (req, res) => {
    send_json(res,
        await values.update(table_name, res.locals.DB_INTERFACE, true, req.body, res.locals.UID)
    );
});
users_router.delete("/delete/:id", async (req, res) => {
    send_json(res,
        await values.delete(table_name, res.locals.DB_INTERFACE, true, res.locals.UID)
    );
});

export default users_router;