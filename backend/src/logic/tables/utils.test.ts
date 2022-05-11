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
        table.delete("test", db_interface, true); //Delete side effects
        db_interface.close();
    });
    let id = 1;
    describe("Create table", () => {
        it("No authorization", async () => {
            const result = await table.create("test", db_interface, false);
            expect(result).toEqual(error_codes.UNAUTHORIZED("test"));
        });
        it("Authorization", async () => {
            const result = await table.create("test", db_interface, true);
            expect((result[0] as QueryResult<any>).rows).toEqual([]);
        });
        it("Already exists", async () => {
            const result = await table.create("test", db_interface, true);
            expect((result[0] as QueryResult<any>).rows).toEqual([]);
        });
    });
    describe("Delete table", () => {
        it("No authorization", async () => {
            const result = await table.delete("test", db_interface, false);
            expect(result).toEqual(error_codes.UNAUTHORIZED("test"));
        });
        it("Authorization", async () => {
            const result = await table.delete("test", db_interface, true);
            expect((result[0] as QueryResult<any>).rows).toEqual([]);
        });
        it("Does not exist", async () => {
            const result = await table.delete("test", db_interface, true);
            expect(result).toEqual(error_codes.NO_EXISTING_TABLE("test"));
        });
    });
    describe("Schema", () => {
        it("Does not exist", async () => {
            const result = await table.schema("test", db_interface);
            expect(result).toEqual(error_codes.NO_EXISTING_TABLE("test"));
        });
        it("Exists", async () => {
            let result = await table.create("test", db_interface, true);
            expect((result[0] as QueryResult<any>).rows).toEqual([]);
            result = await table.schema("test", db_interface);
            expect(typeof result).toBe("object");
        });
    });
    describe("Insert values", () => {
        const to_send = {
            name: "Marcello",
            number: 5
        };
        it("No authorization", async () => {
            const result = await values.insert("test", db_interface, false, {});
            expect(result).toEqual(error_codes.UNAUTHORIZED("test"));
        });
        it("Authorization but wrong data", async () => {
            const result = await values.insert("test", db_interface, true, {});
            expect(result).toEqual(error_codes.INVALID_BODY("test"));
        });
        it("Authorization and valid data", async () => {
            const result = await values.insert("test", db_interface, true, to_send);
            expect((result[0] as QueryResult<any>).rows).toEqual([{id: 1}]);
        });
    });
    describe("Update values", () => {
        const to_send = {
            name: "Carlo",
        };
        it("No authorization", async () => {
            const result = await values.update("test", db_interface, false, {}, "");
            expect(result).toEqual(error_codes.UNAUTHORIZED("test"));
        });
        it("No id", async () => {
            const result = await values.update("test", db_interface, true, {}, "");
            expect(result).toEqual(error_codes.NO_REFERENCED_ITEM("test"));
        });
        it("Authorization but wrong data", async () => {
            const result = await values.update("test", db_interface, true, {}, id);
            expect(result).toEqual(error_codes.INVALID_BODY("test"));
        });
        it("Authorization and valid data", async () => {
            const result = await values.update("test", db_interface, true, to_send, id);
            expect((result[0] as QueryResult<any>).rows).toEqual([{id: id, name: "Carlo", number: 5}]);
        });
    });
    describe("Delete values", () => {
        it("No authorization", async () => {
            const result = await values.delete("test", db_interface, false, "");
            expect(result).toEqual(error_codes.UNAUTHORIZED("test"));
        });
        it("No id", async () => {
            const result = await values.delete("test", db_interface, true, "");
            expect(result).toEqual(error_codes.NO_REFERENCED_ITEM("test"));
        });
        it("Authorization and valid data", async () => {
            let result = await values.delete("test", db_interface, true, id);
            expect((result[0] as QueryResult<any>).rows).toEqual([{id: id}]);
            result = await values.get.all("test", db_interface);
            expect((result[0] as QueryResult<any>).rows).toEqual([]);
        });
    });
});