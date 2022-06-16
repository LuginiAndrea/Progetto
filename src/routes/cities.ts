import { Router, Request, Response } from 'express';
import { get_language_of_user } from "../logic/users/utils";
import { send_json } from "../utils"
import { req_types as types } from "../logic/db_interface/DB_interface";
import { table, values, error_codes, validate_rating } from '../logic/tables/utils';

/******************** CONSTANTS ***********************/
const cities_router: Router = Router();
const table_name = "cities";
function get_fields(req : Request, language: string) {
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
cities_router.get("/filter_by_id", async (req, res) => {
    const ids = (req.query.ids as string).split(",") || [];
    if(ids.length === 0) 
        send_json(res, error_codes.NO_REFERENCED_ITEM("ids"));
    else {
        const db_interface = res.locals.DB_INTERFACE;
        const language = await get_language_of_user(res.locals.UID, db_interface);
        const fields = get_fields(req, language);
        send_json(res,
            await values.get.by_id(table_name, db_interface, ids, fields, join_fields_query) 
        );
    }
});
cities_router.get("/filter_by_rating", async(req, res) => {
    const {valid, operator, rating} = validate_rating(req);
    if(!valid) 
        send_json(res, error_codes.INVALID_BODY(table_name));
    else {
        const db_interface = res.locals.DB_INTERFACE;
        const language = await get_language_of_user(res.locals.UID, db_interface);
        const fields = get_fields(req, language).concat("(votes_sum / NULLIF(number_of_votes, 0)) as rating");
        send_json(res, 
            await values.get.all(table_name, db_interface, fields, `${join_fields_query} WHERE rating ${operator} ${rating}`)
        );
    }
});
cities_router.get("/filter_by_countries", async (req, res) => {
    const ids = (req.query.ids as string).split(",") || [];
    if(ids.length === 0) 
        send_json(res, error_codes.NO_REFERENCED_ITEM("ids"));
    else {
        const db_interface = res.locals.DB_INTERFACE;
        const language = await get_language_of_user(res.locals.UID, db_interface);
        const fields = get_fields(req, language).filter(x => x !== "fk_country_id");
        send_json(res,
            await values.get.generic(table_name, db_interface, fields, `${join_fields_query} WHERE fk_country_id = ANY($1)`, [ids])
        );
    }
});
cities_router.get("/filter_by_monuments", async (req, res) => {
    const ids = (req.query.ids as string).split(",") || [];
    if(ids.length === 0) 
        send_json(res, error_codes.NO_REFERENCED_ITEM("ids"));
    else {
        const db_interface = res.locals.DB_INTERFACE;
        const language = await get_language_of_user(res.locals.UID, db_interface);
        const fields = get_fields(req, language);
        send_json(res,
            await values.get.generic(table_name, db_interface, fields, 
                `${join_fields_query} id = ANY (SELECT fk_city_id FROM monuments WHERE id = ANY($1))`, 
                [ids]
            )
        );
    }
});
/************************************** POST ***************************************************/
cities_router.post("/insert", async (req, res) => {
    send_json(res,
        await values.insert(table_name, res.locals.DB_INTERFACE, res.locals.is_admin, req.body),
        {success: 201}
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