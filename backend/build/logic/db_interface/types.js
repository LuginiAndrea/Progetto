"use strict";
exports.__esModule = true;
exports.get_monument_types_fields = exports.is_monument_types_body = exports.get_types_of_monuments_fields = exports.is_types_of_monuments_body = exports.get_visits_fields = exports.is_visits_body = exports.get_monuments_fields = exports.is_monuments_body = exports.get_users_fields = exports.is_users_body = exports.get_languages_fields = exports.is_languages_body = exports.get_cities_fields = exports.is_cities_body = exports.get_countries_fields = exports.is_countries_body = exports.get_continents_fields = void 0;
function get_continents_fields(filter_by) {
    var fields = ["id", "it_name", "en_name"];
    if (filter_by)
        return fields.filter(filter_by);
    return fields;
}
exports.get_continents_fields = get_continents_fields;
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
function get_countries_fields(filter_by) {
    var fields = ["id", "real_name", "it_name", "en_name", "iso_alpha_3", "fk_continent_id"];
    if (filter_by)
        return fields.filter(filter_by);
    return fields;
}
exports.get_countries_fields = get_countries_fields;
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
function get_cities_fields(filter_by) {
    var fields = ["id", "real_name", "it_name", "en_name", "rating", "fk_country_id"];
    if (filter_by)
        return fields.filter(filter_by);
    return fields;
}
exports.get_cities_fields = get_cities_fields;
function is_languages_body(obj) {
    return typeof obj.name === "string" &&
        obj.name.length <= 50 &&
        typeof obj.abbreviation === "string" &&
        obj.abbreviation.length === 2;
}
exports.is_languages_body = is_languages_body;
function get_languages_fields(filter_by) {
    var fields = ["id", "name", "abbreviation"];
    if (filter_by)
        return fields.filter(filter_by);
    return fields;
}
exports.get_languages_fields = get_languages_fields;
function is_users_body(obj) {
    return typeof obj.firebase_id === "string" &&
        typeof obj.fk_language_id === "number";
}
exports.is_users_body = is_users_body;
function get_users_fields(filter_by) {
    var fields = ["firebase_id", "fk_language_id"];
    if (filter_by)
        return fields.filter(filter_by);
    return fields;
}
exports.get_users_fields = get_users_fields;
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
function get_monuments_fields(filter_by) {
    var fields = ["id", "real_name", "it_name", "en_name", "coordinates", "it_description", "en_description", "fk_city_id"];
    if (filter_by)
        return fields.filter(filter_by);
    return fields;
}
exports.get_monuments_fields = get_monuments_fields;
function is_visits_body(obj) {
    return typeof obj.rating === "number" &&
        obj.rating >= 0 && obj.rating <= 5 &&
        typeof obj.private_description === "string" &&
        typeof obj.date_time === "string" &&
        typeof obj.fk_user_id === "number" &&
        typeof obj.fk_monument_id === "number";
}
exports.is_visits_body = is_visits_body;
function get_visits_fields(filter_by) {
    var fields = ["id", "rating", "private_description", "date_time", "fk_user_id", "fk_monument_id"];
    if (filter_by)
        return fields.filter(filter_by);
    return fields;
}
exports.get_visits_fields = get_visits_fields;
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
function get_types_of_monuments_fields(filter_by) {
    var fields = ["id", "real_name", "it_name", "en_name", "it_description", "en_description", "period_start", "period_end"];
    if (filter_by)
        return fields.filter(filter_by);
    return fields;
}
exports.get_types_of_monuments_fields = get_types_of_monuments_fields;
function is_monument_types_body(obj) {
    return typeof obj.fk_monument_id === "number" &&
        typeof obj.fk_type_of_monument_id === "number";
}
exports.is_monument_types_body = is_monument_types_body;
function get_monument_types_fields(filter_by) {
    var fields = ["fk_monument_id", "fk_type_of_monument_id"];
    if (filter_by)
        return fields.filter(filter_by);
    return fields;
}
exports.get_monument_types_fields = get_monument_types_fields;
