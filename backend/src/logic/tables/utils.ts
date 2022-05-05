import { table_creates } from "../../sql/table_creates";
import { DB_interface, req_types as types} from "../db_interface/DB_interface";

type table_name = keyof typeof table_creates;
async function create_table(table_name: table_name, db_interface: DB_interface, role: string) {
    if(role !== "admin")
        return "Unauthorized";
    return await db_interface.query(table_creates[table_name]);
}
async function delete_table(table_name: table_name, db_interface: DB_interface, role: string) {
    if(role !== "admin")
        return "Unauthorized";
    return await db_interface.query(`DROP TABLE ${table_name}`);
}
async function get_schema(table_name: table_name, db_interface: DB_interface, role: string) {
    const result = await db_interface.query(`
        SELECT column_name, data_type, character_maximum_length, is_nullable
        FROM information_schema.columns
        WHERE table_name = '${table_name}'
    `);
    return result?.result?.[0].rowCount === 0 ? 
        null :
        result;   
}

async function insert_into(table_name: table_name, db_interface: DB_interface, role: string, data: any) {
    if(role !== "admin")
        return "Unauthorized";
    if(types.is_countries_body(data))  {
        const [fields, placeholder_sequence] = types.get_fields(table_name, Object.keys(data), 2);
        const values = types.extract_values_of_fields(data, fields);
        return await db_interface.query(`
            INSERT INTO Countries (${fields}) VALUES (${placeholder_sequence})
            RETURNING id;`, 
            values
        ); 
    }
    return null;
}
type error_name = {
    name: string;
    category: number;
};

const x : error_name[] = [
    {name: "no_continents_table", category: 1},
    {name: "no_countries_table", category: 2},
];   

export { create_table, get_schema, delete_table };
    