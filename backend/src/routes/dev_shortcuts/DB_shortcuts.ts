// *************************************************************************************************
// -------------------- This file is to be used only for development purposes. --------------------*
// -------------------- It is not to be used in production. -------------------------------------- *
// -------------------- In production also remove the SQL folder and the .env file. -------------- *
// *************************************************************************************************

import {Router, Request, Response} from 'express';
import DB_interface from '../../db_interface/DB_interface';

const db_shortcut_router: Router = Router();

type table_args = {
    query: string,
    args: any[]
};

// -------------------- General table stuff --------------------
// -------------------- GET TABLE SCHEMA --------------------
db_shortcut_router.get("/:db/table_schema/:table_name", async (req: Request, res: Response) => {
    const table_name: string = req.params.table_name;
    const db = new DB_interface({
        connectionString: (req.params.db === "prod") ? process.env.PROD_DB_URI : process.env.DEV_DB_URI
    });
    const result = await db.query("SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_name = $1;", [table_name]);

    db.close();
    res.status(200).send({
        table_name: table_name,
        columns: (typeof result === "string") ? result : result.rows.map(row => [row.column_name, row.data_type])
    });
});    
// -------------------- SELECT * --------------------
db_shortcut_router.get("/:db/select_table/:table_name", async (req: Request, res: Response) => {
    const table_name: string = req.params.table_name;
    const db = new DB_interface({
        connectionString: (req.params.db === "prod") ? process.env.PROD_DB_URI : process.env.DEV_DB_URI
    });
    const result = await db.query(`SELECT * FROM ${table_name};`, []);
    res.status(200).send(result);
    db.close();
});
// -------------------- DROP TABLE --------------------
db_shortcut_router.get("/:db/drop_table/:table_name", async (req: Request, res: Response) => {
    const table_name: string = req.params.table_name;
    const db = new DB_interface({
        connectionString: (req.params.db === "prod") ? process.env.PROD_DB_URI : process.env.DEV_DB_URI
    });
    const result = await db.query(`DROP TABLE ${table_name};`, []);
    res.status(200).send(result);
    db.close();
});
// -------------------- CREATE TABLE --------------------
db_shortcut_router.get("/:db/create_table/:table_name", async (req: Request, res: Response) => {
    const table_name: string = req.params.table_name;
    const db = new DB_interface({
        connectionString: (req.params.db === "prod") ? process.env.PROD_DB_URI : process.env.DEV_DB_URI
    });
    const table_arguments: Record<string, table_args> = {
        "continents": create_continents_table,
        "countries": create_countries_table,
        "cities": create_cities_table,
        "languages": create_languages_table,
        "users": create_users_table,
        "monuments": create_monuments_table,
        "visits": create_visits_table,
        "types_of_monuments": create_types_of_monuments_table,
        "monuments_types": create_monuments_types_table
    }
    if(table_name !== "all") {
        const table = table_arguments[table_name];
        await db.query(table.query, table.args);
    } 
    else 
        for(const table in table_arguments) {
            await db.query(table_arguments[table].query, table_arguments[table].args);
        }
    res.status(200).send("Created");
    db.close();
});

// -------------------- GET DB SCHEMA --------------------
db_shortcut_router.get('/:db/db_schema', async (req: Request, res: Response) => {
    const db = new DB_interface({
        connectionString: (req.params.db === "prod") ? process.env.PROD_DB_URI : process.env.DEV_DB_URI
    });
    const result = await db.query(`SELECT table_name FROM information_schema.tables 
        WHERE table_type != 'VIEW' 
        AND table_name NOT LIKE 'pg%'
        AND table_name NOT LIKE 'sql%'
        AND table_name NOT LIKE 'spatial%'`, []);
    res.status(200).send(
        result
    );
    db.close();
});

// -------------------- Continents table stuff --------------------
// -------------------- CREATE CONTINENTS TABLE --------------------
const create_continents_table =  {
    query: `CREATE TABLE IF NOT EXISTS Continents (
        id SMALLINT PRIMARY KEY,
        it_name VARCHAR(20),
        en_name VARCHAR(20)
    );`,
    args: []
};
// -------------------- INSERT CONTINENTS --------------------
db_shortcut_router.get("/insertContinents", async (req, res) => {
    const db = new DB_interface({
        connectionString: process.env.PROD_DB_URI
    });
    const result = await db.query(`INSERT INTO continents (id, it_name, en_name) VALUES 
    (0, 'Europa', 'Europe'), 
    (1, 'Asia', 'Asia'), 
    (2, 'Nord America', 'North America'), 
    (3, 'Sud America', 'South America'), 
    (4, 'Africa', 'Africa'), 
    (5, 'Oceania', 'Oceania'), 
    (6, 'Antartica', 'Antarctica');`, []);
    res.status(200).send(result);
});

// -------------------- Country table stuff --------------------
// -------------------- CREATE COUNTRIES TABLE --------------------
const create_countries_table =  {
    query: `CREATE TABLE IF NOT EXISTS Countries (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        real_name VARCHAR(50) NOT NULL,
        it_name VARCHAR(50) DEFAULT NULL,
        en_name VARCHAR(50) DEFAULT NULL,
        iso_alpha_3 CHAR(3) UNIQUE NOT NULL,
        fk_continent_id SMALLINT REFERENCES Continents
            ON DELETE SET NULL
            ON UPDATE CASCADE
    );`,
    args: []
};

// -------------------- Cities table stuff --------------------
// -------------------- CREATE CITIES TABLE --------------------
const create_cities_table = {
    query: `CREATE TABLE IF NOT EXISTS Cities (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        real_name VARCHAR(50) NOT NULL,
        it_name VARCHAR(50) DEFAULT NULL,
        en_name VARCHAR(50) DEFAULT NULL,
        rating SMALLINT DEFAULT NULL, 
        fk_country_id INTEGER REFERENCES Countries
            ON DELETE CASCADE
            ON UPDATE CASCADE
    );`,
    args: []
};

// -------------------- Languages table stuff --------------------
// -------------------- CREATE LANGUAGES TABLE --------------------
const create_languages_table = {
    query: `CREATE TABLE IF NOT EXISTS Languages (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR(50) NOT NULL,
        abbreviation CHAR(2) NOT NULL
        );`,
    args: []
};

// -------------------- Users table stuff --------------------
// -------------------- CREATE Users TABLE --------------------
const create_users_table = {
    query: `CREATE TABLE IF NOT EXISTS Users (
        firebase_id INTEGER PRIMARY KEY,
        fk_language_id INTEGER DEFAULT 0 REFERENCES Languages
            ON DELETE SET DEFAULT
            ON UPDATE CASCADE
    );`,
    args: []
};

// -------------------- Monuments table stuff --------------------
// -------------------- CREATE Monuments TABLE --------------------
const create_monuments_table = {
    query: `CREATE TABLE IF NOT EXISTS Monuments (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        real_name VARCHAR(50) NOT NULL, 
        it_name VARCHAR(50) DEFAULT NULL,
        en_name VARCHAR(50) DEFAULT NULL,
        coordinates GEOGRAPHY(POINT), 
        it_description TEXT DEFAULT NULL,
        en_description TEXT DEFAULT NULL,
        fk_city_id INTEGER REFERENCES Cities
            ON DELETE CASCADE
            ON UPDATE CASCADE
    );`,
    args: []
};

// -------------------- Visits table stuff --------------------
// -------------------- CREATE Visits TABLE --------------------
const create_visits_table = {
    query: `CREATE TABLE IF NOT EXISTS Visits ( 
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        rating SMALLINT NOT NULL, 
        private_description TEXT DEFAULT NULL,
        date_time TIMESTAMP WITH TIME ZONE NOT NULL,
        fk_user_id INTEGER REFERENCES Users
            ON DELETE CASCADE
            ON UPDATE CASCADE,
        fk_monument_id INTEGER REFERENCES Monuments
            ON DELETE CASCADE
            ON UPDATE CASCADE
    );`,
    args: []
};

// -------------------- Types of monuments table stuff --------------------
// -------------------- CREATE Types_of_monuments TABLE --------------------
const create_types_of_monuments_table = {
    query: `CREATE TABLE IF NOT EXISTS Types_of_Monuments (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        real_name VARCHAR(50) NOT NULL, 
        it_name VARCHAR(50) DEFAULT NULL,
        en_name VARCHAR(50) DEFAULT NULL,
        it_description TEXT DEFAULT NULL,
        en_description TEXT DEFAULT NULL,
        period_start DATE NOT NULL,
        period_end DATE DEFAULT NULL
    );`,
    args: []
};

// -------------------- Monuments type table stuff --------------------
// -------------------- CREATE Monuments_type TABLE --------------------
const create_monuments_types_table = {
    query: `CREATE TABLE IF NOT EXISTS Monuments_Types (
        fk_monument_id INTEGER REFERENCES Monuments
            ON DELETE CASCADE
            ON UPDATE CASCADE,
        fk_type_id INTEGER REFERENCES Types_of_Monuments
            ON DELETE CASCADE
            ON UPDATE CASCADE,
        PRIMARY KEY (fk_monument_id, fk_type_id)
    );`,
    args: []
};


export default db_shortcut_router;