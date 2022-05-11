import { table_creates } from "../../sql/table_creates";
import { DB_interface, req_types as types } from "../db_interface/DB_interface";
import { Request } from "express";

function gen_error_code(error_code: string) {
    return function(table_name: string) {
        return `${error_code}.${table_name}`;
    }
}

const error_codes = {
    UNAUTHORIZED: gen_error_code("e_0_Unauthorized"),
    INVALID_BODY: gen_error_code("e_1_Invalid Body"),
    NO_REFERENCED_ITEM: gen_error_code("e_1_No Referenced Item"),
    NO_ROW_AFFECTED: gen_error_code("e_2_No Row Affected"),
    NO_EXISTING_TABLE: gen_error_code("e_2_No Existing Table"),
}

function error_codes_to_status_code(error_code: string[]) {
    if(error_code[0].startsWith("i"))
        return 500;
    if(error_code[0] === "23505") 
        return 409;
    if(error_code[1] === "0_") 
        return 403;
    if(error_code[1] === "1_")
        return 400;
    if(error_code[0] === "42P01" || error_code[1] === "2_")
        return 404;

    return 400;
}

function convert_error_code(error_code: string, table_name: string) {   
    switch(error_code) {
        case "42P01": return error_codes.NO_EXISTING_TABLE(table_name);
        default: return gen_error_code(error_code)(table_name);
    }
}


type table_name = keyof typeof table_creates;
async function create_table(table_name: table_name, db_interface: DB_interface, is_admin: boolean) {
    if(!is_admin)
        return error_codes.UNAUTHORIZED(table_name);
    const result = await db_interface.query(table_creates[table_name]);
    return typeof result === "string" ?
        convert_error_code(result, table_name) :
        result;
}
async function delete_table(table_name: table_name, db_interface: DB_interface, is_admin: boolean) {
    if(!is_admin)
        return error_codes.UNAUTHORIZED(table_name);
    const result = await db_interface.query(`DROP TABLE ${table_name}`);
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
    return result;   
}

type filter = {
    func: (args: any) => string[],
    args: any
}
type id = number | string;
async function get_all_values(table_name: table_name, db_interface: DB_interface, rest_of_query: string = "", filter?: filter) {
    const fields = filter?.func(filter?.args) || `${table_name}.*`;
    return await db_interface.query(`SELECT ${fields} FROM ${table_name} ${rest_of_query}`);
}
async function get_single_value(table_name: table_name, db_interface: DB_interface, id: id, rest_of_query: string = "", filter?: filter) {
    const fields = filter?.func(filter?.args) || `${table_name}.*`;
    return await db_interface.query(`SELECT ${fields} FROM ${table_name} WHERE id = $1 ${rest_of_query}`, [id]);
}
async function get_generic(table_name: table_name, db_interface: DB_interface, rest_of_query: string = "", args: any[], filter?: filter) {
    const fields = filter?.func(filter?.args) || `${table_name}.*`;
    return await db_interface.query(`SELECT ${fields} FROM ${table_name} ${rest_of_query}`, args);
}

type valid_body_types = Exclude<table_name, "continents">;
async function insert_values(table_name: valid_body_types, db_interface: DB_interface, is_admin: boolean, data: any) {
    if(!is_admin)
        return error_codes.UNAUTHORIZED(table_name);
    if(!types.body_validators[table_name](data))  
        return error_codes.INVALID_BODY(table_name);

    const [fields, placeholder_sequence] = types.get_fields(table_name, false, Object.keys(data), 1);
    const values = types.extract_values_of_fields(data, fields);
    return await db_interface.query(`
        INSERT INTO ${table_name} (${fields}) VALUES (${placeholder_sequence})
        RETURNING id;`, 
        values
    ); 
}
async function update_values(table_name: valid_body_types, db_interface: DB_interface, is_admin: boolean, data: any, id: id) {
    if(!is_admin)
        return error_codes.UNAUTHORIZED(table_name);
    id = typeof id === "string" ?
        parseInt(id as string) :
        id;
    if(!id) 
        return error_codes.NO_REFERENCED_ITEM(table_name);
    if(!types.body_validators[table_name](data)) 
        error_codes.INVALID_BODY(table_name);

    const [fields, placeholder_sequence] = types.get_fields(table_name, false, Object.keys(data), 2, true);
    if(fields.length === 0)
        return error_codes.INVALID_BODY(table_name);
    const values = types.extract_values_of_fields(data, fields);
    const result = fields.length > 1 ? //If there are more than 1 field to update we need to change syntax
        await db_interface.query(`
            UPDATE ${table_name} SET (${fields}) = (${placeholder_sequence})
            WHERE id = $1
            RETURNING *;`,
            [id, ...values]
        ) :
        await db_interface.query(`
            UPDATE ${table_name} SET ${fields} = $2
            WHERE id = $1
            RETURNING *;`,
            [id, ...values]
        );
    if(typeof result !== "string")
        return result[0].rowCount === 0 ? // Check if a row was affected
            error_codes.NO_ROW_AFFECTED(table_name) :
            result;
    return result;
}
async function delete_values(table_name: valid_body_types, db_interface: DB_interface, is_admin: boolean, id: id) {
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
        all: get_all_values,
        single: get_single_value,
        generic: get_generic,
    }
};
function validate_rating(req: Request) {
    const operator = (req.query.operator as string).toUpperCase();
    const rating = req.query.rating === "NULL" ?
        "NULL" :
        parseInt(req.query.rating as string)
    if(!operator || !rating)
        return {valid: false, operator, rating};

    const valid = (rating === "NULL" && ["IS", "IS NOT"].includes(operator)) || (["=", "!=", ">", "<", ">=", "<="].includes(operator) && rating >= 0 && rating <= 5);
    return {valid, operator, rating};
}

export {table, values, error_codes, error_codes_to_status_code, validate_rating, convert_error_code};
    