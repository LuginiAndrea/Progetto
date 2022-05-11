import { app } from "./app";
import { DB_interface, get_db_uri } from "./logic/db_interface/DB_interface";
import supertest from "supertest";
import { table, values } from "./logic/tables/utils";
describe("Top Level routes tests", () => {
    // SETUP
    const request = supertest(app);
    app.locals.DEFAULT_DB_INTERFACE = new DB_interface({
        connectionString: get_db_uri()
    }, true);

    //Tests
    it("/", async() => {
        const response = await request.get("/");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({status: "Running"});
    });
    it("/not_real_endpoint", async() => {
        const response = await request.get("/not_real_endpoint");
        expect(response.status).toBe(404);
        expect(response.body).toEqual({error: "Method not found"});
    });
    describe("/reconnect_db", () => {
        it("Reconnect with open connection", async () => {
            const response = await request.get("/reconnect_db");
            expect(response.status).toBe(200);
            expect(response.body).toEqual({status: "Already connected"});
        });
        it("Reconnect with closed connection", async () => {
            app.locals.DEFAULT_DB_INTERFACE.close();
            const response = await request.get("/reconnect_db");
            expect(response.status).toBe(200);
            expect(response.body).toEqual({status: "Connected"});
        });
        it("Reconnect with never opened connection", async () => {
            app.locals.DEFAULT_DB_INTERFACE = null;
            const response = await request.get("/reconnect_db");
            expect(response.status).toBe(200);
            expect(response.body).toEqual({status: "Connected"});
        });
    });
    describe("Test first-level middleware", () => {
        it("No database connection", async () => {
            app.locals.DEFAULT_DB_INTERFACE.close();
            const response = await request.get("/");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({error: "Not connected"});
        });
        it("No database interface", async () => {
            app.locals.DEFAULT_DB_INTERFACE = null;
            const response = await request.get("/");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({error: "No interface"});
        });
    });
});

describe("Benchmarks tests", () => {
    // SETUP
    const request = supertest(app);
    app.locals.DEFAULT_DB_INTERFACE = new DB_interface({
        connectionString: get_db_uri()
    }, true);

    beforeAll(async () => {
        await table.create("continents", app.locals.DEFAULT_DB_INTERFACE, true);
        await table.create("countries", app.locals.DEFAULT_DB_INTERFACE, true);
        await table.create("cities", app.locals.DEFAULT_DB_INTERFACE, true);
        await table.create("monuments", app.locals.DEFAULT_DB_INTERFACE, true);
        await table.create("languages", app.locals.DEFAULT_DB_INTERFACE, true);
        await table.create("users", app.locals.DEFAULT_DB_INTERFACE, true);
        await table.create("visits", app.locals.DEFAULT_DB_INTERFACE, true);
        await table.create("monument_types", app.locals.DEFAULT_DB_INTERFACE, true);
        await table.create("types_of_monuments", app.locals.DEFAULT_DB_INTERFACE, true);

        await request.post("/continents/insert_continents").set("Authorization", "1");
        // Country
        await values.insert("countries", app.locals.DEFAULT_DB_INTERFACE, true, {
            real_name: "Italia",
            it_name: "Italia",
            en_name: "Italy",
            iso_alpha_3: "ITA",
            fk_continent_id: 0
        });
        await values.insert("countries", app.locals.DEFAULT_DB_INTERFACE, true, {
            real_name: "Polska",
            it_name: "Polonia",
            en_name: "Poland",
            iso_alpha_3: "POL",
            fk_continent_id: 0
        });
        await values.insert("countries", app.locals.DEFAULT_DB_INTERFACE, true, {
            real_name: "United States of America",
            it_name: "Stati Uniti d'America",
            en_name: "United States of America",
            iso_alpha_3: "USA",
            fk_continent_id: 2
        });
        // City
        await values.insert("cities", app.locals.DEFAULT_DB_INTERFACE, true, {
            real_name: "Roma",
            it_name: "Roma",
            en_name: "Rome",
            fk_country_id: 1
        });
        await values.insert("cities", app.locals.DEFAULT_DB_INTERFACE, true, {
            real_name: "Milano",
            it_name: "Milano",
            en_name: "Milan",
            fk_country_id: 1
        });
        await values.insert("cities", app.locals.DEFAULT_DB_INTERFACE, true, {
            real_name: "Kraków",
            it_name: "Cracovia",
            en_name: "Krakow",
            fk_country_id: 2
        });
        await values.insert("cities", app.locals.DEFAULT_DB_INTERFACE, true, {
            real_name: "New York",
            it_name: "New York",
            en_name: "New York",
            fk_country_id: 3
        });
        // Monument
        await values.insert("monuments", app.locals.DEFAULT_DB_INTERFACE, true, {
            real_name: "Colosseo",
            it_name: "Colosseo",
            en_name: "Colosseum",
            coordinates: "SRID=4326;POINT(10.491667 41.891944)",
            it_description: "Il monumento più bello del mondo",
            en_description: "The most beautiful monument in the world",
            fk_city_id: 1,
        });
        await values.insert("monuments", app.locals.DEFAULT_DB_INTERFACE, true, {
            real_name: "Piazza di Spagna",
            it_name: "Piazza di Spagna",
            en_name: "Piazza di Spagna",
            coordinates: "SRID=4326;POINT(11.491667 41.891944)",
            it_description: "Il secondo monumento più bello del mondo",
            en_description: "The second most beautiful monument in the world",
            fk_city_id: 1,
        });
        await values.insert("monuments", app.locals.DEFAULT_DB_INTERFACE, true, {
            real_name: "Duomo",
            it_name: "Duomo",
            en_name: "Duomo",
            coordinates: "SRID=4326;POINT(45.491667 14.891944)",
            it_description: "Il terzo monumento più bello del mondo",
            en_description: "The third most beautiful monument in the world",
            fk_city_id: 2,
        });
        await values.insert("monuments", app.locals.DEFAULT_DB_INTERFACE, true, {
            real_name: "Monumento Polacco",
            it_name: "Monumento Polacco",
            en_name: "Polish monument",
            coordinates: "SRID=4326;POINT(15.491667 41.891944)",
            it_description: "Il quarto monumento più bello del mondo",
            en_description: "The fourth most beautiful monument in the world",
            fk_city_id: 3,
        });
        await values.insert("monuments", app.locals.DEFAULT_DB_INTERFACE, true, {
            real_name: "Monumento USA",
            it_name: "Monumento USA",
            en_name: "American monument",
            coordinates: "SRID=4326;POINT(23.491667 41.891944)",
            it_description: "Il quinto monumento più bello del mondo",
            en_description: "The fifth most beautiful monument in the world",
            fk_city_id: 4,
        });
        // Language
        await values.insert("languages", app.locals.DEFAULT_DB_INTERFACE, true, {
            name: "English",
            abbreviation: "EN"
        });
        // User
        await values.insert("users", app.locals.DEFAULT_DB_INTERFACE, true, {
            id: 2,
            fk_language_id: 1
        });
        // Visit
        await values.insert("visits", app.locals.DEFAULT_DB_INTERFACE, true, {
            rating: 3,
            private_description: "Visita molto bella",
            date_time: "2020-01-01",
            fk_user_id: 2,
            fk_monument_id: 1
        });
        await values.insert("visits", app.locals.DEFAULT_DB_INTERFACE, true, {
            rating: 4,
            private_description: "Visita molto bella",
            date_time: "2021-01-01",
            fk_user_id: 2,
            fk_monument_id: 2
        });
        await values.insert("visits", app.locals.DEFAULT_DB_INTERFACE, true, {
            rating: 5,
            private_description: "Visita molto bella",
            date_time: "2022-01-01",
            fk_user_id: 2,
            fk_monument_id: 3
        });
        // types_of_monuments
        await values.insert("types_of_monuments", app.locals.DEFAULT_DB_INTERFACE, true, {
            real_name: "Museo",
            it_name: "Museo",
            en_name: "Museum",
            it_description: "Museo di storia",
            en_description: "History museum"
        });
        await values.insert("types_of_monuments", app.locals.DEFAULT_DB_INTERFACE, true, {
            real_name: "Palace",
            it_name: "Palazzo",
            en_name: "Palace",
            it_description: "Palazzo di storia",
            en_description: "History palace"
        });
        // monuments_types
        await values.insert("monument_types", app.locals.DEFAULT_DB_INTERFACE, true, {
            fk_type_of_monument_id: 1,
            fk_monument_id: 1
        });
        await values.insert("monument_types", app.locals.DEFAULT_DB_INTERFACE, true, {
            fk_type_of_monument_id: 2,
            fk_monument_id: 1
        });
        await values.insert("monument_types", app.locals.DEFAULT_DB_INTERFACE, true, {
            fk_type_of_monument_id: 1,
            fk_monument_id: 2
        });
    });
    afterAll(async () => {
        await table.delete("monument_types", app.locals.DEFAULT_DB_INTERFACE, true);
        await table.delete("types_of_monuments", app.locals.DEFAULT_DB_INTERFACE, true);
        await table.delete("visits", app.locals.DEFAULT_DB_INTERFACE, true);
        await table.delete("monuments", app.locals.DEFAULT_DB_INTERFACE, true);
        await table.delete("cities", app.locals.DEFAULT_DB_INTERFACE, true);
        await table.delete("users", app.locals.DEFAULT_DB_INTERFACE, true);
        await table.delete("languages", app.locals.DEFAULT_DB_INTERFACE, true);
        await table.delete("countries", app.locals.DEFAULT_DB_INTERFACE, true);
        await table.delete("continents", app.locals.DEFAULT_DB_INTERFACE, true);
        app.locals.DEFAULT_DB_INTERFACE.close();
    }); 
});
