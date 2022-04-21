import { Pool, QueryResult } from "pg";

type DB_config = {
    // user: string;
    // password: string;
    // host: string;
    connectionString: string;
    // port: number;
}


export default class DB_interface {
    private readonly credentials: DB_config;
    private readonly pool : Pool;

    constructor(credentials: DB_config) {
        this.credentials = credentials;
        console.log(this.credentials)
        this.pool = new Pool({
            ...this.credentials,
            ssl: {
                rejectUnauthorized: false
            }
        }); //Connects to the DB
    }
   
    async query(query: string, params: any[]): Promise<QueryResult<any> | string> { // String return = error code
        try {
            return await this.pool.query(query, params);
        } catch (error) {
            console.log(`On query ${query}:\n ${error}: ${error.code}`);
            return error.code;
        }
    }

    // transaction(queries: string[], params: any[][]) {


    close() {
        this.pool.end();
    }
}
