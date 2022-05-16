import { Router, Request, Response } from 'express';
import { send_json } from '../utils';
import { req_types as types } from '../logic/db_interface/DB_interface';
import { table, values, error_codes, validate_rating } from '../logic/tables/utils';
import { get_language_of_user } from '../logic/users/utils';

/******************** CONSTANTS ***********************/
const monuments_router = Router();
const table_name = "monuments";
function get_fields(req: Request, language: string) {
    return types.exclude_fields_by_language[table_name](language).fields.concat(
        req.query.join === "1" ?
            [
                ...types.exclude_fields_by_language.cities(language, "cities").fields.filter(x => x !== "id"),
                ...types.exclude_fields_by_language.countries(language, "countries").fields.filter(x => x !== "id"),
                ...types.exclude_fields_by_language.continents(language, "language").fields.filter(x => x !== "id"),
            ] :
            []
    );
}
const join_fields_query = `
    JOIN Cities ON Cities.id = Monuments.fk_city_id
    JOIN Countries ON Countries.id = Cities.fk_country_id
    JOIN Continents ON Continents.id = Countries.fk_continent_id
`;
        

/***************************************** TABLE *********************************************/
monuments_router.post("/create_table", async (req, res) => {
    send_json(res,
        await table.create(table_name, res.locals.DB_INTERFACE, res.locals.is_admin),
        {success: 201}
    );
});
monuments_router.delete("/delete_table", async (req, res) => {
    send_json(res,
        await table.delete(table_name, res.locals.DB_INTERFACE, res.locals.is_admin)
    );
});
monuments_router.get("/table_schema", async (req, res) => {
    send_json(res,
        await table.schema(table_name, res.locals.DB_INTERFACE)
    );
});

/***************************************** GET *********************************************/
monuments_router.get("/list_all", async (req, res) => {
    const db_interface = res.locals.DB_INTERFACE;
    const language = await get_language_of_user( res.locals.UID, db_interface);
    const fields = get_fields(req, language);
    send_json(res,
        await values.get.all(table_name, db_interface, fields, join_fields_query)
    );
});
monuments_router.get("/markers", async (req, res) => {
    const db_interface = res.locals.DB_INTERFACE;
    const language = await get_language_of_user( res.locals.UID, db_interface);
    const fields = ["real_name", `${language}_name`, "ST_X(coordinates::geometry) AS longitude", "ST_Y(coordinates::geometry) AS latitude"];
    send_json(res,
        await values.get.all(table_name, db_interface, fields)
    );
});
monuments_router.get("/list_by_id", async (req, res) => {
    const ids = (req.query.ids as string).split(",") || [];
    if(ids.length === 0) 
        send_json(res, error_codes.NO_REFERENCED_ITEM("ids"));
    else {}
    const db_interface = res.locals.DB_INTERFACE;
    const language = await get_language_of_user( res.locals.UID, db_interface);
    const fields = get_fields(req, language);
    send_json(res, 
        await values.get.by_id(table_name, db_interface, ids, fields, join_fields_query)
    );
});
monuments_router.get("/list_by_rating", async (req, res) => {
    const {valid, operator, rating} = validate_rating(req);
    if(!valid)
        send_json(res, error_codes.INVALID_BODY(table_name));
    else {
        const db_interface = res.locals.DB_INTERFACE;
        const language = await get_language_of_user( res.locals.UID, db_interface);
        const fields = get_fields(req, language).concat("(votes_sum / NULLIF(number_of_votes, 0)) as rating");
        send_json(res, 
            await values.get.all(table_name, db_interface, fields, `${join_fields_query} WHERE rating ${operator} ${rating}`)
        );
    }
});

monuments_router.get("/monuments_in_cities", async (req, res) => {
    const ids = (req.query.ids as string).split(",") || [];
    if(ids.length === 0) 
        send_json(res, error_codes.NO_REFERENCED_ITEM("ids"));
    else {
        const db_interface = res.locals.DB_INTERFACE;
        const language = await get_language_of_user( res.locals.UID, db_interface);
        const fields = get_fields(req, language);
        send_json(res,
            await values.get.generic(table_name, db_interface, fields, `${join_fields_query} WHERE fk_city_id = ANY ($1)`, [ids])
        );
    }
});

monuments_router.get("/monuments_of_visits", async (req, res) => {
    const ids = (req.query.ids as string).split(",") || [];
    if(ids.length === 0) 
        send_json(res, error_codes.NO_REFERENCED_ITEM("ids"));
    else {
        const db_interface = res.locals.DB_INTERFACE
        const language = await get_language_of_user( res.locals.UID, db_interface);
        const fields = get_fields(req, language);
        send_json(res,
            await values.get.generic(table_name, db_interface, fields, 
                `${join_fields_query} WHERE id = ANY (SELECT fk_monument_id = ANY ($1))`, 
                [ids]
            )
        );
    }
});
/******************************** POST *****************************/
monuments_router.post("/insert", async (req, res) => {
    send_json(res,
        await values.insert(table_name, res.locals.DB_INTERFACE, res.locals.role, req.body),
        {success: 201}
    );
});
/************************************** PUT ***************************************************/
monuments_router.put("/update/:id", async (req, res) => {
    send_json(res,
        await values.update(table_name, res.locals.DB_INTERFACE, res.locals.role, req.body, req.params.id)
    );
});
/************************************** DELETE ***************************************************/
monuments_router.delete("/delete/:id", async (req, res) => {
    send_json(res,
        await values.delete(table_name, res.locals.DB_INTERFACE, res.locals.role, req.params.id)
    );
});

export default monuments_router;