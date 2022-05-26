import { Router, Request } from 'express';
import { send_json } from '../utils';
import { req_types as types } from '../logic/db_interface/DB_interface';
import { table, values, error_codes, validate_rating } from '../logic/tables/utils';
import { get_language_of_user } from '../logic/users/utils';

/******************** CONSTANTS ***********************/
const monuments_router = Router();
const table_name = "monuments";
function get_fields(req: Request, language: string) {
    return types.exclude_fields_by_language[table_name](language).fields        
        .filter(x => !x.includes("coordinates"))
        .concat(["ST_X(coordinates::geometry) AS longitude", "ST_Y(coordinates::geometry) AS latitude", ...(
            req.query.join === "1" ?
                [
                    ...types.exclude_fields_by_language.cities(language, "cities").fields.filter(x => x !== "id"),
                    ...types.exclude_fields_by_language.countries(language, "countries").fields.filter(x => x !== "id"),
                    ...types.exclude_fields_by_language.continents(language, "language").fields.filter(x => x !== "id"),
                ] :
                []
            )
        ]);
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
monuments_router.get("/all", async (req, res) => {
    const db_interface = res.locals.DB_INTERFACE;
    const language = await get_language_of_user(res.locals.UID, db_interface);
    const fields = get_fields(req, language)
        .filter(x => x !== "monuments_coordinates")
        .concat(["ST_X(coordinates::geometry) AS longitude", "ST_Y(coordinates::geometry) AS latitude"]);
    send_json(res,
        await values.get.all(table_name, db_interface, fields, join_fields_query)
    );
});
monuments_router.get("/markers", async (req, res) => {
    const db_interface = res.locals.DB_INTERFACE;
    const language = await get_language_of_user(res.locals.UID, db_interface);
    const fields = ["real_name", `${language}_name`, "ST_X(coordinates::geometry) AS longitude", "ST_Y(coordinates::geometry) AS latitude"];
    send_json(res,
        await values.get.all(table_name, db_interface, fields)
    );
});
monuments_router.get("/markers_by_distance", async (req, res) => {
    const distance = parseInt(req.query.distance as string);
    const longitude = parseFloat(req.query.longitude as string);
    const latitude = parseFloat(req.query.latitude as string);
    if(!distance || !longitude || !latitude) 
        send_json(res, error_codes.INVALID_QUERY("distance, coordinates"));
    else {
        const db_interface = res.locals.DB_INTERFACE;
        const language = await get_language_of_user(res.locals.UID, db_interface);
        const fields = ["real_name", `${language}_name`, "ST_X(coordinates::geometry) AS longitude", "ST_Y(coordinates::geometry) AS latitude"];
        send_json(res,
            await values.get.generic(table_name, db_interface, fields, 
                `WHERE ST_DWithin(coordinates, ST_GeographyFromText('SRID=4326;POINT(${longitude} ${latitude})'), ${distance})`
            )
        );
    }
});
monuments_router.get("/filter_by_id", async (req, res) => {
    const ids = (req.query.ids as string).split(",") || [];
    if(ids.length === 0) 
        send_json(res, error_codes.NO_REFERENCED_ITEM("ids"));
    else {}
    const db_interface = res.locals.DB_INTERFACE;
    const language = await get_language_of_user(res.locals.UID, db_interface);
    const fields = get_fields(req, language).concat("visits.fk_monument_id AS visit_fk_monument_id");
    send_json(res, 
        await values.get.generic(table_name, db_interface, fields, 
            join_fields_query + `LEFT JOIN visits ON visits.fk_monument_id = monuments.id
            WHERE visits.fk_user_id = $1 AND monuments.id = ANY ($2)`, [res.locals.UID,ids]) 
    ); 
    // WHERE visits.fk_user_id = $1 AND monuments.id = ANY ($2) [res.locals.UID,ids] 
});
monuments_router.get("/filter_by_rating", async (req, res) => {
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
monuments_router.get("/filter_by_cities", async (req, res) => {
    const ids = req.query.ids ? 
        (req.query.ids as string).split(",") :
        [];
    if(ids.length === 0) 
        send_json(res, error_codes.NO_REFERENCED_ITEM("ids"));
    else {
        const db_interface = res.locals.DB_INTERFACE;
        const language = await get_language_of_user(res.locals.UID, db_interface);
        const fields = get_fields(req, language);
        send_json(res,
            await values.get.generic(table_name, db_interface, fields, `${join_fields_query} WHERE fk_city_id = ANY ($1)`, [ids])
        );
    }
});
monuments_router.get("/filter_by_visits", async (req, res) => {
    const ids = req.query.ids ? 
        (req.query.ids as string).split(",") :
        [];
    if(ids.length === 0) 
        send_json(res, error_codes.NO_REFERENCED_ITEM("ids"));
    else {
        const db_interface = res.locals.DB_INTERFACE
        const language = await get_language_of_user(res.locals.UID, db_interface);
        const fields = get_fields(req, language);
        send_json(res,
            await values.get.generic(table_name, db_interface, fields, 
                `${join_fields_query} WHERE id = ANY (SELECT fk_monument_id = ANY ($1))`, 
                [ids]
            )
        );
    }
});
monuments_router.get("/filter_by_types", async (req, res) => {
    const ids = req.query.ids ?
        (req.query.ids as string).split(",") :
        [];
    if(ids.length === 0)
        send_json(res, error_codes.NO_REFERENCED_ITEM("ids"));
    else {
        const db_interface = res.locals.DB_INTERFACE;
        const language = await get_language_of_user(res.locals.UID, db_interface);
        const fields = get_fields(req, language).concat([
            `types_of_monuments.${language}_name AS type_name`, `types_of_monuments.real_name AS type_real_name`
        ]);
        send_json(res,
            await values.get.generic(table_name, db_interface, fields, `${join_fields_query} 
                JOIN monument_types ON monuments.id = monument_types.fk_monument_id    
                JOIN types_of_monuments ON types_of_monuments.id = monument_types.fk_type_id
                WHERE monument_types.fk_type_id = ANY($1)`, [ids]
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