import { app } from "../../app";
import supertest from "supertest";

const request = supertest(app);

describe("Continents-routes-testing", () => {
    const base_url = "/continents";
    const continents_response = [
        {id: 0, it_name: "Europa", en_name: "Europe"},
        {id: 1, it_name: "Asia", en_name: "Asia"},
        {id: 2, it_name: "Nord America", en_name: "North America"},
        {id: 3, it_name: "Sud America", en_name: "South America"},
        {id: 4, it_name: "Africa", en_name: "Africa"},
        {id: 5, it_name: "Oceania", en_name: "Oceania"},
        {id: 6, it_name: "Antartica", en_name: "Antarctica"},
        {id: 7, it_name: "America Centrale", en_name: "Central America"}
    ];

    const countries = {
        "Italy": {id: 5, continent_id: 0},
        "France": {id: 7, continent_id: 0},
        "Mexico": {id: 8, continent_id: 2},
    };

    it("Gets the /list_all endpoint", async () => {
        const response = await request.get(`${base_url}/list_all`);
        expect(response.status).toBe(200);
        const obj = JSON.parse(response.text);
        for(let i = 0; i < obj.length; i++) {
            expect(obj[i]).toEqual(continents_response[i]);
        }
    });

    it("Gets the /single_continent/:continent_id endpoint", async () => {
        const response = await request.get(`${base_url}/single_continent/0`);
        expect(response.status).toBe(200);
        const obj = JSON.parse(response.text);
        expect(obj[0]).toEqual(continents_response[0]);
    });

    it("Gets the /continent_of_country/:country_id endpoint", async () => {
        const ids = [
            countries["Italy"],
            countries["France"],
            countries["Mexico"]
        ];
        for (let country of ids) {
            const response = await request.get(`${base_url}/continent_of_country/${country.id}`);
            expect(response.status).toBe(200);
            const obj = JSON.parse(response.text);
            expect(obj[0]["fk_continent_id"]).toEqual(country.continent_id);
        }
    });


});