import { table_creates } from "../../sql/tables";
import { update_city_rating, update_monument_rating } from "../../sql/functions";
import { update_monument_rating_trigger, update_visits_rating_trigger } from "../../sql/triggers";
import { DB_interface, req_types as types } from "../db_interface/DB_interface";
import { Request } from "express";

function gen_error_code(error_code: string) {
    return function(table_name: string) {
        return `${error_code}.${table_name}`;
    }
}
const error_codes = { //Based on the prefix we select the right error code, after the prefix 
    UNAUTHORIZED: gen_error_code("e_0_Unauthorized"),  //there is the error message to give
    NO_AUTH_TOKEN: gen_error_code("e_0_No Firebase JWT"),
    NOT_VALID_TOKEN: gen_error_code("e_0_Not Valid Firebase JWT"),
    INVALID_BODY: gen_error_code("e_1_Invalid Body"),
    INVALID_QUERY: gen_error_code("e_1_Invalid Query"),
    NO_REFERENCED_ITEM: gen_error_code("e_1_No Referenced Item"),
    NO_ROW_AFFECTED: gen_error_code("e_2_No Row Affected"),
    NO_EXISTING_TABLE: gen_error_code("e_2_No Existing Table"),
    DEPENDED_ON_TABLE: gen_error_code("e_2_Other tables_depend_on_this"),
    GENERIC: gen_error_code("i_0_Generic"),
}
function error_codes_to_status_code(error_code: string[]) {
    if(error_code[0].startsWith("i")) //Internal errors
        return 500;
    if(error_code[1] === "0") //Forbidden
        return 403;
    if(error_code[1] === "1") //Error in the request
        return 400;
    if(error_code[0] === "42P01" || error_code[1] === "2") //Not found
        return 404;
    if(error_code[0] === "23505" || error_code[0] === "2BP01" ) //Conflict
        return 409;

    return 400; //Generic error by client
}
function convert_error_code(error_code: string, table_name: string) {   
    console.log("SIUM");
    switch(error_code) { //Converts error codes given by the database to defined ones
        case "42P01": return error_codes.NO_EXISTING_TABLE(table_name);
        case "2BP01": return error_codes.DEPENDED_ON_TABLE(table_name);
        default: return gen_error_code(error_code)(table_name);
    }
}


type table_name = keyof typeof table_creates;
async function create_table(table_name: table_name, db_interface: DB_interface, is_admin: boolean) {
    if(!is_admin)
        return error_codes.UNAUTHORIZED(table_name);
    let result;
    if(table_name === "visits") { //Vists and monuments are separated 
        console.log(table_creates.visits);
        result = await db_interface.transaction([ //because they also 
            table_creates.visits,   //require the creation of
            update_monument_rating, //other things such as triggers
            update_visits_rating_trigger  // and functions
        ]);
    }
    else if(table_name === "monuments") {
        result = await db_interface.transaction([
            table_creates.monuments,
            update_city_rating,
            update_monument_rating_trigger
        ]);
    }
    else 
        result = await db_interface.query(table_creates[table_name]);
    return typeof result === "string" ?
        convert_error_code(result, table_name) :
        result;
}
async function delete_table(table_name: table_name, db_interface: DB_interface, is_admin: boolean) {
    if(!is_admin)
        return error_codes.UNAUTHORIZED(table_name);
    let result;
    if(table_name === "visits") { //Vists and monuments are separated because
        result = await db_interface.transaction([ //they also require the deletion of 
            `DROP FUNCTION IF EXISTS update_monument_rating() CASCADE;`, //other
            `DROP TABLE visits;` //things too
        ]);
    }
    else if(table_name === "monuments") {
        result = await db_interface.transaction([
            `DROP FUNCTION IF EXISTS update_city_rating() CASCADE;`,
            `DROP TABLE monuments;`
        ]);
    }
    else 
        result = await db_interface.query(`DROP TABLE ${table_name}`);
    return typeof result === "string" ?
        convert_error_code(result, table_name) :
        result;
}
async function get_schema(table_name: table_name, db_interface: DB_interface) {
    const result = await db_interface.query(`
        SELECT column_name, data_type, character_maximum_length, is_nullable
        FROM information_schema.columns
        WHERE table_name = '${table_name}'
    `);
    if(typeof result !== "string")
        return result[0].rowCount === 0 ? // Check if a row was affected
            error_codes.NO_EXISTING_TABLE(table_name) :
            result;
    else console.log(result);
    return result;   
}

async function get_all(table_name: table_name, db_interface: DB_interface, fields: string[] | "*" = "*", rest_of_query: string = "") {
    return await db_interface.query(`SELECT ${fields} FROM ${table_name} ${rest_of_query}`);
}
async function get_by_id(table_name: table_name, db_interface: DB_interface, id: number | string | number[] | string[], fields: string[] | "*" = "*", rest_of_query: string = "") {
    return await db_interface.query(`SELECT ${fields} FROM ${table_name} WHERE id = ANY($1) ${rest_of_query}`, [id]);
}
async function get_generic(table_name: table_name, db_interface: DB_interface, fields: string[] | "*" = "*", rest_of_query: string = "", args: any[] = []) {
    return await db_interface.query(`SELECT ${fields} FROM ${table_name} ${rest_of_query}`, args);
}

type valid_body_types = Exclude<table_name, "continents">; //Continents has all the values pre-inserted, so it's not accepted
// As of now, insert_values is the only method that accepts an array of values, will be added to update and delete later
async function insert_values(table_name: valid_body_types, db_interface: DB_interface, is_admin: boolean, data: any) {
    if(!is_admin)
        return error_codes.UNAUTHORIZED(table_name);
    if(Array.isArray(data)) {
        for (const single of data) {
            if(!types.body_validators[table_name](single))  //Check if the body is composed in the right way
                return error_codes.INVALID_BODY(table_name);
        }
        const {fields} = types.get_fields(table_name, false, Object.keys(data[0]), false); 
        const values = data.map(single => types.extract_values_of_fields(single, fields)).flat(); //flatten it to be consumed by the query interface
        let placeholder_seq = "("; //Generate the placeholder sequence 
        for (let i = 1; i <= values.length; i++) {
            placeholder_seq += `$${i}`;
            if(i % fields.length === 0)  //If the current insert is full start a new one
                placeholder_seq += "),(";
            else 
                placeholder_seq += ",";
        }
        placeholder_seq = placeholder_seq.slice(0, -2); //Remove the last ",("            
        return await db_interface.query(
            `INSERT INTO ${table_name} (${fields}) VALUES ${placeholder_seq} RETURNING id;`, values
        );
    }
    else {
        if(!types.body_validators[table_name](data))  //Check if the body is composed in the right way
            return error_codes.INVALID_BODY(table_name);
        //Get the name of the fields and the placeholder sequence
        const {fields, placeholder_seq} = types.get_fields(table_name, false, Object.keys(data), 1); 
        const values = types.extract_values_of_fields(data, fields); //Get the values of the fields
        return await db_interface.query(`
            INSERT INTO ${table_name} (${fields}) VALUES (${placeholder_seq})
            RETURNING id;`, 
            values
        ); 
    }
}
async function update_values(table_name: valid_body_types, db_interface: DB_interface, is_admin: boolean, data: any, id: number | string) {
    if(!is_admin)
        return error_codes.UNAUTHORIZED(table_name);
    id = typeof id === "string" ?
        parseInt(id as string) :
        id;
    if(!id) 
        return error_codes.NO_REFERENCED_ITEM(table_name);
    if(!types.body_validators[table_name](data, true))  //Check if the body is composed in the right way (flag for update is up)
        return error_codes.INVALID_BODY(table_name);

    const {fields, placeholder_seq} = types.get_fields(table_name, false, Object.keys(data), 2, true);
    if(fields.length === 0) //If there are no right fields it means that there is nothing to update
        return error_codes.INVALID_BODY(table_name);
    const values = types.extract_values_of_fields(data, fields);
    const result = fields.length > 1 ? //If there is more than 1 field to update we need to change syntax
        await db_interface.query(`
            UPDATE ${table_name} SET (${fields}) = (${placeholder_seq}) 
            WHERE id = $1
            RETURNING *;`,
            [id, ...values] //Multi-fields syntax
        ) : 
        await db_interface.query(`
            UPDATE ${table_name} SET ${fields} = $2
            WHERE id = $1
            RETURNING *;`,
            [id, ...values] //Single field syntax
        );
    if(typeof result !== "string")
        return result[0].rowCount === 0 ? // Check if a row was affected
            error_codes.NO_ROW_AFFECTED(table_name) :
            result;
    return result;
}
async function delete_values(table_name: valid_body_types, db_interface: DB_interface, is_admin: boolean, id: number | string) {
    if(!is_admin)
        return error_codes.UNAUTHORIZED(table_name);
    if(!id)
        return error_codes.NO_REFERENCED_ITEM(table_name);
    const result = await db_interface.query(`
        DELETE FROM ${table_name}
        WHERE id = $1
        RETURNING id;`,
        [id]
    );
    if(typeof result !== "string")
        return result[0].rowCount === 0 ? // Check if a row was affected
            error_codes.NO_ROW_AFFECTED(table_name) :
            result;
    return result;
}

const table = {
    create: create_table,
    delete: delete_table,
    schema: get_schema,
};
const values = {
    insert: insert_values,
    update: update_values,
    delete: delete_values,
    get: {
        all: get_all,
        by_id: get_by_id,
        generic: get_generic,
    }
};
function validate_rating(req: Request) { //Function to check if the parameters for comparing
    const operator = (req.query.operator as string).toUpperCase(); //rating are correct
    const rating = req.query.rating === "NULL" ?
        "NULL" :
        parseInt(req.query.rating as string)
    if(!operator || !rating)
        return {valid: false, operator, rating};

    const valid = (rating === "NULL" && ["IS", "IS NOT"].includes(operator)) || (["=", "!=", ">", "<", ">=", "<="].includes(operator) && rating >= 0 && rating <= 5);
    return {valid, operator, rating};
}

export {table, values, error_codes, error_codes_to_status_code, validate_rating, convert_error_code};
    