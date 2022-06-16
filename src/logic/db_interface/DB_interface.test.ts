import { DB_interface, get_db_uri } from "./DB_interface"
describe("DB_interface", () => {
    it("Connection on initialization", async () => {
        const db = new DB_interface({
            connectionString: get_db_uri()
        });
        expect(db.connected()).toBe(true);
        db.close();
        expect(db.connected()).toBe(false);
    });
    
    it("Connection after initialization", async () => {
        const db = new DB_interface({
            connectionString: get_db_uri()
        }, false);
        expect(db.connected()).toBe(false);
        db.connect();
        expect(db.connected()).toBe(true);
        db.close();
        expect(db.connected()).toBe(false);
    });

    it("Re-open connection", async () => {
        const db = new DB_interface({
            connectionString: get_db_uri()
        });
        expect(db.connected()).toBe(true);
        db.close();
        expect(db.connected()).toBe(false);
        db.connect();
        expect(db.connected()).toBe(true);
        db.close();
        expect(db.connected()).toBe(false);
    });
});
