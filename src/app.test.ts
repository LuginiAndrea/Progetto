import { app } from "./app";
import { DB_interface, get_db_uri } from "./logic/db_interface/DB_interface";
import supertest from "supertest";
jest.setTimeout(50000);
import { table, values } from "./logic/tables/utils";

describe("Benchmarks tests", () => {
    // SETUP
    const request = supertest(app);

    beforeAll(async () => {
        const db_interface = new DB_interface({
            connectionString: get_db_uri()
        }, true);
        app.locals.DEFAULT_DB_INTERFACE = new DB_interface({
            connectionString: get_db_uri()
        }, true);
        await table.create("continents", db_interface, true);
        await table.create("countries", db_interface, true);
        await table.create("cities", db_interface, true);
        await table.create("monuments", db_interface, true);
        await table.create("languages", db_interface, true);
        await table.create("users", db_interface, true);
        await table.create("visits", db_interface, true);
        await table.create("types_of_monuments", db_interface, true);
        await table.create("monument_types", db_interface, true);

        const res = await request.post("/continents/insert").set("Authorization", "1");
        await values.insert("countries", db_interface, true, [
            {
                real_name: "Italia",
                it_name: "Italia",
                en_name: "Italy",
                iso_alpha_3: "ITA",
                fk_continent_id: 0
            },
            {
                real_name: "Polska",
                it_name: "Polonia",
                en_name: "Poland",
                iso_alpha_3: "POL",
                fk_continent_id: 0
            },
            {
                real_name: "United States of America",
                it_name: "Stati Uniti d'America",
                en_name: "United States of America",
                iso_alpha_3: "USA",
                fk_continent_id: 2
            }
        ]);
        // City
        await values.insert("cities", db_interface, true, [
            {
                real_name: "Roma",
                it_name: "Roma",
                en_name: "Rome",
                fk_country_id: 1
            },
            {
                real_name: "Milano",
                it_name: "Milano",
                en_name: "Milan",
                fk_country_id: 1
            },
            {
                real_name: "Kraków",
                it_name: "Cracovia",
                en_name: "Krakow",
                fk_country_id: 2
            },
            {
                real_name: "New York",
                it_name: "New York",
                en_name: "New York",
                fk_country_id: 3
            }
        ]);
        // Monument
        await values.insert("monuments", db_interface, true, [
            {
                real_name: "Colosseo",
                it_name: "Colosseo",
                en_name: "Colosseum",
                coordinates: "SRID=4326;POINT(12.4877369 41.8906032)",
                it_description: "Il monumento più bello del mondo",
                en_description: "The most beautiful monument in the world",
                fk_city_id: 1,
            },
            {
                real_name: "Piazza di Spagna",
                it_name: "Piazza di Spagna",
                en_name: "Piazza di Spagna",
                coordinates: "SRID=4326;POINT(12.4803623 41.9058439)",
                it_description: "Il secondo monumento più bello del mondo",
                en_description: "The second most beautiful monument in the world",
                fk_city_id: 1,
            },
            {
                real_name: "Barcaccia",
                it_name: "Barcaccia",
                en_name: "Barcaccia",
                coordinates: "SRID=4326;POINT(12.4903623 41.9258439)",
                it_description: "Il quarto monumento più bello del mondo",
                en_description: "The second most beautiful monument in the world",
                fk_city_id: 1,
            },
            {
                real_name: "Duomo",
                it_name: "Duomo",
                en_name: "Duomo",
                coordinates: "SRID=4326;POINT(31.491667 14.891944)",
                it_description: "Il terzo monumento più bello del mondo",
                en_description: "The third most beautiful monument in the world",
                fk_city_id: 2,
            },
            {
                real_name: "Monumento Polacco",
                it_name: "Monumento Polacco",
                en_name: "Polish monument",
                coordinates: "SRID=4326;POINT(5.491667 41.891944)",
                it_description: "Il quarto monumento più bello del mondo",
                en_description: "The fourth most beautiful monument in the world",
                fk_city_id: 3,
            },
            {
                real_name: "Monumento USA",
                it_name: "Monumento USA",
                en_name: "American monument",
                coordinates: "SRID=4326;POINT(56.491667 41.891944)",
                it_description: "Il quinto monumento più bello del mondo",
                en_description: "The fifth most beautiful monument in the world",
                fk_city_id: 4,
            }
        ]);
        // Language
        await values.insert("languages", db_interface, true, {
            name: "English",
            abbreviation: "EN"
        });
        // User
        await values.insert("users", db_interface, true, {
            id: 2,
            fk_language_id: 1
        });
        await values.insert("users", db_interface, true, {
            id: 3,
            fk_language_id: 1
        });
        await values.insert("users", db_interface, true, {
            id: 4,
            fk_language_id: 1
        });
        // Visit
        await values.insert("visits", db_interface, true, [
            {
                rating: 3, 
                private_description: "Visita molto bella",
                date_time: "2020-01-01",
                fk_user_id: 2,
                fk_monument_id: 1 //Colosseo
            },
            {
                rating: 2,
                private_description: "Visita molto bella",
                date_time: "2021-01-01",
                fk_user_id: 2,
                fk_monument_id: 2 //Piazza di spagna
            },
            {
                rating: 4,
                private_description: "Visita molto bella",
                date_time: "2022-01-01",
                fk_user_id: 4,
                fk_monument_id: 3 //Barcaccia
            },
            {
                rating: 4,
                private_description: "Visita molto bella",
                date_time: "2022-01-01",
                fk_user_id: 3,
                fk_monument_id: 3 //Barcaccia
            },
            {
                rating: 5,
                private_description: "Visita molto bella",
                date_time: "2022-01-01",
                fk_user_id: 3,
                fk_monument_id: 4 //Duomo
            },
            {
                rating: 5,
                private_description: "Visita molto bella",
                date_time: "2022-01-01",
                fk_user_id: 3,
                fk_monument_id: 5 //Polacco
            },
            {
                rating: 5,
                private_description: "Visita molto bella",
                date_time: "2022-01-01",
                fk_user_id: 4,
                fk_monument_id: 5 //Polacco
            }
        ]);
        // types_of_monuments
        await values.insert("types_of_monuments", db_interface, true, {
            real_name: "Museo",
            it_name: "Museo",
            en_name: "Museum",
            it_description: "Museo di storia",
            en_description: "History museum"
        });
        await values.insert("types_of_monuments", db_interface, true, {
            real_name: "Palace",
            it_name: "Palazzo",
            en_name: "Palace",
            it_description: "Palazzo di storia",
            en_description: "History palace"
        });
        await values.insert("types_of_monuments", db_interface, true, {
            real_name: "Castle",
            it_name: "Castello",
            en_name: "Castle",
            it_description: "Castello di storia",
            en_description: "History castle"
        });
        // monuments_types
        await values.insert("monument_types", db_interface, true, {
            fk_type_id: 1, //Museo Storia
            fk_monument_id: 1 //Colosseo
        });
        await values.insert("monument_types", db_interface, true, {
            fk_type_id: 2, //Palazzo
            fk_monument_id: 1 //Colosseo
        });
        await values.insert("monument_types", db_interface, true, {
            fk_type_id: 1, //Museo Storia
            fk_monument_id: 2 //Piazza di spagna
        });
        await values.insert("monument_types", db_interface, true, {
            fk_type_id: 2, //Palazzo
            fk_monument_id: 3 //Barcaccia
        });
        await values.insert("monument_types", db_interface, true, {
            fk_type_id: 1, //Museo Storia
            fk_monument_id: 4 //Duomo
        });
        await values.insert("monument_types", db_interface, true, {
            fk_type_id: 3, //Castello Storia
            fk_monument_id: 4 //Polacco
        });
        db_interface.close();
    });
    afterAll(async () => {
        const db_interface = new DB_interface({
            connectionString: get_db_uri()
        }, true);
        await table.delete("monument_types", db_interface, true);
        await table.delete("types_of_monuments", db_interface, true);
        await table.delete("visits", db_interface, true);
        await table.delete("monuments", db_interface, true);
        await table.delete("cities", db_interface, true);
        await table.delete("users", db_interface, true);
        await table.delete("languages", db_interface, true);
        await table.delete("countries", db_interface, true);
        await table.delete("continents", db_interface, true);
        db_interface.close();
        app.locals.DEFAULT_DB_INTERFACE?.close();
    }); 
    describe("Specific api tests", () => {
        // describe("Get monuments in specified cities", () => {
        //     it("Cities that are in the DB", async () => { 
        //         const cities_id = [1, 2];
        //         const monuments_name = ["Colosseo", "Piazza di Spagna", "Duomo"];
        //         const response = await request.get(`/monuments/monuments_in_cities?ids=${cities_id.join(",")}`);
        //         expect(response.status).toBe(200);
        //         response.body = response.body[0];
        //         expect(response.body.length).toBe(3);
        //         for (let i = 0; i < response.body.length; i++) {
        //             const monument = response.body[i];
        //             expect(cities_id).toContain(monument.monuments_fk_city_id);
        //             expect(monuments_name).toContain(monument.monuments_real_name);
        //         }
        //     });
        //     it("Cities not present in the DB", async () => {
        //         const cities_id = [10];
        //         const response = await request.get(`/monuments/monuments_in_cities?ids=${cities_id.join(",")}`);
        //         expect(response.status).toBe(200);
        //         response.body = response.body[0];
        //         expect(response.body.length).toBe(0);
        //     });
        //     it("No cities passed", async () => {
        //         const response = await request.get(`/monuments/monuments_in_cities`);
        //         expect(response.status).toBe(400);
        //     });
        // });
        // describe("Markers", () => {
        //     it("Markers by distance", async () => {
        //         const distance = 3000;
        //         const latitude = 41.8981325;
        //         const longitude = 12.4785729;
        //         const response = await request.get(`/monuments/markers_by_distance?distance=${distance}&latitude=${latitude}&longitude=${longitude}`);
        //         expect(response.status).toBe(200);
        //         response.body = response.body[0];
        //         expect(response.body.length).toBe(2);
        //         expect(response.body[0].real_name).toBe("Piazza di Spagna");
        //         expect(response.body[1].real_name).toBe("Colosseo");
        //     });
        // });
        describe("Monuments", () => {
            it("Visited monument", async () => {
                const id = 1; //Colosseo
                const response = await request.get(`/monuments/filter_by_id?ids=${id}`).set("Authorization", "2");
                expect(response.status).toBe(200);
                console.dir(response.body, { depth: null });
            });
            it("By types", async () => {
                const types = 2; //Museo
                const response = await request.get(`/monuments/filter_by_types?ids=${types}`);
                expect(response.status).toBe(200);
                console.dir(response.body, { depth: null });
            });
        });
        describe("Visits", () => {
            it("Get visits", async () => {
                const response = await request.get(`/visits/filter_by_single_user`).set("Authorization", "2");
                expect(response.status).toBe(200);
                console.dir(response.body, { depth: null });
            });
        });
        describe("Reccomendations", () => {
            it("Get reccomendations", async () => {
                const response = await request.get(`/monuments/discover`).set("Authorization", "2");
                expect(response.status).toBe(200);
                console.dir(response.body, { depth: null });
            });
        });
    });
});
        
