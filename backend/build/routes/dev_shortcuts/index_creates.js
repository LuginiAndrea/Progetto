"use strict";
exports.__esModule = true;
exports.index_arguments = void 0;
var create_country_continents_idx = "CREATE INDEX country_continents_idx ON Countries USING HASH (fk_continent_id);";
var create_country_name_idx = "CREATE INDEX country_name_idx ON Countries USING (real_name);";
var create_city_country_idx = "CREATE INDEX city_country_idx ON Cities USING HASH (fk_country_id);";
var create_city_rating_idx = "CREATE INDEX city_rating_idx ON Cities (rating);";
var create_monument_city_idx = "CREATE INDEX monument_city_idx ON Monuments USING HASH (fk_city_id);";
var create_visit_user_idx = "CREATE INDEX visit_user_idx ON Visits USING HASH (fk_user_id);";
var create_visit_monument_idx = "CREATE INDEX visit_monument_idx ON Visits USING HASH (fk_monument_id);";
var create_visit_rating_idx = "CREATE INDEX visit_rating_idx ON Visits (rating);";
var create_period_start_idx = "CREATE INDEX period_start_idx ON Types_of_Monuments (period_start);";
var create_period_end_idx = "CREATE INDEX period_end_idx ON Types_of_Monuments (period_end);";
var create_monument_type_idx = "CREATE INDEX monument_type_idx ON Monuments_Types USING HASH (fk_monument_id);";
var create_monument_type_type_idx = "CREATE INDEX monument_type_type_idx ON Monuments_Types USING HASH (fk_type_id);";
var index_arguments = {
    "country_continents_idx": create_country_continents_idx,
    "city_country_idx": create_city_country_idx,
    "city_rating_idx": create_city_rating_idx,
    "monument_city_idx": create_monument_city_idx,
    "visit_user_idx": create_visit_user_idx,
    "visit_monument_idx": create_visit_monument_idx,
    "visit_rating_idx": create_visit_rating_idx,
    "period_start_idx": create_period_start_idx,
    "period_end_idx": create_period_end_idx,
    "monument_type_idx": create_monument_type_idx,
    "monument_type_type_idx": create_monument_type_type_idx
};
exports.index_arguments = index_arguments;
