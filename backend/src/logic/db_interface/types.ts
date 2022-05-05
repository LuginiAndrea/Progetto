type filter = ((x: string) => boolean) | string[];
const fields_dictionary = {
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
type accepted_get_types = keyof typeof fields_dictionary;
type accepted_extract_types = 
    countries_body | cities_body | languages_body |
    users_body | monuments_body | visits_body | 
    monument_types_body | types_of_monuments_body;
    
function set_filter_by(filter_by: filter) {
    if(Array.isArray(filter_by)) {
        return (x: string) => filter_by.includes(x);
    }
    return filter_by;
}

function generate_placeholder_sequence(obj: string[], gen_placeholder_seq: number | boolean = 1): string {
    if(gen_placeholder_seq === false) return "";
    if(gen_placeholder_seq < 1) throw new Error("gen_placeholder_seq must be greater than 1");
    let i = (typeof gen_placeholder_seq === "number") ? gen_placeholder_seq : 1;
    return obj.map(_ => `$${i++}`).join(", ");
}

function get_fields(type: accepted_get_types, filter_by?: filter, gen_placeholder_seq: number | boolean = 1, no_id = false) : [string[], string] {
    let fields = fields_dictionary[type];
    if(filter_by) {
        filter_by = set_filter_by(filter_by);
        fields = fields.filter(x => !(x === "id" && no_id)).filter(filter_by);
    }
    return [fields, generate_placeholder_sequence(fields, gen_placeholder_seq)];
}
const extract_values_of_fields = (body: accepted_extract_types, fields: string[]): any => 
    fields.map(field => (body as any)[field]); //Gets the values 

// ***************** COUNTRIES *****************
type countries_body = {
    real_name: string;
    it_name?: string;
    en_name?: string;
    iso_alpha_3: string;
    fk_continent_id: number;
}
function is_countries_body(obj: any): obj is countries_body {
    return typeof obj.real_name === "string" &&
        obj.real_name.length <= 50 &&
        (!obj.it_name || (typeof obj.it_name === "string" && obj.it_name.length <= 50)) &&
        (!obj.en_name || (typeof obj.en_name === "string" && obj.en_name.length <= 50)) &&
        typeof obj.iso_alpha_3 === "string" &&
        obj.iso_alpha_3.length === 3 &&
        typeof obj.fk_continent_id === "number";
}
// ***************** CITIES *****************
type cities_body = {
    real_name: string,
    it_name?: string,
    en_name?: string,
    rating: number, 
    fk_country_id: number
}
function is_cities_body(obj: any): obj is cities_body {
    return typeof obj.real_name === "string" &&
        obj.real_name.length <= 50 &&
        (!obj.it_name || (typeof obj.it_name === "string" && obj.it_name.length <= 50)) &&
        (!obj.en_name || (typeof obj.en_name === "string" && obj.en_name.length <= 50)) &&
        (!obj.rating || (typeof obj.rating === "number" && obj.rating >= 0 && obj.rating <= 5)) &&
        typeof obj.fk_country_id === "number";
}
// ***************** LANGUAGES *****************
type languages_body = {
    name: string,
    abbreviation: string
}
function is_languages_body(obj: any): obj is languages_body {
    return typeof obj.name === "string" &&
        obj.name.length <= 50 &&
        typeof obj.abbreviation === "string" &&
        obj.abbreviation.length === 2;
}
// ***************** USERS *****************
type users_body = {
    firebase_id: string,
    fk_language_id: number
}
function is_users_body(obj: any): obj is users_body {
    return typeof obj.firebase_id === "string" &&
        typeof obj.fk_language_id === "number";
}
// ***************** MONUMENTS *****************
type monuments_body = {
    real_name: string,
    it_name?: string,
    en_name?: string,
    coordinates: string,
    it_description?: string,
    en_description?: string,
    fk_city_id: number
}
function is_monuments_body(obj: any): obj is monuments_body {
    return typeof obj.real_name === "string" &&
        obj.real_name.length <= 50 &&
        (!obj.it_name || (typeof obj.it_name === "string" && obj.it_name.length <= 50)) &&
        (!obj.en_name || (typeof obj.en_name === "string" && obj.en_name.length <= 50)) &&
        typeof obj.coordinates === "string" &&
        (!obj.it_description || (typeof obj.it_description === "string" && obj.it_description.length <= 50)) &&
        (!obj.en_description || (typeof obj.en_description === "string" && obj.en_description.length <= 50)) &&
        typeof obj.fk_city_id === "number";
}
// ***************** VISITS *****************
type visits_body = {
    rating: number,
    private_description?: string,
    date_time: string,
    fk_user_id: number,
    fk_monument_id: number
}
function is_visits_body(obj: any): obj is visits_body {
    return typeof obj.rating === "number" &&
        obj.rating >= 0 && obj.rating <= 5 &&
        (!obj.private_description || typeof obj.private_description === "string") &&
        typeof obj.date_time === "string" &&
        typeof obj.fk_user_id === "number" &&
        typeof obj.fk_monument_id === "number";
}
// ***************** TYPES OF MONUMENTS *****************
type types_of_monuments_body = {
    real_name: string,
    it_name: string,
    en_name: string,
    it_description: string,
    en_description: string,
    period_start: string,
    period_end: string
}
function is_types_of_monuments_body(obj: any): obj is types_of_monuments_body {
    return typeof obj.real_name === "string" &&
        obj.real_name.length <= 50 &&
        (!obj.it_name || (typeof obj.it_name === "string" && obj.it_name.length <= 50)) &&
        (!obj.en_name || (typeof obj.en_name === "string" && obj.en_name.length <= 50)) &&
        (!obj.it_description || (typeof obj.it_description === "string" && obj.it_description.length <= 50)) &&
        (!obj.en_description || (typeof obj.en_description === "string" && obj.en_description.length <= 50)) &&
        typeof obj.period_start === "string" &&
        typeof obj.period_end === "string";
}
// ***************** MONUMENT TYPES *****************
type monument_types_body = {
    fk_monument_id: number,
    fk_type_of_monument_id: number
}
function is_monument_types_body(obj: any): obj is monument_types_body {
    return typeof obj.fk_monument_id === "number" &&
        typeof obj.fk_type_of_monument_id === "number";
}

export { 
    get_fields, extract_values_of_fields,
    countries_body, is_countries_body, 
    cities_body, is_cities_body, 
    languages_body, is_languages_body,
    users_body, is_users_body,
    monuments_body, is_monuments_body,
    visits_body, is_visits_body,
    types_of_monuments_body, is_types_of_monuments_body,
    monument_types_body, is_monument_types_body
};