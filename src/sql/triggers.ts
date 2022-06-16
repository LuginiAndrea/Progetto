const update_visits_rating_trigger = `
    CREATE OR REPLACE TRIGGER update_visits_rating_trigger AFTER INSERT OR UPDATE OR DELETE ON visits
    FOR EACH ROW EXECUTE PROCEDURE update_monument_rating();
`;
const update_monument_rating_trigger = `
    CREATE OR REPLACE TRIGGER update_monument_rating_trigger AFTER UPDATE OR DELETE ON monuments
    FOR EACH ROW EXECUTE PROCEDURE update_city_rating();
`;

export {update_visits_rating_trigger, update_monument_rating_trigger};