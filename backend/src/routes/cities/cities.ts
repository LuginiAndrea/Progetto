import { Router, Request, Response } from 'express';
import { get_language_of_user } from "../../logic/users/utils";
import { send_json } from "../../utils"
import { DB_interface, req_types as types, validate_rating } from '../../logic/db_interface/DB_interface';
import { table, values, error_codes } from '../../logic/tables/utils';
import { language } from 'googleapis/build/src/apis/language';

/******************** CONSTANTS ***********************/
const cities_router: Router = Router();
const table_name = "cities";
function exclude_fields_by_language(language: string) { //Exclude the fields in a different language
    return types.get_fields("cities",
        x => x.startsWith("real_") || !(x.endsWith("_name") && !x.startsWith(language)),
        false
    )[0];
}
const join_countries = (rest_of_query = "") => "JOIN countries ON cities.fk_country_id = countries.id" + rest_of_query;
const join_countries_filter = (func: (args: any) => string[], language: string) => 
    (args: any) => func(args).concat([`countries.${language}_name as country_name`]);

/****************************************** ROUTES **********************************************/
cities_router.options("/", (req, res) => {
    const method_list = [
        { verb: "post", method: "create_table", description: "Creates the table", is_admin: true },
        { verb: "delete", method: "delete_table", description: "Deletes the table", is_admin: true },
        { verb: "get", method: "table_schema", description: "Gets the schema of the table" },
        { verb: "get", method: "list_all", description: "Gives the fields of all the cities"},
        { verb: "get", method: "list_single/:id", description: "Gives the fields of a single city" },
        { verb: "get", method: "cities_in_countries", description: "Gives list of all cities in countries passed with the query string" },
        { verb: "get", method: "list_by_rating", description: "Gives list of all the cities that meets the passed condition and rating passed with query string"},
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
cities_router.post("/create_table", async (req, res) => {
    send_json(res, 
        await table.create(table_name, res.locals.DB_INTERFACE, res.locals.is_admin),
    );
});
cities_router.get("/table_schema", async (req, res) => {
    send_json(res,
        await table.delete(table_name, res.locals.DB_INTERFACE, res.locals.is_admin),
    );
});
cities_router.delete("/delete_table", async (req, res) => {
    send_json(res,
        await table.schema(table_name, res.locals.DB_INTERFACE),
    );
});
/************************************** GET ***************************************************/
cities_router.get("/list_all", async (req, res) => {
    const db_interface = res.locals.DB_INTERFACE;
    const language = await get_language_of_user(req, res.locals.uid, db_interface);
    send_json(res,
        await values.get.all(table_name, db_interface, join_countries(), {
            func: join_countries_filter(exclude_fields_by_language, language),
            args: language
        })
    );
});

cities_router.get("/list_single/:id", async (req, res) => {
    const db_interface = res.locals.DB_INTERFACE;
    const language = await get_language_of_user(req, res.locals.uid, db_interface);
    send_json(res,
        await values.get.single(table_name, db_interface, req.params.id, join_countries(), {
            func: join_countries_filter(exclude_fields_by_language, language),
            args: language
        })
    );
});

cities_router.get("/list_by_rating", async(req, res) => {
    const {valid, operator, rating} = validate_rating(req);
    if(!valid) 
        send_json(res, error_codes.Invalid_body(table_name));
    else {
        const db_interface = res.locals.DB_INTERFACE;
        const language = await get_language_of_user(req, res.locals.uid, db_interface);
        send_json(res, 
            await values.get.all(table_name, db_interface, 
                join_countries(`WHERE (votes_sum / NULLIF(number_of_votes, 0)) ${operator} ${rating}`), {
                func: join_countries_filter(exclude_fields_by_language, language),
                args: language
            })
        );
    }
});

cities_router.get("/cities_in_countries", async (req, res) => {
    if(!req.query.country_ids) 
        send_json(res, error_codes.No_referenced_item(table_name));
    else {
        const db_interface = res.locals.DB_INTERFACE;
        const language = await get_language_of_user(req, res.locals.UID, db_interface);
        send_json(res,
            await values.get.generic(table_name, db_interface, 
                join_countries(`WHERE fk_country_id = ANY ($1)`), [(req.query.country_ids as string).split(",")], {
                func: join_countries_filter(exclude_fields_by_language, language),
                args: language
            })
        );
    }
});

cities_router.get("/cities_of_monuments", async (req, res) => {
    if(!req.query.monument_ids) 
        send_json(res, error_codes.No_referenced_item(table_name));
    else {
        const db_interface = res.locals.DB_INTERFACE;
        const language = await get_language_of_user(req, res.locals.UID, db_interface);
        send_json(res,
            await values.get.generic(table_name, db_interface, 
                join_countries(`WHERE id = ANY (SELECT fk_city_id FROM monuments WHERE id = ANY($1))`),
                [(req.query.monument_ids as string).split(",")], {
                func: join_countries_filter(exclude_fields_by_language, language),
                args: language
            })
        );
    }
});
/************************************** POST ***************************************************/
cities_router.post("/insert", async (req, res) => {
    send_json(res,
        await values.insert(table_name, res.locals.DB_INTERFACE, res.locals.is_admin, req.body)
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