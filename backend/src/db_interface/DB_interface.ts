import { Client } from "pg";

type DB_credentials = {
    user: string;
    password: string;
    host: string;
}


// Nel caso di long lived connection si crea un client al momento della creazione dell'oggetto, mentre
// in caso di short lived connection si crea un client per query singola, chiuso al termine dell'esecuzione
// della query.

class DB_interface {
    private readonly credentials: DB_credentials;
    private readonly uri: string;
    private readonly port: number;
    private readonly client : Client | null = null;

    constructor(credentials: DB_credentials, uri: string, port: number, long_lived_connection: boolean) {
        this.credentials = credentials;
        this.uri = uri;
        this.port = port;
    }

    connect() {}
}
