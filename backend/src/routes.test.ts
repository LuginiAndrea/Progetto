import { app } from "./app";
import { DB_interface, get_db_uri } from "././logic/db_interface/DB_interface";
import supertest from "supertest";
import { table, values, error_codes } from "./logic/tables/utils";

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
        describe("Table operations", () => {
            app.locals.DEFAULT_DB_INTERFACE = new DB_interface({
                connectionString: get_db_uri()
            }, true);
            app.locals.DEFAULT_DB_INTERFACE.query("BEGIN");
            
            describe("/Create table", () => {
                it("No authorization", async () => {
                    const result = await table.create("continents", app.locals.DEFAULT_DB_INTERFACE, false);
                    expect(result).toEqual("Not Authorized.continents");
                });
                it("Authorization", async () => {
                    const result = await table.create("continents", app.locals.DEFAULT_DB_INTERFACE, true);
                    expect(result).toEqual([[]]);
                });
                it("Already exists", async () => {
                    const result = await table.create("continents", app.locals.DEFAULT_DB_INTERFACE, true);
                    expect(result).toEqual([[]]);
                });
            });
            describe("Delete table", () => {
                it("No authorization", async () => {
                    const result = await table.delete("continents", app.locals.DEFAULT_DB_INTERFACE, false);
                    expect(result).toEqual("Not Authorized.continents");
                });
                it("Authorization", async () => {
                    const result = await table.delete("continents", app.locals.DEFAULT_DB_INTERFACE, true);
                    expect(result).toEqual([[]]);
                });
                it("Does not exist", async () => {
                    const result = await table.delete("continents", app.locals.DEFAULT_DB_INTERFACE, true);
                    expect(result).toEqual("No Existing Table.continents");
                });
            });
            describe("Schema")
            describe("/Insert values", () => {
                it("No authorization", async () => {
                    const result = await values.insert("countries", app.locals.DEFAULT_DB_INTERFACE, false, {
                        continent: "Europe"

    });

    app.locals.DB_interface?.close();
    
});

describe("General routes tests", async () => {
    // SETUP
    const request = supertest(app);
    app.locals.DEFAULT_DB_INTERFACE = new DB_interface({
        connectionString: get_db_uri()
    }, true);
    const all_routes = [
        "continents",
        "countries",
        "cities",
        "languages",
        "users"
    ]; //Order is important
    await app.locals.DB_interface.query("BEGIN");
    
    for(const route of all_routes) {
        describe(`/${route}`, () => {
            it("Create table", async () => {
                const response = await request.post(`/${route}`).send({



