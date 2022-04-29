import { app } from "../../app";
import { DB_interface, get_db_uri } from "../../logic/db_interface/DB_interface";
import supertest from "supertest";

describe("Continents-routes-testing", () => {
    // SETUP
    const request = supertest(app);
    const base_url = "/countries";

    const it_countries_response = [
        {
          "id": 5,
          "real_name": "Italia",
          "it_name": "Italia",
          "iso_alpha_3": "ITA",
          "fk_continent_id": 0
        },
        {
          "id": 7,
          "real_name": "France",
          "it_name": "Francia",
          "iso_alpha_3": "FRA",
          "fk_continent_id": 0
        },
        {
          "id": 13,
          "real_name": "México",
          "it_name": "Messico",
          "iso_alpha_3": "MEX",
          "fk_continent_id": 2
        }
      ]
    const en_countries_response = [
        {
          "id": 5,
          "real_name": "Italia",
          "en_name": "Italy",
          "iso_alpha_3": "ITA",
          "fk_continent_id": 0
        },
        {
          "id": 7,
          "real_name": "France",
          "en_name": "France",
          "iso_alpha_3": "FRA",
          "fk_continent_id": 0
        },
        {
          "id": 13,
          "real_name": "México",
          "en_name": "Mexico",
          "iso_alpha_3": "MEX",
          "fk_continent_id": 2
        }
      ]
    

    app.locals.DEFAULT_DB_INTERFACE = new DB_interface({
        connectionString: get_db_uri()
    }, true);

    const error_codes = {
        "no_continent_ids": "countries_1",
        "no_city_id": "countries_2",
        "no_compatible_insert_body": "countries_3",
    };

    let id_to_del = 0;

    
    // describe("IT language", () => {
    //     it("Gets the /list_all endpoint", async () => {
    //         const response = await request.get(`${base_url}/list_all`);
    //         expect(response.status).toBe(200);
    //         const obj = JSON.parse(response.text) as Array<any>;
    //         for(const country of it_countries_response) {
    //             console.log(country);
    //             expect(obj.toString().includes(JSON.stringify(country))).toBe(true);
    //         }
    //         // {
        });
        // it("Gets the /list_single/:country_id endpoint", async () => {
        //     const response = await request.get(`${base_url}/list_single/5`);
        //     expect(response.status).toBe(200);
        //     const obj = JSON.parse(response.text);
        //     expect(obj[0]).toEqual(it_countries_response[0]);
        // });
        // it("Gets the /list_single_by_iso_code/:iso_code endpoint", async () => {
        //     const response = await request.get(`${base_url}/list_single_by_iso_code/ITA`);
        //     expect(response.status).toBe(200);
        //     const obj = JSON.parse(response.text);
        //     expect(obj[0]).toEqual(it_countries_response[0]);
        // });
        // it("Gets the /countries_in_continents endpoint with no query string", async () => {
        //     const response = await request.get(`${base_url}/countries_in_continents`);
        //     expect(response.status).toBe(400);
        //     const obj = JSON.parse(response.text);
        //     expect(obj).toEqual({error: error_codes.no_continent_ids});
        // });
        // it("Gets the /countries_in_continents endpoint with a continent_id", async () => {
        //     const eu_nations_idx = [0,1];
        //     const response = await request.get(`${base_url}/countries_in_continents?continent_ids=0`);
        //     expect(response.status).toBe(200);
        //     const obj = JSON.parse(response.text);
        //     for(let i = 0; i < obj.length; i++) {
        //         expect(obj[i]).toEqual(it_countries_response[eu_nations_idx[i]]);
        //     }
        // });
        // it("Gets the /countries_in_continents endpoint with 2 continents_id", async () => {
        //     const response = await request.get(`${base_url}/countries_in_continents?continent_ids=0,2`);
        //     expect(response.status).toBe(200);
        //     const obj = JSON.parse(response.text);
        //     expect(obj).toEqual(it_countries_response);
        // });
    });

    // describe("EN language", () => {
    //     it("Gets the /list_all endpoint", async () => {
    //         const response = await request
    //             .get(`${base_url}/list_all`)
    //             .set("Authorization", "1");
    //         expect(response.status).toBe(200);
    //         const obj = JSON.parse(response.text);
    //         for(let i = 0; i < obj.length; i++) {
    //             expect(obj[i]).toEqual(en_countries_response[i]);
    //         }
    //     });
    // });

    // describe("Inserts into countries tests", () => {
    //     it("Inputs a new country with no authorization", async () => {
    //         const response = await request
    //             .post(base_url+"/insert")
    //             .send({
    //                 "real_name": "中国",
    //                 "it_name": "Cina",
    //                 "en_name": "China",
    //                 "iso_alpha_3": "CHN",
    //                 "fk_continent_id": 1
    //             });
    //         expect(response.status).toBe(401);
    //         const obj = JSON.parse(response.text);
    //         expect(obj).toEqual({error: "Unauthorized"});
    //     });
    //     it("Inputs an existing country with authorization", async () => {
    //         const response = await request
    //             .post(base_url+"/insert")
    //             .set("Authorization", "1")
    //             .send({
    //                 "id": 5,
    //                 "real_name": "Italia",
    //                 "it_name": "Italia",
    //                 "en_name": "Italy",
    //                 "iso_alpha_3": "ITA",
    //                 "fk_continent_id": 0
    //             });
    //         expect(response.statusCode).toBe(409);
    //     });
    //     it("Inputs a non-existing country with authorization", async () => {
    //         const response = await request
    //             .post(base_url+"/insert")
    //             .set("Authorization", "1")
    //             .send({
    //                 "real_name": "中国",
    //                 "it_name": "Cina",
    //                 "en_name": "China",
    //                 "iso_alpha_3": "CHN",
    //                 "fk_continent_id": 1
    //             });
    //         expect(response.statusCode).toBe(201);
    //         const obj = JSON.parse(response.text)[0];
    //         id_to_del = obj["id"];
    //     });
    // });

    // describe("Delete from countries tests", () => {
    //     it("Deletes a country with no authorization", async () => {
    //         const response = await request
    //             .delete(base_url+"/delete/2");
    //         expect(response.status).toBe(401);
    //     });
    //     it("Deletes a non-existing country with authorization", async () => {
    //         const response = await request
    //             .delete(base_url+"/delete/100")
    //             .set("Authorization", "1");
    //         expect(response.status).toBe(404);
    //     });
    //     it("Deletes a country with authorization", async () => {
    //         const response = await request
    //             .delete(base_url+"/delete/"+id_to_del)
    //             .set("Authorization", "1");
    //         expect(response.status).toBe(200);
    //         const obj = JSON.parse(response.text)[0];
    //         expect(obj["id"]).toEqual(id_to_del);
    //     });
    // });

    afterAll(async () => {
        app.locals.DEFAULT_DB_INTERFACE.close();
    });

});