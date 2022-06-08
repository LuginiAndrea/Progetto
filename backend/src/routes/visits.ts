import { Router, Request } from 'express';
import { get_language_of_user } from "../logic/users/utils";
import { send_json } from "../utils"
import { req_types as types } from "../logic/db_interface/DB_interface";
import { table, values, error_codes, validate_rating } from '../logic/tables/utils';

/******************** CONSTANTS ***********************/
const visits_router: Router = Router();
const table_name = "visits";
function get_fields(req: Request, language: string) {
    return types.get_fields(table_name, table_name).fields.concat(
        [`monuments.${language}_name AS monument_name`, `ST_X(coordinates::geometry) AS longitude`, `ST_Y(coordinates::geometry) AS latitude`]
    );
}
const join_fields_query = `
    JOIN monuments ON monuments.id = visits.fk_monument_id
`;
/************************************** TABLE ***************************************************/
visits_router.post("/create_table", async (req, res) => {
    send_json(res, 
        await table.create(table_name, res.locals.DB_INTERFACE, res.locals.is_admin),
        { success: 201 }
    );
});
visits_router.get("/table_schema", async (req, res) => {
    send_json(res,
        await table.schema(table_name, res.locals.DB_INTERFACE),
    );
});
visits_router.delete("/delete_table", async (req, res) => {
    send_json(res,
        await table.delete(table_name, res.locals.DB_INTERFACE, res.locals.is_admin),
    );
});
/************************************** LIST ***************************************************/   
visits_router.get("/all", async (req, res) => {
    const db_interface = res.locals.DB_INTERFACE;
    const language = await get_language_of_user(res.locals.UID, db_interface);
    const fields = get_fields(req, language);
    send_json(res,
        await values.get.all(table_name, db_interface, fields, join_fields_query)
    );
});
visits_router.get("/filter_by_single_user", async (req, res) => {
    const db_interface = res.locals.DB_INTERFACE;
    const language = await get_language_of_user(res.locals.UID, db_interface);
    const fields = get_fields(req, language);
    send_json(res,
        await values.get.generic(table_name, db_interface, fields, `${join_fields_query} WHERE visits.fk_user_id = $1`, [res.locals.UID]),
    );
});

visits_router.post("/insert", async (req, res) => {
    const body = {
        fk_user_id: res.locals.UID,
        ...req.body
    };
    send_json(res,
        await values.insert(table_name, res.locals.DB_INTERFACE, res.locals.role, body),
        { success: 201 }
    );
});

visits_router.put("/update/:id", async (req, res) => {
    send_json(res,
        await values.update(table_name, res.locals.DB_INTERFACE, res.locals.role, req.body, req.params.id)
    );
});

visits_router.delete("/delete/:id", async (req, res) => {
    send_json(res,
        await values.delete(table_name, res.locals.DB_INTERFACE, res.locals.role, req.params.id)
    );
});
export default visits_router;