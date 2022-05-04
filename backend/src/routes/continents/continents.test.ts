import { app } from "../../app";
import { DB_interface, get_db_uri } from "../../logic/db_interface/DB_interface";
import supertest from "supertest";

describe("Continents-routes-testing", () => {
    // SETUP
    const request = supertest(app);
    const base_url = "/continents";
    const it_continents_response = [
        {id: 0, it_name: "Europa"},
        {id: 1, it_name: "Asia"},
        {id: 2, it_name: "Nord America"},
        {id: 3, it_name: "Sud America"},
        {id: 4, it_name: "Africa"},
        {id: 5, it_name: "Oceania"},
        {id: 6, it_name: "Antartica"},
        {id: 7, it_name: "America Centrale"}
    ].sort((a, b) => a.it_name > b.it_name ? 1 : -1);
    const en_continents_response = [
        {id: 0, en_name: "Europe"},
        {id: 1, en_name: "Asia"},
        {id: 2, en_name: "North America"},
        {id: 3, en_name: "South America"},
        {id: 4, en_name: "Africa"},
        {id: 5, en_name: "Oceania"},
        {id: 6, en_name: "Antarctica"},
        {id: 7, en_name: "Central America"}
    ].sort((a, b) => a.en_name > b.en_name ? 1 : -1);

    const countries = {
        "Italy": {id: 5, continent_id: 0},
        "France": {id: 7, continent_id: 0},
        "Mexico": {id: 13, continent_id: 2},
    };

    app.locals.DEFAULT_DB_INTERFACE = new DB_interface({
        connectionString: get_db_uri()
    }, true);

    const error_codes = {
        no_country_id: "continents_1"
    }

    
    describe("IT language", () => {
        it("Gets the /list_all endpoint", async () => {
            const response = await request.get(`${base_url}/list_all`);
            expect(response.status).toBe(200);
            const obj = JSON.parse(response.text);
            for(let i = 0; i < obj.length; i++) {
                expect(obj[i]).toEqual(it_continents_response[i]);
            }
        });

        it("Gets the /list_single/:continent_id endpoint", async () => {
            const response = await request.get(`${base_url}/list_single/0`);
            expect(response.status).toBe(200);
            const obj = JSON.parse(response.text);
            expect(obj[0]).toEqual(it_continents_response.filter(c => c.id === 0)[0]);
        });
    });

    describe("EN language", () => {
        it("Gets the /list_single/:continent_id endpoint", async () => {
            const response = await request
                .get(`${base_url}/list_single/0`)
                .set("Authorization", "1");
            expect(response.status).toBe(200);
            const obj = JSON.parse(response.text);
            expect(obj[0]).toEqual(en_continents_response.filter(c => c.id === 0)[0]);
        });
    });

    it("Gets the /continent_of_country/:country_id endpoint", async () => {
        const ids = [
            countries["Italy"],
            countries["France"],
            countries["Mexico"]
        ];
        for (let country of ids) {
            const response = await request.get(`${base_url}/continent_of_country?country_id=${country.id}`);
            expect(response.status).toBe(200);
            const obj = JSON.parse(response.text);
            expect(obj[0]["id"]).toEqual(country.continent_id);
        }
        const response = await request.get(`${base_url}/continent_of_country`);
        const obj = JSON.parse(response.text);
        expect(response.status).toBe(400);
        expect(obj).toEqual({error: error_codes.no_country_id});
    });

    afterAll(async () => {
        app.locals.DEFAULT_DB_INTERFACE.close();
    });

});