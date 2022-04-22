import { Pool, QueryResult } from "pg";

type DB_config = { //Add fields here if needed
    connectionString: string;
}

type DB_result = {
    ok: boolean;
    result?: QueryResult<any> | null;
    error?: string | null;
}


export default class DB_interface {
    private readonly credentials: DB_config;
    private pool : Pool;
    private connection_status: boolean = false;

    constructor(credentials: DB_config, connect = true) {
        this.credentials = credentials;
        if(connect) {
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
        }
    }

    connect(): boolean {
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
        try {
            return {
                ok: true,
                result: await this.pool.query(query, params)
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

    get connect_status(): boolean {
        return this.connection_status;
    }

    close() {
        this.pool.end();
        this.connection_status = false;
    }
}
