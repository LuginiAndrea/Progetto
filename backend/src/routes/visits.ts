import { Router, Request } from 'express';
import { get_language_of_user } from "../logic/users/utils";
import { send_json } from "../utils"
import { req_types as types } from "../logic/db_interface/DB_interface";
import { table, values, error_codes, validate_rating } from '../logic/tables/utils';

/******************** CONSTANTS ***********************/
const visits_router: Router = Router();
const table_name = "visits";
// function get_fields(req : Request, language: string) {
//     return types.exclude_fields_by_language[table_name](language).fields.concat(
//         req.query.join === "1" ?
//             [
//                 ...types.exclude_fields_by_language.continents(language).fields.filter(x => x !== "id"),
//                 ...types.exclude_fields_by_language.countries(language).fields.filter(x => x !== "id"),
//             ] :
//             []
//     );
// }
const join_fields_query = `
    JOIN Countries ON Countries.id = Cities.fk_country_id
    JOIN Continents ON Continents.id = Countries.fk_continent_id
`;

/****************************************** ROUTES **********************************************/
visits_router.options("/", (req, res) => {
    const method_list = [
        { verb: "post", method: "create_table", description: "Creates the table", is_admin: true },
        { verb: "delete", method: "delete_table", description: "Deletes the table", is_admin: true },
        { verb: "get", method: "table_schema", description: "Gets the schema of the table" },
        { verb: "get", method: "list_all", description: "Gives the fields of all the cities"},
        { verb: "get", method: "filter_by_id", description: "Gives the fields of the specified cities" },
        { verb: "get", method: "cities_in_countries", description: "Gives list of all cities in countries passed with the query string" },
        { verb: "get", method: "filter_by_rating", description: "Gives list of all the cities that meets the passed condition and rating passed with query string"},
        { verb: "get", method: "cities_of_monuments", description: "Gives the cities of the monuments passed with the query string" },
        { verb: "post", method: "insert", description: "Inserts a new city. Parameters passed in the body", is_admin: true },
        { verb: "put", method: "update/:country_id", description: "Updates a city. Parameters passed in the body", is_admin: true },
        { verb: "delete", method: "delete/:country_id", description: "Deletes a city", is_admin: true }
    ];
    res.status(200).json(
        res.locals.is_admin ?
            method_list : 
            method_list.filter(x => x.is_admin)
    );
});
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
    const fields = types.get_fields(table_name, table_name).fields.concat([
        `monuments.${language}_name AS monument_name`
    ]);
    send_json(res,
        await values.get.all(table_name, db_interface, fields, "JOIN monuments ON monuments.id = visits.fk_monument_id")
    );
});
visits_router.get("/visits_of_user", async (req, res) => {
    const db_interface = res.locals.DB_INTERFACE;
    const language = await get_language_of_user(res.locals.UID, db_interface);
    const fields = types.get_fields(table_name, table_name).fields.concat([
        `monuments.${language}_name AS monument_name`
    ]);
    console.log(res.locals.UID);
    send_json(res,
        await values.get.generic(table_name, db_interface, fields, "JOIN monuments ON monuments.id = visits.fk_monument_id WHERE visits.fk_user_id = $1", [res.locals.UID]),
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