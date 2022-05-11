import { app } from "../../app";
import {DB_interface, QueryResult, get_db_uri} from "../db_interface/DB_interface";
import {error_codes, table, values} from "./utils";
describe("Table operations", () => {
    let db_interface: DB_interface;
    app.locals.DEFAULT_DB_INTERFACE = new DB_interface({
        connectionString: get_db_uri()
    }, false);
    beforeEach(() => {
        db_interface = new DB_interface({
            connectionString: get_db_uri()
        }, true);
    });
    afterEach(() => {
        db_interface.close();
    });      
    afterAll(() => {
        db_interface = new DB_interface({
            connectionString: get_db_uri()
        }, true);
        table.delete("languages", db_interface, true); //Delete side effects
        db_interface.close();
    });
    let id = 1;
    describe("Create table", () => {
        it("No authorization", async () => {
            const result = await table.create("languages", db_interface, false);
            expect(result).toEqual(error_codes.UNAUTHORIZED("languages"));
        });
        it("Authorization", async () => {
            const result = await table.create("languages", db_interface, true);
            expect((result[0] as QueryResult<any>).rows).toEqual([]);
        });
        it("Already exists", async () => {
            const result = await table.create("languages", db_interface, true);
            expect((result[0] as QueryResult<any>).rows).toEqual([]);
        });
    });
    describe("Delete table", () => {
        it("No authorization", async () => {
            const result = await table.delete("languages", db_interface, false);
            expect(result).toEqual(error_codes.UNAUTHORIZED("languages"));
        });
        it("Authorization", async () => {
            const result = await table.delete("languages", db_interface, true);
            expect((result[0] as QueryResult<any>).rows).toEqual([]);
        });
        it("Does not exist", async () => {
            const result = await table.delete("languages", db_interface, true);
            expect(result).toEqual(error_codes.NO_EXISTING_TABLE("languages"));
        });
    });
    describe("Schema", () => {
        it("Does not exist", async () => {
            const result = await table.schema("languages", db_interface);
            expect(result).toEqual(error_codes.NO_EXISTING_TABLE("languages"));
        });
        it("Exists", async () => {
            let result = await table.create("languages", db_interface, true);
            expect((result[0] as QueryResult<any>).rows).toEqual([]);
            result = await table.schema("languages", db_interface);
            expect(typeof result).toBe("object");
        });
    });
    describe("Insert values", () => {
        const to_send = {
            name: "Italiano",
            abbreviation: "IT"
        };
        it("No authorization", async () => {
            const result = await values.insert("languages", db_interface, false, {});
            expect(result).toEqual(error_codes.UNAUTHORIZED("languages"));
        });
        it("Authorization but wrong data", async () => {
            const result = await values.insert("languages", db_interface, true, {});
            expect(result).toEqual(error_codes.INVALID_BODY("languages"));
        });
        it("Authorization and valid data", async () => {
            const result = await values.insert("languages", db_interface, true, to_send);
            expect((result[0] as QueryResult<any>).rows).toEqual([{id: 1}]);
        });
    });
    describe("Update values", () => {
        const to_send = {
            name: "Italian",
            abbreviation: "UA"
        };
        it("No authorization", async () => {
            const result = await values.update("languages", db_interface, false, {}, "");
            expect(result).toEqual(error_codes.UNAUTHORIZED("languages"));
        });
        it("No id", async () => {
            const result = await values.update("languages", db_interface, true, {}, "");
            expect(result).toEqual(error_codes.NO_REFERENCED_ITEM("languages"));
        });
        it("Authorization but wrong data", async () => {
            const result = await values.update("languages", db_interface, true, {}, id);
            expect(result).toEqual(error_codes.INVALID_BODY("languages"));
        });
        it("Authorization and valid data", async () => {
            const result = await values.update("languages", db_interface, true, to_send, id);
            expect((result[0] as QueryResult<any>).rows).toEqual([{id: id, ...to_send}]);
        });
    });
    describe("Delete values", () => {
        it("No authorization", async () => {
            const result = await values.delete("languages", db_interface, false, "");
            expect(result).toEqual(error_codes.UNAUTHORIZED("languages"));
        });
        it("No id", async () => {
            const result = await values.delete("languages", db_interface, true, "");
            expect(result).toEqual(error_codes.NO_REFERENCED_ITEM("languages"));
        });
        it("Authorization and valid data", async () => {
            let result = await values.delete("languages", db_interface, true, id);
            expect((result[0] as QueryResult<any>).rows).toEqual([{id: id}]);
            result = await values.get.all("languages", db_interface);
            expect((result[0] as QueryResult<any>).rows).toEqual([]);
        });
    });
});