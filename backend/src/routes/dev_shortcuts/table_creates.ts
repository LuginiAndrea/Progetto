type table_args = {
    query: string,
    args: any[]
};

const create_continents_table =  {
    query: `CREATE TABLE IF NOT EXISTS Continents (
        id SMALLINT PRIMARY KEY,
        it_name VARCHAR(20),
        en_name VARCHAR(20)
    );`,
    args: []
};

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

const create_languages_table = {
    query: `CREATE TABLE IF NOT EXISTS Languages (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR(50) NOT NULL,
        abbreviation CHAR(2) NOT NULL
        );`,
    args: []
};

const create_users_table = {
    query: `CREATE TABLE IF NOT EXISTS Users (
        firebase_id INTEGER PRIMARY KEY,
        fk_language_id INTEGER DEFAULT 0 REFERENCES Languages
            ON DELETE SET DEFAULT
            ON UPDATE CASCADE
    );`,
    args: []
};

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

const table_arguments = {
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

export { table_arguments }