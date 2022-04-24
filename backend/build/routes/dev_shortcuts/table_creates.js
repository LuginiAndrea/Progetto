"use strict";
exports.__esModule = true;
exports.table_arguments = void 0;
var create_continents_table = {
    query: "CREATE TABLE IF NOT EXISTS Continents (\n        id SMALLINT PRIMARY KEY,\n        it_name VARCHAR(20),\n        en_name VARCHAR(20)\n    );",
    args: []
};
var create_countries_table = {
    query: "CREATE TABLE IF NOT EXISTS Countries (\n        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,\n        real_name VARCHAR(50) NOT NULL,\n        it_name VARCHAR(50) DEFAULT NULL,\n        en_name VARCHAR(50) DEFAULT NULL,\n        iso_alpha_3 CHAR(3) UNIQUE NOT NULL,\n        fk_continent_id SMALLINT REFERENCES Continents\n            ON DELETE SET NULL\n            ON UPDATE CASCADE\n    );",
    args: []
};
var create_cities_table = {
    query: "CREATE TABLE IF NOT EXISTS Cities (\n        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,\n        real_name VARCHAR(50) NOT NULL,\n        it_name VARCHAR(50) DEFAULT NULL,\n        en_name VARCHAR(50) DEFAULT NULL,\n        rating SMALLINT DEFAULT NULL, \n        fk_country_id INTEGER REFERENCES Countries\n            ON DELETE CASCADE\n            ON UPDATE CASCADE\n    );",
    args: []
};
var create_languages_table = {
    query: "CREATE TABLE IF NOT EXISTS Languages (\n        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,\n        name VARCHAR(50) NOT NULL,\n        abbreviation CHAR(2) NOT NULL\n        );",
    args: []
};
var create_users_table = {
    query: "CREATE TABLE IF NOT EXISTS Users (\n        firebase_id INTEGER PRIMARY KEY,\n        fk_language_id INTEGER DEFAULT 0 REFERENCES Languages\n            ON DELETE SET DEFAULT\n            ON UPDATE CASCADE\n    );",
    args: []
};
var create_monuments_table = {
    query: "CREATE TABLE IF NOT EXISTS Monuments (\n        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,\n        real_name VARCHAR(50) NOT NULL, \n        it_name VARCHAR(50) DEFAULT NULL,\n        en_name VARCHAR(50) DEFAULT NULL,\n        coordinates GEOGRAPHY(POINT), \n        it_description TEXT DEFAULT NULL,\n        en_description TEXT DEFAULT NULL,\n        fk_city_id INTEGER REFERENCES Cities\n            ON DELETE CASCADE\n            ON UPDATE CASCADE\n    );",
    args: []
};
var create_visits_table = {
    query: "CREATE TABLE IF NOT EXISTS Visits ( \n        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,\n        rating SMALLINT NOT NULL, \n        private_description TEXT DEFAULT NULL,\n        date_time TIMESTAMP WITH TIME ZONE NOT NULL,\n        fk_user_id INTEGER REFERENCES Users\n            ON DELETE CASCADE\n            ON UPDATE CASCADE,\n        fk_monument_id INTEGER REFERENCES Monuments\n            ON DELETE CASCADE\n            ON UPDATE CASCADE\n    );",
    args: []
};
var create_types_of_monuments_table = {
    query: "CREATE TABLE IF NOT EXISTS Types_of_Monuments (\n        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,\n        real_name VARCHAR(50) NOT NULL, \n        it_name VARCHAR(50) DEFAULT NULL,\n        en_name VARCHAR(50) DEFAULT NULL,\n        it_description TEXT DEFAULT NULL,\n        en_description TEXT DEFAULT NULL,\n        period_start DATE NOT NULL,\n        period_end DATE DEFAULT NULL\n    );",
    args: []
};
var create_monuments_types_table = {
    query: "CREATE TABLE IF NOT EXISTS Monuments_Types (\n        fk_monument_id INTEGER REFERENCES Monuments\n            ON DELETE CASCADE\n            ON UPDATE CASCADE,\n        fk_type_id INTEGER REFERENCES Types_of_Monuments\n            ON DELETE CASCADE\n            ON UPDATE CASCADE,\n        PRIMARY KEY (fk_monument_id, fk_type_id)\n    );",
    args: []
};
var table_arguments = {
    "continents": create_continents_table,
    "countries": create_countries_table,
    "cities": create_cities_table,
    "languages": create_languages_table,
    "users": create_users_table,
    "monuments": create_monuments_table,
    "visits": create_visits_table,
    "types_of_monuments": create_types_of_monuments_table,
    "monuments_types": create_monuments_types_table
};
exports.table_arguments = table_arguments;
