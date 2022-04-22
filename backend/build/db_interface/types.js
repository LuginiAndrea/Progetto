"use strict";
exports.__esModule = true;
exports.is_cities_body = exports.is_countries_body = void 0;
function is_countries_body(obj) {
    return typeof obj.real_name === "string" &&
        typeof obj.it_name === "string" &&
        typeof obj.en_name === "string" &&
        typeof obj.iso_alpha_3 === "string" &&
        typeof obj.fk_continent_id === "number";
}
exports.is_countries_body = is_countries_body;
function is_cities_body(obj) {
    return typeof obj.real_name === "string" &&
        typeof obj.it_name === "string" &&
        typeof obj.en_name === "string" &&
        typeof obj.rating === "number" &&
        typeof obj.fk_country_id === "number";
}
exports.is_cities_body = is_cities_body;
