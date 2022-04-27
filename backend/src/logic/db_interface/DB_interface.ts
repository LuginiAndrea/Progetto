// Check for problems when connecting to db
// and in case send email
import { Pool, QueryResult } from "pg";
import { send_generic_error_email } from "../email/email";
import * as req_types from "./types";
import { get_db_uri, validating_db_status } from "./utils";

type DB_config = { //Add fields here if needed
    connectionString: string;
}

type DB_result = {
    result?: Array<QueryResult<any>> | null;
    error?: string | null;
}

class DB_interface {
    private readonly credentials: DB_config;
    private pool : Pool | null = null;

    constructor(credentials: DB_config, connect = true) {
        this.credentials = credentials;
        if(connect) 
            this.connect();
    }

    connect(): boolean {
        if(this.connected()) return true; //if it is already connected do nothing
        try {
            this.pool = new Pool({
                ...this.credentials,
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
            return this.connected();
        }
    }
        
    async query(query: string, params: any[] = [], close_connection = false): Promise<DB_result> { // String return = error code
        if(!this.pool) { //If the connection is not open return error code
            return {
                error: "i_0"
            };
        }
        else {
            try {
                return {
                    result: [await this.pool.query(query, params)]
                };
            } catch (error) {
                console.log(`On query ${query}:\n ${error}: ${error.code}`);
                if(error.code === "3D000") send_generic_error_email("Error in server", error + "Error code 3D000");
                return {
                    error: error.code
                };
            }
            finally {
                if(close_connection) this.close();
            }
        }
    }

    async transiction(queries: string[], params: any[][] = [], close_connection = false): Promise<DB_result> {
        if(!this.pool) { //If the connection is not open return error code
            return {
                error: "i_0"
            };
        } 
        try {
            let result = [];
            await this.pool.query('BEGIN');
            for(let i = 0; i < queries.length; i++) {
                result.push(await this.pool.query(queries[i], params[i] || [])); 
            }
            await this.pool.query('COMMIT');
            return {
                result: result
            };
        } catch (error) {
            console.log(`On transiction:\n ${error}: ${error.code}`);
            await this.pool.query('ROLLBACK');
                if(error.code === "3D000") send_generic_error_email("Error in server", error + "Error code 3D000");
            return {
                error: error.code
            };
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

export { DB_interface, req_types, get_db_uri, DB_result, QueryResult, validating_db_status};