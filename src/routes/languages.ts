import { Router } from 'express';
import { send_json, validate_ids } from '../utils';
import { table, values } from "../logic/tables/utils";

/******************** CONSTANTS ***********************/
const languages_router = Router();
const table_name = "languages";

languages_router.get("/routes", async (req, res) => {
    const routes = [
        { method: "POST", path: "/create_table", body: "NO", is_admin: true },
        { method: "GET", path: "/table_schema", body: "NO", is_admin: false },
        { method: "DELETE", path: "/delete_table", body: "NO", is_admin: true },
        { method: "GET", path: "/all", body: "NO", is_admin: false },
        { method: "GET", path: "/filter_by_id", body: "Query_String", is_admin: false },
        { method: "GET", path: "/filter_single_by_abbreviation/:abbreviation", body: "NO", is_admin: false },
        { method: "GET", path: "/filter_by_users", body: "Query_String", is_admin: false },
        { method: "POST", path: "/insert", body: "JSON", is_admin: true },
        { method: "PUT", path: "/update/:id", body: "JSON", is_admin: true },
        { method: "DELETE", path: "/delete/:id", body: "NO", is_admin: true },
    ];
    res.status(200).json(res.locals.is_admin ? routes : routes.filter(x => !x.is_admin));
});
/************************************** TABLE ***************************************************/
languages_router.post("/create_table", async (req, res) => {
    send_json(res, 
        await table.create(table_name, res.locals.DB_INTERFACE, res.locals.is_admin),
        { success: 201 }
    );
});
languages_router.delete("/delete_table", async (req, res) => {
    send_json(res,
        await table.delete(table_name, res.locals.DB_INTERFACE, res.locals.is_admin)
    );
});
languages_router.get("/table_schema", async (req, res) => {
    send_json(res,
        await table.schema(table_name, res.locals.DB_INTERFACE)
    );
});

/************************************** GET ***************************************************/
languages_router.get("/all", async (req, res) => {
    const db_interface = res.locals.DB_INTERFACE;
    send_json(res, 
        await values.get.all(table_name, db_interface, "*", "ORDER BY name")
    );
});

languages_router.get("/filter_by_id", validate_ids, async (req, res) => {
    const db_interface = res.locals.DB_INTERFACE;
    send_json(res,
        await values.get.by_id(table_name, db_interface, res.locals.ids)
    );
});

languages_router.get("/filter_single_by_abbreviation/:abbreviation", async (req, res) => {
    const db_interface = res.locals.DB_INTERFACE;
    send_json(res,
        await values.get.generic(table_name, db_interface, "*", "WHERE abbreviation = $1", [req.params.abbreviation])
    );
});

languages_router.get("/filter_by_users", async (req, res) => {
    const db_interface = res.locals.DB_INTERFACE;
    send_json(res,
        await values.get.generic(table_name, db_interface, "*", "id = (SELECT fk_language_id FROM Users WHERE id = $1)", [res.locals.UID])
    );
});
/************************************** POST ***************************************************/
languages_router.post("/insert", async (req, res) => {
    send_json(res,
        await values.insert(table_name, res.locals.DB_INTERFACE, res.locals.is_admin, req.body),
        { success: 201 }
    );
});
/************************************** PUT ***************************************************/
languages_router.put("/update/:id", async (req, res) => {
    send_json(res,
        await values.update(table_name, res.locals.DB_INTERFACE, res.locals.is_admin, req.body, req.params.id)
    );
});
/************************************** DELETE ***************************************************/
languages_router.delete("/delete/:id", async (req, res) => {
    send_json(res,
        await values.delete(table_name, res.locals.DB_INTERFACE, res.locals.is_admin, req.params.id)
    );
});

export default languages_router;