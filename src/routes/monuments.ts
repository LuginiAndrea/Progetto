import { Router, Request } from 'express';
import { send_json } from '../utils';
import { req_types as types } from '../logic/db_interface/DB_interface';
import { table, values, error_codes, validate_rating } from '../logic/tables/utils';
import { get_language_of_user } from '../logic/users/utils';
import { getStorage } from "firebase-admin/storage";
import multer from "multer";
const upload = multer({ dest: 'uploads/' })
import * as fs from "fs";
import * as tf from '@tensorflow/tfjs-node'



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
     
monuments_router.get("/routes", async (req, res) => {
    const routes = [
        { method: "POST", path: "/create_table", body: "NO", is_admin: true },
        { method: "GET", path: "/table_schema", body: "NO", is_admin: false },
        { method: "DELETE", path: "/delete_table", body: "NO", is_admin: true },
        { method: "GET", path: "/all", body: "NO", is_admin: false },
        { method: "GET", path: "/discover", body: "NO", is_admin: false },
        { method: "GET", path: "/markers", body: "NO", is_admin: false },
        { method: "GET", path: "/markers_by_distance", body: "Query_String", is_admin: false },
        { method: "GET", path: "/filter_by_id", body: "Query_String", is_admin: false },
        { method: "GET", path: "/filter_by_rating", body: "Query_String", is_admin: false },
        { method: "GET", path: "/filter_by_cities", body: "Query_String", is_admin: false },
        { method: "GET", path: "/filter_by_visits", body: "Query_String", is_admin: false },
        { method: "GET", path: "/filter_by_types", body: "Query_String", is_admin: false },
        { method: "POST", path: "/insert", body: "JSON", is_admin: true },
        { method: "PUT", path: "/update/:id", body: "JSON", is_admin: true },
        { method: "DELETE", path: "/delete/:id", body: "NO", is_admin: true },
    ];
    res.status(200).json(res.locals.is_admin ? routes : routes.filter(x => !x.is_admin));
});


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
    if(req.query.ids === undefined) { send_json(res, error_codes.INVALID_QUERY("ids")); return; }
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
/* 3 raccomandazioni:
    - 1: monumento non visitato col rating più alto in generale
    - 2: monumento non visitato col rating più altodel type del monumento più amato dall'utente
    - 3: monumento non visitato col rating più alto della città più amata dall'utente
*/
monuments_router.get("/discover", async (req, res) => {
    const db_interface = res.locals.DB_INTERFACE;
    const language = await get_language_of_user(res.locals.UID, db_interface);
    // LEFT JOIN visits ON visits.fk_monument_id = monuments.id
    // WHERE visits.fk_user_id = $1 AND visits.fk_monument_id IS NULL
    let result = [ //Greatest is needed to avoid / by 0 problems, will still give 0 because if number_of_votes is 0, then votes_sum is 0 too
        values.get.generic("monuments", db_interface, get_fields(req, language), `
            WHERE monuments.id NOT IN (SELECT fk_monument_id FROM visits WHERE fk_user_id = $1)
            ORDER BY (votes_sum / GREATEST(number_of_votes, 1)) DESC, number_of_votes DESC
            LIMIT 1`, [res.locals.UID]
        ), //May replace it with a UNION query after remodeling with PRISMA
        values.get.generic("monuments", db_interface, get_fields(req, language), `
            JOIN monument_types ON monuments.id = monument_types.fk_monument_id
            AND monument_types.fk_type_id = ANY(
                SELECT fk_type_id FROM monument_types JOIN visits ON visits.fk_monument_id = monument_types.fk_monument_id
                WHERE visits.fk_user_id = $1
                GROUP BY fk_type_id
                ORDER BY SUM(rating) DESC
                FETCH FIRST 1 ROWS WITH TIES
            ) 
            AND monuments.id NOT IN (SELECT fk_monument_id FROM visits WHERE fk_user_id = $1)
            ORDER BY (votes_sum / GREATEST(number_of_votes, 1)) DESC, number_of_votes DESC
            LIMIT 1`, [res.locals.UID]
        ),
        values.get.generic("monuments", db_interface, get_fields(req, language), `
            WHERE monuments.fk_city_id = (
                SELECT fk_city_id FROM monuments JOIN visits ON visits.fk_monument_id = monuments.id
                WHERE visits.fk_user_id = $1
                GROUP BY fk_city_id
                ORDER BY SUM(rating) DESC
                FETCH FIRST 1 ROWS WITH TIES
            )
            AND monuments.id NOT IN (SELECT fk_monument_id FROM visits WHERE fk_user_id = $1)
            ORDER BY (votes_sum / GREATEST(number_of_votes, 1)) DESC, number_of_votes DESC
            LIMIT 1`, [res.locals.UID]
        ) //The FETCH WITH TIES is used as a limit 1 which also includes rows with the same value as the top one
    ];
    send_json(res, await Promise.all(result));
});


/******************************** POST *****************************/
monuments_router.post("/insert", async (req, res) => {
    send_json(res,
        await values.insert(table_name, res.locals.DB_INTERFACE, res.locals.is_admin, req.body),
        {success: 201}
    );
});
/************************************** PUT ***************************************************/
monuments_router.put("/update/:id", async (req, res) => {
    send_json(res,
        await values.update(table_name, res.locals.DB_INTERFACE, res.locals.is_admin, req.body, req.params.id)
    );
});
/************************************** DELETE ***************************************************/
monuments_router.delete("/delete/:id", async (req, res) => {
    const result = await values.delete(table_name, res.locals.DB_INTERFACE, res.locals.is_admin, req.params.id);
    if(typeof result !== "string") {
        try {
            const bucket = getStorage().bucket();
            await bucket.deleteFiles({
                prefix: `${req.params.id}_`
            });
        } catch(err) {
            send_json(res, error_codes.GENERIC("Error deleting files"));
            return;
        }
    }
    send_json(res, result);
});


monuments_router.post("/predict", upload.single("photo"),  async(req, res) => {
    const idx_to_id = [1, 2, 7];
    if(!req.file) {
        console.log("==");
        send_json(res, "No photo");
        return;
    }
    const file_name = req.file.path;
    const model = await tf.loadLayersModel("file://./model/model.json");
    let img_buffer = fs.readFileSync("./" + file_name);
    let img_tensor = tf.expandDims(
        tf.node.decodeJpeg(img_buffer).resizeBilinear([244, 244]),
        0
    );
    let x = model.predict(img_tensor);
    if(!Array.isArray(x)) {
        let tensorData = x.dataSync();
        let curr_idx = 0;
        let curr_max = tensorData[0];
        for(let idx = 1; idx < tensorData.length; idx++) {
            if(tensorData[idx] > curr_max) {
                curr_max = tensorData[idx];
                curr_idx = idx;
            }
        }
        let id = idx_to_id[curr_idx];
        res.status(200).send({id: id})
    }
});

export default monuments_router;