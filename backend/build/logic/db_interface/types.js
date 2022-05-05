"use strict";
exports.__esModule = true;
exports.is_monument_types_body = exports.is_types_of_monuments_body = exports.is_visits_body = exports.is_monuments_body = exports.is_users_body = exports.is_languages_body = exports.is_cities_body = exports.is_countries_body = exports.extract_values_of_fields = exports.get_fields = void 0;
var fields_dictionary = {
    continents: ["id", "it_name", "en_name"],
    countries: ["id", "real_name", "it_name", "en_name", "iso_alpha_3", "fk_continent_id"],
    cities: ["id", "real_name", "it_name", "en_name", "rating", "fk_country_id"],
    languages: ["id", "name", "abbreviation"],
    users: ["firebase_id", "fk_language_id"],
    monuments: ["id", "real_name", "it_name", "en_name", "coordinates", "it_description", "en_description", "fk_city_id"],
    visits: ["id", "rating", "private_description", "date_time", "fk_user_id", "fk_monument_id"],
    types_of_monuments: ["id", "real_name", "it_name", "en_name", "it_description", "en_description", "period_start", "period_end"],
    monument_types: ["fk_monument_id", "fk_type_of_monument_id"]
};
function set_filter_by(filter_by) {
    if (Array.isArray(filter_by)) {
        return function (x) { return filter_by.includes(x); };
    }
    return filter_by;
}
function generate_placeholder_sequence(obj, gen_placeholder_seq) {
    if (gen_placeholder_seq === void 0) { gen_placeholder_seq = 1; }
    if (gen_placeholder_seq === false)
        return "";
    if (gen_placeholder_seq < 1)
        throw new Error("gen_placeholder_seq must be greater than 1");
    var i = (typeof gen_placeholder_seq === "number") ? gen_placeholder_seq : 1;
    return obj.map(function (_) { return "$".concat(i++); }).join(", ");
}
function get_fields(type, filter_by, gen_placeholder_seq, no_id) {
    if (gen_placeholder_seq === void 0) { gen_placeholder_seq = 1; }
    if (no_id === void 0) { no_id = false; }
    var fields = fields_dictionary[type];
    if (filter_by) {
        filter_by = set_filter_by(filter_by);
        fields = fields.filter(function (x) { return !(x === "id" && no_id); }).filter(filter_by);
    }
    return [fields, generate_placeholder_sequence(fields, gen_placeholder_seq)];
}
exports.get_fields = get_fields;
var extract_values_of_fields = function (body, fields) {
    return fields.map(function (field) { return body[field]; });
}; //Gets the values 
exports.extract_values_of_fields = extract_values_of_fields;
function is_countries_body(obj) {
    return typeof obj.real_name === "string" &&
        obj.real_name.length <= 50 &&
        (!obj.it_name || (typeof obj.it_name === "string" && obj.it_name.length <= 50)) &&
        (!obj.en_name || (typeof obj.en_name === "string" && obj.en_name.length <= 50)) &&
        typeof obj.iso_alpha_3 === "string" &&
        obj.iso_alpha_3.length === 3 &&
        typeof obj.fk_continent_id === "number";
}
exports.is_countries_body = is_countries_body;
function is_cities_body(obj) {
    return typeof obj.real_name === "string" &&
        obj.real_name.length <= 50 &&
        (!obj.it_name || (typeof obj.it_name === "string" && obj.it_name.length <= 50)) &&
        (!obj.en_name || (typeof obj.en_name === "string" && obj.en_name.length <= 50)) &&
        (!obj.rating || (typeof obj.rating === "number" && obj.rating >= 0 && obj.rating <= 5)) &&
        typeof obj.fk_country_id === "number";
}
exports.is_cities_body = is_cities_body;
function is_languages_body(obj) {
    return typeof obj.name === "string" &&
        obj.name.length <= 50 &&
        typeof obj.abbreviation === "string" &&
        obj.abbreviation.length === 2;
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
        (!obj.it_name || (typeof obj.it_name === "string" && obj.it_name.length <= 50)) &&
        (!obj.en_name || (typeof obj.en_name === "string" && obj.en_name.length <= 50)) &&
        typeof obj.coordinates === "string" &&
        (!obj.it_description || (typeof obj.it_description === "string" && obj.it_description.length <= 50)) &&
        (!obj.en_description || (typeof obj.en_description === "string" && obj.en_description.length <= 50)) &&
        typeof obj.fk_city_id === "number";
}
exports.is_monuments_body = is_monuments_body;
function is_visits_body(obj) {
    return typeof obj.rating === "number" &&
        obj.rating >= 0 && obj.rating <= 5 &&
        (!obj.private_description || typeof obj.private_description === "string") &&
        typeof obj.date_time === "string" &&
        typeof obj.fk_user_id === "number" &&
        typeof obj.fk_monument_id === "number";
}
exports.is_visits_body = is_visits_body;
function is_types_of_monuments_body(obj) {
    return typeof obj.real_name === "string" &&
        obj.real_name.length <= 50 &&
        (!obj.it_name || (typeof obj.it_name === "string" && obj.it_name.length <= 50)) &&
        (!obj.en_name || (typeof obj.en_name === "string" && obj.en_name.length <= 50)) &&
        (!obj.it_description || (typeof obj.it_description === "string" && obj.it_description.length <= 50)) &&
        (!obj.en_description || (typeof obj.en_description === "string" && obj.en_description.length <= 50)) &&
        typeof obj.period_start === "string" &&
        typeof obj.period_end === "string";
}
exports.is_types_of_monuments_body = is_types_of_monuments_body;
function is_monument_types_body(obj) {
    return typeof obj.fk_monument_id === "number" &&
        typeof obj.fk_type_of_monument_id === "number";
}
exports.is_monument_types_body = is_monument_types_body;
