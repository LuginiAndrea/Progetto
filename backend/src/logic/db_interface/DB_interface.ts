import { Pool, QueryArrayConfig, QueryConfig, QueryResult } from "pg";
import { send_generic_error_email } from "../email/email";
import * as req_types from "./types";
import { get_db_uri, validate_db_status, error_codes } from "./utils";


type DB_config = { //Add fields here if needed
    connectionString: string;
}

// String as a return means error
type DB_result = Array<QueryResult<any>> | string;

class DB_interface {
    private readonly config: DB_config;
    private pool : Pool | null = null;

    constructor(config: DB_config, connect = true) {
        this.config = config;
        if(connect) 
            this.connect();
    }

    connect() {
        if(this.connected()) return true; //if it is already connected do nothing
        try {
            this.pool = new Pool({
                ...this.config,
                ssl: {
                    rejectUnauthorized: false
                }
            }); //Connects to the DB
        }
        catch(error) {
            send_generic_error_email("Error in server", error + `Error code: ${error.code}`);
            throw error;
        }
        finally {
            return this.connected(); // Return status of the connection
        }
    }
        
    async query(query: string, params: any[] = [], close_connection = false): Promise<DB_result> { 
        if(!this.pool) { //If the connection is not open return error code
            return error_codes.NO_DB_CONNECTION;
        }
        else {
            try {
                return [await this.pool.query(query, params)];
            } 
            catch (error) {
                console.log(`On query ${query}:\n ${error}: ${error.code}`); // Disable in production
                if(error.code === "3D000") send_generic_error_email("Error in server", error + "Error code 3D000");
                return error.code
            }
            finally {
                if(close_connection) this.close();
            }
        }
    }

    async transiction(queries: string[], params: any[][] = [], close_connection = false): Promise<DB_result> {
        if(!this.pool) { //If the connection is not open return error code
            return error_codes.NO_DB_CONNECTION;
        } 
        try {
            let result = [];
            await this.pool.query('BEGIN');
            for(let i = 0; i < queries.length; i++) {
                result.push(await this.pool.query(queries[i], params[i] || [])); 
            }
            await this.pool.query('COMMIT');
            return result;
        } 
        catch (error) {
            console.log(`On transiction:\n ${error}: ${error.code}`); // Disable in production
            await this.pool.query('ROLLBACK');
                if(error.code === "3D000") send_generic_error_email("Error in server", error + "Error code 3D000");
            return error.code;
        }
        finally {
            if(close_connection) this.close();
        }
    }

    connected(): boolean {
        return this.pool !== null;
    }

    close() {
        if(this.pool)
            this.pool.end();
        this.pool = null
    }
}

export { DB_interface, req_types, get_db_uri, DB_result, QueryResult, validate_db_status, error_codes};