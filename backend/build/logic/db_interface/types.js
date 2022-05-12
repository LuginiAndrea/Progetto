"use strict";
exports.__esModule = true;
exports.exclude_fields_by_language = exports.body_validators = exports.extract_values_of_fields = exports.get_fields = void 0;
var fields_dictionary = {
    continents: ["id", "it_name", "en_name"],
    countries: ["id", "real_name", "it_name", "en_name", "iso_alpha_3", "fk_continent_id"],
    cities: ["id", "real_name", "it_name", "en_name", "number_of_votes", "votes_sum", "fk_country_id"],
    languages: ["id", "name", "abbreviation"],
    users: ["id", "fk_language_id"],
    monuments: ["id", "real_name", "it_name", "en_name", "coordinates", "it_description", "en_description", "number_of_votes", "votes_sum", "fk_city_id"],
    visits: ["id", "rating", "private_description", "date_time", "fk_user_id", "fk_monument_id"],
    types_of_monuments: ["id", "real_name", "it_name", "en_name", "it_description", "en_description"],
    monument_types: ["fk_monument_id", "fk_type_id"],
    test: ["id", "name", "number"]
};
function set_filter_by(filter_by) {
    return Array.isArray(filter_by) ?
        function (x) { return filter_by.includes(x); } :
        filter_by;
}
function generate_placeholder_sequence(obj, gen_placeholder_seq) {
    if (gen_placeholder_seq === void 0) { gen_placeholder_seq = 1; }
    if (gen_placeholder_seq === false)
        return "";
    if (gen_placeholder_seq < 1)
        throw new Error("gen_placeholder_seq must be greater than 1");
    var i = typeof gen_placeholder_seq === "number" ? gen_placeholder_seq : 1;
    return obj.map(function (_) { return "$".concat(i++); }).join(", ");
}
function get_fields(table_name, use_table_name, filter_by, gen_placeholder_seq, no_id) {
    if (use_table_name === void 0) { use_table_name = false; }
    if (gen_placeholder_seq === void 0) { gen_placeholder_seq = 1; }
    if (no_id === void 0) { no_id = false; }
    var fields = fields_dictionary[table_name];
    if (filter_by) {
        filter_by = set_filter_by(filter_by);
        fields = fields.filter(function (x) { return !(x === "id" && no_id); }).filter(filter_by);
    }
    fields = use_table_name ?
        fields.map(function (field) { return "".concat(table_name, ".").concat(field); }) :
        fields;
    return {
        fields: fields,
        placeholder_seq: generate_placeholder_sequence(fields, gen_placeholder_seq)
    };
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
function is_cities_body(obj) {
    return typeof obj.real_name === "string" &&
        obj.real_name.length <= 50 &&
        (!obj.it_name || (typeof obj.it_name === "string" && obj.it_name.length <= 50)) &&
        (!obj.en_name || (typeof obj.en_name === "string" && obj.en_name.length <= 50)) &&
        (!obj.number_of_votes || (typeof obj.rating === "number" && obj.number_of_votes >= 0)) &&
        (!obj.votes_sum || (typeof obj.votes_sum === "number" && obj.votes_sum >= 0)) &&
        typeof obj.fk_country_id === "number";
}
function is_languages_body(obj) {
    return typeof obj.name === "string" &&
        obj.name.length <= 50 &&
        typeof obj.abbreviation === "string" &&
        obj.abbreviation.length === 2;
}
function is_users_body(obj) {
    return typeof obj.id === "number" &&
        typeof obj.fk_language_id === "number";
}
function is_monuments_body(obj) {
    return typeof obj.real_name === "string" &&
        obj.real_name.length <= 50 &&
        (!obj.it_name || (typeof obj.it_name === "string" && obj.it_name.length <= 50)) &&
        (!obj.en_name || (typeof obj.en_name === "string" && obj.en_name.length <= 50)) &&
        typeof obj.coordinates === "string" &&
        (!obj.it_description || typeof obj.it_description === "string") &&
        (!obj.en_description || typeof obj.en_description === "string") &&
        (!obj.number_of_votes || (typeof obj.rating === "number" && obj.number_of_votes >= 0)) &&
        (!obj.votes_sum || (typeof obj.votes_sum === "number" && obj.votes_sum >= 0)) &&
        typeof obj.fk_city_id === "number";
}
function is_visits_body(obj) {
    return typeof obj.rating === "number" &&
        obj.rating >= 0 && obj.rating <= 5 &&
        (!obj.private_description || typeof obj.private_description === "string") &&
        typeof obj.date_time === "string" &&
        typeof obj.fk_user_id === "number" &&
        typeof obj.fk_monument_id === "number";
}
function is_types_of_monuments_body(obj) {
    return typeof obj.real_name === "string" &&
        obj.real_name.length <= 50 &&
        (!obj.it_name || (typeof obj.it_name === "string" && obj.it_name.length <= 50)) &&
        (!obj.en_name || (typeof obj.en_name === "string" && obj.en_name.length <= 50)) &&
        (!obj.it_description || typeof obj.it_description === "string") &&
        (!obj.en_description || typeof obj.en_description === "string");
}
function is_monument_types_body(obj) {
    return typeof obj.fk_monument_id === "number" &&
        typeof obj.fk_type_id === "number";
}
function is_test(obj) {
    return typeof obj.name === "string" && obj.name.length <= 50 &&
        typeof obj.number === "number";
}
var body_validators = {
    countries: is_countries_body,
    cities: is_cities_body,
    languages: is_languages_body,
    users: is_users_body,
    monuments: is_monuments_body,
    visits: is_visits_body,
    types_of_monuments: is_types_of_monuments_body,
    monument_types: is_monument_types_body,
    test: is_test
};
exports.body_validators = body_validators;
var exclude_fields_by_language = {
    continents: function (language) { return get_fields("continents", true, function (x) { return x.startsWith("real_") || !(x.endsWith("_name") && !x.startsWith(language)); }, false); },
    countries: function (language) { return get_fields("countries", true, function (x) { return x.startsWith("real_") || !(x.endsWith("_name") && !x.startsWith(language)); }, false); },
    cities: function (language) { return get_fields("cities", true, function (x) { return x.startsWith("real_") || !(x.endsWith("_name") && !x.startsWith(language)); }, false); },
    monuments: function (language) { return get_fields("monuments", true, function (x) { return x.startsWith("real_") || !((x.endsWith("_name") || x.endsWith("_description")) && !x.startsWith(language)); }, false); },
    types_of_monuments: function (language) { return get_fields("types_of_monuments", true, function (x) { return x.startsWith("real_") || !((x.endsWith("_name") || x.endsWith("_description")) && !x.startsWith(language)); }, false); }
};
exports.exclude_fields_by_language = exclude_fields_by_language;
