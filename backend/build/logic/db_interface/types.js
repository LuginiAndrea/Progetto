"use strict";
exports.__esModule = true;
exports.is_monument_types_body = exports.is_types_of_monuments_body = exports.is_visits_body = exports.is_monuments_body = exports.is_users_body = exports.is_languages_body = exports.is_cities_body = exports.is_countries_body = void 0;
function is_countries_body(obj) {
    return typeof obj.real_name === "string" &&
        obj.real_name.length <= 50 &&
        typeof obj.it_name === "string" &&
        obj.it_name.length <= 50 &&
        typeof obj.en_name === "string" &&
        obj.en_name.length <= 50 &&
        typeof obj.iso_alpha_3 === "string" &&
        obj.iso_alpha_3.length === 3 &&
        typeof obj.fk_continent_id === "number";
}
exports.is_countries_body = is_countries_body;
function is_cities_body(obj) {
    return typeof obj.real_name === "string" &&
        obj.real_name.length <= 50 &&
        typeof obj.it_name === "string" &&
        obj.it_name.length <= 50 &&
        typeof obj.en_name === "string" &&
        obj.en_name.length <= 50 &&
        typeof obj.rating === "number" &&
        obj.rating >= 0 && obj.rating <= 5 &&
        typeof obj.fk_country_id === "number";
}
exports.is_cities_body = is_cities_body;
function is_languages_body(obj) {
    return typeof obj.name === "string" &&
        obj.name.length <= 50 &&
        typeof obj.abbreviation === "string" &&
        obj.abbreviation.length === 2 &&
        typeof obj.fk_country_id === "number";
}
exports.is_languages_body = is_languages_body;
function is_users_body(obj) {
    return typeof obj.firebase_id === "string" &&
        typeof obj.fk_language_id === "number";
}
exports.is_users_body = is_users_body;
function is_monuments_body(obj) {
    return typeof obj.real_name === "string" &&
        obj.real_name.length <= 50 &&
        typeof obj.it_name === "string" &&
        obj.it_name.length <= 50 &&
        typeof obj.en_name === "string" &&
        obj.en_name.length <= 50 &&
        typeof obj.coordinates === "string" &&
        typeof obj.it_description === "string" &&
        typeof obj.en_description === "string" &&
        typeof obj.fk_city_id === "number";
}
exports.is_monuments_body = is_monuments_body;
function is_visits_body(obj) {
    return typeof obj.rating === "number" &&
        obj.rating >= 0 && obj.rating <= 5 &&
        typeof obj.private_description === "string" &&
        typeof obj.date_time === "string" &&
        typeof obj.fk_user_id === "number" &&
        typeof obj.fk_monument_id === "number";
}
exports.is_visits_body = is_visits_body;
function is_types_of_monuments_body(obj) {
    return typeof obj.real_name === "string" &&
        obj.real_name.length <= 50 &&
        typeof obj.it_name === "string" &&
        obj.it_name.length <= 50 &&
        typeof obj.en_name === "string" &&
        obj.en_name.length <= 50 &&
        typeof obj.it_description === "string" &&
        typeof obj.en_description === "string" &&
        typeof obj.period_start === "string" &&
        typeof obj.period_end === "string";
}
exports.is_types_of_monuments_body = is_types_of_monuments_body;
function is_monument_types_body(obj) {
    return typeof obj.fk_monument_id === "number" &&
        typeof obj.fk_type_of_monument_id === "number";
}
exports.is_monument_types_body = is_monument_types_body;
