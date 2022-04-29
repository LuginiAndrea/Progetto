var fields_dictionary = {
    "continents": ["id", "it_name", "en_name"],
    "countries": ["id", "real_name", "it_name", "en_name", "iso_alpha_3", "fk_continent_id"],
    "cities": ["id", "real_name", "it_name", "en_name", "rating", "fk_country_id"],
    "languages": ["id", "name", "abbreviation"],
    "users": ["firebase_id", "fk_language_id"],
    "monuments": ["id", "real_name", "it_name", "en_name", "coordinates", "it_description", "en_description", "fk_city_id"],
    "visits": ["id", "rating", "private_description", "date_time", "fk_user_id", "fk_monument_id"],
    "type_of_monuments": ["id", "real_name", "it_name", "en_name", "it_description", "en_description", "period_start", "period_end"],
    "monument_types": ["fk_monument_id", "fk_type_of_monument_id"]
};
function set_filter_by(filter_by) {
    if (Array.isArray(filter_by)) {
        return function (x) { return filter_by.includes(x); };
    }
    return filter_by;
}
function generate_placeholder_sequnce(obj) {
    var i = 0;
    return obj.map(function (_) { return "$".concat(++i); }).join(", ");
}
function get_fields(type, filter_by, gen_placeholder_seq) {
    if (gen_placeholder_seq === void 0) { gen_placeholder_seq = true; }
    var fields = fields_dictionary[type];
    if (filter_by) {
        filter_by = set_filter_by(filter_by);
        fields = fields.filter(filter_by);
    }
    var placeholder_sequence = (gen_placeholder_seq) ? generate_placeholder_sequnce(fields) : "";
    return [fields, placeholder_sequence];
}
var extract_fields = function (body, fields) { return fields.map(function (field) { return body[field]; }); };
// ***************** CONTINENTS *****************
function get_continents_fields(filter_by, gen_placeholder_seq) {
    if (gen_placeholder_seq === void 0) { gen_placeholder_seq = true; }
    return generic_get_fields(["id", "it_name", "en_name"], filter_by, gen_placeholder_seq);
}
function is_countries_body(obj) {
    return typeof obj.real_name === "string" &&
        obj.real_name.length <= 50 &&
        (!obj.it_name || (typeof obj.it_name === "string" && obj.it_name.length <= 50)) &&
        (!obj.en_name || (typeof obj.en_name === "string" && obj.en_name.length <= 50)) &&
        typeof obj.iso_alpha_3 === "string" &&
        obj.iso_alpha_3.length === 3 &&
        typeof obj.fk_continent_id === "number";
}
function get_countries_fields(filter_by, gen_placeholder_seq) {
    if (gen_placeholder_seq === void 0) { gen_placeholder_seq = true; }
    return generic_get_fields(["id", "real_name", "it_name", "en_name", "iso_alpha_3", "fk_continent_id"], filter_by, gen_placeholder_seq);
}
var extract_fields = function (body, fields) { return generic_extract_fields(body, fields); };
function is_cities_body(obj) {
    return typeof obj.real_name === "string" &&
        obj.real_name.length <= 50 &&
        (!obj.it_name || (typeof obj.it_name === "string" && obj.it_name.length <= 50)) &&
        (!obj.en_name || (typeof obj.en_name === "string" && obj.en_name.length <= 50)) &&
        (!obj.rating || (typeof obj.rating === "number" && obj.rating >= 0 && obj.rating <= 5)) &&
        typeof obj.fk_country_id === "number";
    function is_languages_body(obj) {
        return typeof obj.name === "string" &&
            obj.name.length <= 50 &&
            typeof obj.abbreviation === "string" &&
            obj.abbreviation.length === 2;
    }
    function get_languages_fields(filter_by) {
        var fields = ["id", "name", "abbreviation"];
        if (filter_by) {
            filter_by = set_filter_by(filter_by);
            fields = fields.filter(filter_by);
        }
        return [fields, generate_placeholder_sequnce(fields)];
    }
    function extract_languages_fields(body, filter_by) {
        var fields = get_languages_fields(filter_by)[0];
        var result = [];
        for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) { //Need to convert to any in order to use string indexing
            var field = fields_1[_i];
            var field_value = body[field];
            result.push(field_value);
        }
        return result;
    }
    function is_users_body(obj) {
        return typeof obj.firebase_id === "string" &&
            typeof obj.fk_language_id === "number";
    }
    function get_users_fields(filter_by) {
        var fields = ["firebase_id", "fk_language_id"];
        if (filter_by) {
            filter_by = set_filter_by(filter_by);
            fields = fields.filter(filter_by);
        }
        return [fields, generate_placeholder_sequnce(fields)];
    }
    function extract_users_fields(body, filter_by) {
        var fields = get_users_fields(filter_by)[0];
        var result = [];
        for (var _i = 0, fields_2 = fields; _i < fields_2.length; _i++) { //Need to convert to any in order to use string indexing
            var field = fields_2[_i];
            var field_value = body[field];
            result.push(field_value);
        }
        return result;
    }
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
    function get_monuments_fields(filter_by) {
        var fields = ["id", "real_name", "it_name", "en_name", "coordinates", "it_description", "en_description", "fk_city_id"];
        if (filter_by) {
            filter_by = set_filter_by(filter_by);
            fields = fields.filter(filter_by);
        }
        return [fields, generate_placeholder_sequnce(fields)];
    }
    function extract_monuments_fields(body, filter_by) {
        var fields = get_monuments_fields(filter_by)[0];
        var result = [];
        for (var _i = 0, fields_3 = fields; _i < fields_3.length; _i++) { //Need to convert to any in order to use string indexing
            var field = fields_3[_i];
            var field_value = body[field];
            result.push(field_value);
        }
        return result;
    }
    function is_visits_body(obj) {
        return typeof obj.rating === "number" &&
            obj.rating >= 0 && obj.rating <= 5 &&
            (!obj.private_description || typeof obj.private_description === "string") &&
            typeof obj.date_time === "string" &&
            typeof obj.fk_user_id === "number" &&
            typeof obj.fk_monument_id === "number";
    }
    function get_visits_fields(filter_by) {
        var fields = ["id", "rating", "private_description", "date_time", "fk_user_id", "fk_monument_id"];
        if (filter_by) {
            filter_by = set_filter_by(filter_by);
            fields = fields.filter(filter_by);
        }
        return [fields, generate_placeholder_sequnce(fields)];
    }
    function extract_visits_fields(body, filter_by) {
        var fields = get_visits_fields(filter_by)[0];
        var result = [];
        for (var _i = 0, fields_4 = fields; _i < fields_4.length; _i++) { //Need to convert to any in order to use string indexing
            var field = fields_4[_i];
            var field_value = body[field];
            result.push(field_value);
        }
        return result;
    }
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
    function get_types_of_monuments_fields(filter_by) {
        var fields = ["id", "real_name", "it_name", "en_name", "it_description", "en_description", "period_start", "period_end"];
        if (filter_by) {
            filter_by = set_filter_by(filter_by);
            fields = fields.filter(filter_by);
        }
        return [fields, generate_placeholder_sequnce(fields)];
    }
    function extract_types_of_monuments_fields(body, filter_by) {
        var fields = get_types_of_monuments_fields(filter_by)[0];
        var result = [];
        for (var _i = 0, fields_5 = fields; _i < fields_5.length; _i++) { //Need to convert to any in order to use string indexing
            var field = fields_5[_i];
            var field_value = body[field];
            result.push(field_value);
        }
        return result;
    }
    function is_monument_types_body(obj) {
        return typeof obj.fk_monument_id === "number" &&
            typeof obj.fk_type_of_monument_id === "number";
    }
    function get_monument_types_fields(filter_by) {
        var fields = ["fk_monument_id", "fk_type_of_monument_id"];
        if (filter_by) {
            filter_by = set_filter_by(filter_by);
            fields = fields.filter(filter_by);
        }
        return [fields, generate_placeholder_sequnce(fields)];
    }
    function extract_monument_types_fields(body, filter_by) {
        var fields = get_monument_types_fields(filter_by)[0];
        var result = [];
        for (var _i = 0, fields_6 = fields; _i < fields_6.length; _i++) { //Need to convert to any in order to use string indexing
            var field = fields_6[_i];
            var field_value = body[field];
            result.push(field_value);
        }
        return result;
    }
    export { get_continents_fields, countries_body, is_countries_body, get_countries_fields, extract_countries_fields, cities_body, is_cities_body, get_cities_fields, extract_cities_fields, languages_body, is_languages_body, get_languages_fields, extract_languages_fields, users_body, is_users_body, get_users_fields, extract_users_fields, monuments_body, is_monuments_body, get_monuments_fields, extract_monuments_fields, visits_body, is_visits_body, get_visits_fields, extract_visits_fields, types_of_monuments_body, is_types_of_monuments_body, get_types_of_monuments_fields, extract_types_of_monuments_fields, monument_types_body, is_monument_types_body, get_monument_types_fields, extract_monument_types_fields };
}
