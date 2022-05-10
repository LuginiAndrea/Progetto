import { table_creates } from "../../sql/table_creates";
import { DB_interface, req_types as types} from "../db_interface/DB_interface";

function gen_error_code(error_code: string) {
    return function(table_name: string) {
        return `${table_name}${error_code}`;
    }
}

const error_codes = {
    Unauthorized: gen_error_code("_0_0"),
    Invalid_body: gen_error_code("_1_0"),
    No_referenced_item: gen_error_code("_1_1"),
    No_row_affected: gen_error_code("_2_0"),
    No_existing_table: gen_error_code("_2_1"),
}

function error_codes_to_status_code(error_code: string) {
    if(error_code.startsWith("i"))
        return 500;
    if(error_code.includes("_0_")) 
        return 403;
    if(error_code.includes("_1_"))
        return 400;
    if(error_code.includes("_2_"))
        return 404;
    if(error_code === "23505") 
        return 409;

    return 400;
}


type table_name = keyof typeof table_creates;
async function create_table(table_name: table_name, db_interface: DB_interface, role: string) {
    if(role !== "admin")
        return error_codes.Unauthorized(table_name);
    return await db_interface.query(table_creates[table_name]);
}
async function delete_table(table_name: table_name, db_interface: DB_interface, role: string) {
    if(role !== "admin")
        return error_codes.Unauthorized(table_name);
    return await db_interface.query(`DROP TABLE ${table_name}`);
}
async function get_schema(table_name: table_name, db_interface: DB_interface, role: string) {
    const result = await db_interface.query(`
        SELECT column_name, data_type, character_maximum_length, is_nullable
        FROM information_schema.columns
        WHERE table_name = '${table_name}'
    `);
    return result?.result?.[0].rowCount === 0 ? 
        error_codes.No_existing_table(table_name) :
        result;   
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
async function insert_values(table_name: valid_body_types, db_interface: DB_interface, role: string, data: any) {
    if(role !== "admin")
        return error_codes.Unauthorized(table_name);
    if(!types.body_validators[table_name](data))  
        return error_codes.Invalid_body(table_name);

    const [fields, placeholder_sequence] = types.get_fields(table_name, Object.keys(data), 2);
    const values = types.extract_values_of_fields(data, fields);
    return await db_interface.query(`
        INSERT INTO Countries (${fields}) VALUES (${placeholder_sequence})
        RETURNING id;`, 
        values
    ); 
}
async function update_values(table_name: valid_body_types, db_interface: DB_interface, role: string, data: any, id: id) {
    if(role !== "admin")
        return error_codes.Unauthorized(table_name);
    if(!id) 
        return error_codes.No_referenced_item(table_name);
    if(!types.body_validators[table_name](data)) 
        error_codes.Invalid_body(table_name);

    const [fields, placeholder_sequence] = types.get_fields(table_name, Object.keys(data), 2, true);
    if(fields.length === 0)
        return error_codes.Invalid_body(table_name);
    const values = types.extract_values_of_fields(data, fields);
    const result = fields.length > 1 ? //If there are more than 1 field to update we need to change syntax
    await db_interface.query(`
        UPDATE Countries SET (${fields}) = (${placeholder_sequence})
        WHERE id = $1
        RETURNING *;`,
        [id, ...values]
    ) :
    await db_interface.query(`
        UPDATE Countries SET ${fields} = $2
        WHERE id = $1
        RETURNING *;`,
        [id, ...values]
    );
    return result?.result?.[0].rowCount === 0 ? // Check if a row was affected
        error_codes.No_row_affected(table_name) :
        result;
}
async function delete_values(table_name: valid_body_types, db_interface: DB_interface, role: string, id: id) {
    if(role !== "admin")
        return error_codes.Unauthorized(table_name);
    if(!id)
        return error_codes.No_referenced_item(table_name);
    const result = await db_interface.query(`
        DELETE FROM Countries
        WHERE id = $1
        RETURNING id;`,
        [id]
    );
    return result?.result?.[0].rowCount === 0 ? // Check if a row was affected
        error_codes.No_row_affected(table_name) :
        result;
}

const table = {
    create: create_table,
    delete: delete_table,
    schema: get_schema,
}
const values = {
    insert: insert_values,
    update: update_values,
    delete: delete_values,
    get: {
        all: get_all_values,
        single: get_single_value,
        generic: get_generic,
    }
}

export {table, values, error_codes, error_codes_to_status_code};
    