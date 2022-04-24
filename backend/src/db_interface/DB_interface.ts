import { Pool, QueryResult } from "pg";
import * as types from "./types";
import { get_db_uri } from "./utils";

type DB_config = { //Add fields here if needed
    connectionString: string;
}

type DB_result = {
    ok: boolean;
    result?: Array<QueryResult<any>> | null;
    error?: string | null;
}

class DB_interface {
    private readonly credentials: DB_config;
    private pool : Pool;
    private connection_status: boolean = false;

    constructor(credentials: DB_config, connect = true) {
        this.credentials = credentials;
        if(connect) 
            this.connect();
    }

    connect(): boolean {
        if(this.connection_status) return true; //if it is already connected do nothing
        try {
            this.pool = new Pool({
                ...this.credentials,
                ssl: {
                    rejectUnauthorized: false
                }
            }); //Connects to the DB
            this.connection_status = true;
        }
        catch(error) {
            console.log(error);
            throw error;
        }
        finally {
            return this.connection_status;
        }
    }
        
    async query(query: string, params: any[], close_connection = true): Promise<DB_result> { // String return = error code
        if(!this.connection_status) { //If the connection is not open return error code
            return {
                ok: false,
                error: "0"
            };
        }
        try {
            return {
                ok: true,
                result: [await this.pool.query(query, params)]
            };
        } catch (error) {
            console.log(`On query ${query}:\n ${error}: ${error.code}`);
            return {
                ok: false,
                error: error.code
            };
        }
        finally {
            if(close_connection) this.close();
        }
    }

    async transiction(queries: string[], params: any[][], close_connection = true): Promise<DB_result> {
        if(!this.connection_status) { //If the connection is not open return error code
            return {
                ok: false,
                error: "0"
            };
        } 
        try {
            let result = [];
            await this.pool.query('BEGIN');
            for(let i = 0; i < queries.length; i++) {
                result.push(await this.pool.query(queries[i], params[i]));
            }
            await this.pool.query('COMMIT');
            return {
                ok: true,
                result: result
            };
        } catch (error) {
            console.log(`On transiction:\n ${error}: ${error.code}`);
            await this.pool.query('ROLLBACK');
            return {
                ok: false,
                error: error.code
            };
        }
        finally {
            if(close_connection) this.close();
        }
    }

    get_connect_status(): boolean {
        return this.connection_status;
    }

    close() {
        this.pool.end();
        this.connection_status = false;
    }
}

export { DB_interface, types, get_db_uri}