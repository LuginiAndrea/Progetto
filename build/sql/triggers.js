"use strict";
exports.__esModule = true;
exports.update_monument_rating_trigger = exports.update_visits_rating_trigger = void 0;
var update_visits_rating_trigger = "\n    CREATE OR REPLACE TRIGGER update_visits_rating_trigger AFTER INSERT OR UPDATE OR DELETE ON visits\n    FOR EACH ROW EXECUTE PROCEDURE update_monument_rating();\n";
exports.update_visits_rating_trigger = update_visits_rating_trigger;
var update_monument_rating_trigger = "\n    CREATE OR REPLACE TRIGGER update_monument_rating_trigger AFTER UPDATE OR DELETE ON monuments\n    FOR EACH ROW EXECUTE PROCEDURE update_city_rating();\n";
exports.update_monument_rating_trigger = update_monument_rating_trigger;
