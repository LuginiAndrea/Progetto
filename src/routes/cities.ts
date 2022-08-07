import { Router, Request } from 'express';
import { get_language_of_user } from "../logic/users/utils";
import { send_json, validate_ids, validate_rating } from "../utils"
import { req_types as types } from "../logic/db_interface/DB_interface";
import { table, values } from '../logic/tables/utils';

/******************** CONSTANTS ***********************/
const cities_router: Router = Router();
const table_name = "cities";
function get_fields(req: Request, language: string) {
    return types.exclude_fields_by_language[table_name](language).fields.concat(
        req.query.join === "1" ?
            [
                ...types.exclude_fields_by_language.continents(language, "continents").fields.filter(x => x !== "id"),
                ...types.exclude_fields_by_language.countries(language, "countries").fields.filter(x => x !== "id")
            ] :
            []
    );
}
const join_fields_query = `
    JOIN Countries ON Countries.id = Cities.fk_country_id
    JOIN Continents ON Continents.id = Countries.fk_continent_id
`;
cities_router.get("/routes", async (req, res) => {
    const routes = [
        { method: "POST", path: "/create_table", body: "NO", is_admin: true },
        { method: "GET", path: "/table_schema", body: "NO", is_admin: false },
        { method: "DELETE", path: "/delete_table", body: "NO", is_admin: true },
        { method: "GET", path: "/all", body: "NO", is_admin: false },
        { method: "GET", path: "/filter_by_id", body: "Query_String", is_admin: false },
        { method: "GET", path: "/filter_by_rating", body: "Query_String", is_admin: false },
        { method: "GET", path: "/filter_by_countries", body: "Query_String", is_admin: false },
        { method: "GET", path: "/filter_by_monuments", body: "Query_String", is_admin: false },
        { method: "POST", path: "/insert", body: "JSON", is_admin: true },
        { method: "PUT", path: "/update/:id", body: "JSON", is_admin: true },
        { method: "DELETE", path: "/delete/:id", body: "NO", is_admin: true },
    ];
    res.status(200).json(res.locals.is_admin ? routes : routes.filter(x => !x.is_admin));
});
/************************************** TABLE ***************************************************/
cities_router.post("/create_table", async (req, res) => {
    send_json(res, 
        await table.create(table_name, res.locals.DB_INTERFACE, res.locals.is_admin),
        { success: 201 }
    );
});
cities_router.get("/table_schema", async (req, res) => {
    send_json(res,
        await table.schema(table_name, res.locals.DB_INTERFACE),
    );
});
cities_router.delete("/delete_table", async (req, res) => {
    send_json(res,
        await table.delete(table_name, res.locals.DB_INTERFACE, res.locals.is_admin),
    );
});
/************************************** GET ***************************************************/
cities_router.get("/all", async (req, res) => {
    const db_interface = res.locals.DB_INTERFACE;
    const language = await get_language_of_user(res.locals.UID, db_interface);
    const fields = get_fields(req, language);
    send_json(res,
        await values.get.all(table_name, db_interface, fields, join_fields_query)
    );
});
cities_router.get("/filter_by_id", validate_ids, async (req, res) => {
    const db_interface = res.locals.DB_INTERFACE;
    const language = await get_language_of_user(res.locals.UID, db_interface);
    const fields = get_fields(req, language);
    send_json(res,
        await values.get.by_id(table_name, db_interface, res.locals.ids, fields, join_fields_query) 
    );
});
cities_router.get("/filter_by_rating", validate_rating, async(req, res) => {
    const db_interface = res.locals.DB_INTERFACE;
    const language = await get_language_of_user(res.locals.UID, db_interface);
    const fields = get_fields(req, language).concat("(votes_sum / NULLIF(number_of_votes, 0)) as rating");
    send_json(res, 
        await values.get.all(table_name, db_interface, fields, 
            `${join_fields_query} WHERE rating ${res.locals.operator} ${res.locals.rating}`
        )
    );
});
cities_router.get("/filter_by_countries", validate_ids, async (req, res) => {
    const db_interface = res.locals.DB_INTERFACE;
    const language = await get_language_of_user(res.locals.UID, db_interface);
    const fields = get_fields(req, language).filter(x => x !== "fk_country_id");
    send_json(res,
        await values.get.generic(table_name, db_interface, fields, `${join_fields_query} WHERE fk_country_id = ANY($1)`, [res.locals.ids])
    );
});
cities_router.get("/filter_by_monuments", validate_ids, async (req, res) => {
    const db_interface = res.locals.DB_INTERFACE;
    const language = await get_language_of_user(res.locals.UID, db_interface);
    const fields = get_fields(req, language);
    send_json(res,
        await values.get.generic(
            table_name, db_interface, fields, 
            `${join_fields_query} id = ANY (SELECT fk_city_id FROM monuments WHERE id = ANY($1))`, 
            [res.locals.ids]
        )
    );
});
/************************************** POST ***************************************************/
cities_router.post("/insert", async (req, res) => {
    send_json(res,
        await values.insert(table_name, res.locals.DB_INTERFACE, res.locals.is_admin, req.body),
        { success: 201 }
    );
});
/************************************** PUT ***************************************************/
cities_router.put("/update/:id", async (req, res) => {
    send_json(res,
        await values.update(table_name, res.locals.DB_INTERFACE, res.locals.is_admin, req.body, req.params.id)
    );
});
/************************************** DELETE ***************************************************/
cities_router.delete("/delete/:id", async (req, res) => {
    send_json(res,
        await values.delete(table_name, res.locals.DB_INTERFACE, res.locals.is_admin, req.params.id)
    );
});

export default cities_router;