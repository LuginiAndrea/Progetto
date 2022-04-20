--- Country table indexes ---
CREATE INDEX country_continents_idx ON Countries USING HASH (fk_continent_id); --- Hash is used because the index is only used for = operations ---
--- Cities table indexes ---
CREATE INDEX city_country_idx ON Cities USING HASH (fk_country_id);
CREATE INDEX city_rating_idx ON Cities (rating);
--- Monuments table indexes ---
CREATE INDEX monument_city_idx ON Monuments USING HASH (fk_city_id);
--- Visits table indexes ---
CREATE INDEX visit_user_idx ON Visits USING HASH (fk_user_id);
CREATE INDEX visit_monument_idx ON Visits USING HASH (fk_monument_id);
CREATE INDEX visit_rating_idx ON Visits (rating);
--- Type of monuments table indexes ---
CREATE INDEX period_start_idx ON Types_of_Monuments (period_start);
CREATE INDEX period_end_idx ON Types_of_Monuments (period_end);
--- Monuments Types table indexes ---
CREATE INDEX monument_type_idx ON Monuments_Types USING HASH (fk_monument_id);
CREATE INDEX monument_type_type_idx ON Monuments_Types USING HASH (fk_type_id);