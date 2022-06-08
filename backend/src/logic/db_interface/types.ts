const fields_dictionary = { //List of all the tables with all the fields in them
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
type accepted_get_types = keyof typeof fields_dictionary;
type accepted_extract_types = 
    countries_body | cities_body | languages_body |
    users_body | monuments_body | visits_body | 
    monument_types_body | types_of_monuments_body | test_body;
    
type filter = ((x: string) => boolean) | string[];
function set_filter_by(filter_by: filter) { //If filter_by is an array
    return Array.isArray(filter_by) ?   //convert it into a function that checks 
        (x: string) => filter_by.includes(x) : //wheter an element is present in
        filter_by;                              //the array
}
// Generate the placeholder sequence for the database ($1, $2, $3, ...)
function generate_placeholder_sequence(obj: string[], gen_placeholder_seq: number = 1): string {
    if(gen_placeholder_seq < 1) throw new Error("gen_placeholder_seq must be greater than 1");
    return obj.map(_ => `$${gen_placeholder_seq++}`).join(", ");
}

function get_fields(table_name: accepted_get_types, alias : string | false = table_name, filter_by?: filter, gen_placeholder_seq: number | false = 1, no_id = false) {
    let fields = fields_dictionary[table_name];
    if(filter_by) {
        filter_by = set_filter_by(filter_by);
        fields = fields.filter(x => !(x === "id" && no_id)).filter(filter_by); //remove id if no_id is true
    }
    fields = alias ? //Put an alias name on the fields if the alias is not false
        fields.map(field => `${table_name}.${field} ${`AS ${alias}_${field}`}`) :
        fields;
    return {
        fields: fields,  //Gen the placeholder sequence if requested
        placeholder_seq: gen_placeholder_seq === false ? "" : generate_placeholder_sequence(fields, gen_placeholder_seq)
    };
}
const extract_values_of_fields = (body: accepted_extract_types, fields: string[]): any[] => //Generate an array with the values of the fields
    fields.map(field => (body as any)[field]); //Gets the values 

// ***************** COUNTRIES *****************
type countries_body = {
    real_name: string;
    it_name?: string;
    en_name?: string;
    iso_alpha_3: string;
    fk_continent_id: number;
}
function is_countries_body(obj: any, is_update: boolean = false): obj is countries_body {
    return ((!obj.real_name && is_update) || (typeof obj.real_name === "string" && obj.real_name.length <= 50)) &&
        (!obj.it_name || (typeof obj.it_name === "string" && obj.it_name.length <= 50)) &&
        (!obj.en_name || (typeof obj.en_name === "string" && obj.en_name.length <= 50)) &&
        ((!obj.iso_alpha_3 && is_update) || (typeof obj.iso_alpha_3 === "string" && obj.iso_alpha_3.length === 3)) &&
        ((!obj.fk_continent_id && is_update) || typeof obj.fk_continent_id === "number");
}
// ***************** CITIES *****************
type cities_body = {
    real_name: string,
    it_name?: string,
    en_name?: string,
    number_of_votes?: number, 
    votes_sum?: number,
    fk_country_id: number
}
function is_cities_body(obj: any, is_update: boolean = false): obj is cities_body {
    return ((!obj.real_name && is_update) || (typeof obj.real_name === "string" && obj.real_name.length <= 50)) &&
        (!obj.it_name || (typeof obj.it_name === "string" && obj.it_name.length <= 50)) &&
        (!obj.en_name || (typeof obj.en_name === "string" && obj.en_name.length <= 50)) &&
        (!obj.number_of_votes || (typeof obj.rating === "number" && obj.number_of_votes >= 0)) &&
        (!obj.votes_sum || (typeof obj.votes_sum === "number" && obj.votes_sum >= 0)) &&
        ((!obj.fk_country_id && is_update) || typeof obj.fk_country_id === "number");
}
// ***************** LANGUAGES *****************
type languages_body = {
    name: string,
    abbreviation: string
}
function is_languages_body(obj: any, is_update: boolean = false): obj is languages_body {
    return ((!obj.name && is_update) || (typeof obj.name === "string" && obj.name.length <= 50)) &&
        ((!obj.abbreviation && is_update) || (typeof obj.abbreviation === "string" && obj.abbreviation.length === 2));
}
// ***************** USERS *****************
type users_body = {
    id: number,
    fk_language_id: number
}
function is_users_body(obj: any, is_update: boolean = false): obj is users_body {
    return ((!obj.id && is_update) || typeof obj.id === "number") &&
        ((!obj.fk_language_id && is_update) || (typeof obj.fk_language_id === "number"));
}
// ***************** MONUMENTS *****************
type monuments_body = {
    real_name: string,
    it_name?: string,
    en_name?: string,
    coordinates: string,
    number_of_votes?: number,
    votes_sum?: number,
    it_description?: string,
    en_description?: string,
    fk_city_id: number
}
function is_monuments_body(obj: any, is_update: boolean = false): obj is monuments_body {
    return ((!obj.real_name && is_update) || (typeof obj.real_name === "string" && obj.real_name.length <= 50)) &&
        (!obj.it_name || (typeof obj.it_name === "string" && obj.it_name.length <= 50)) &&
        (!obj.en_name || (typeof obj.en_name === "string" && obj.en_name.length <= 50)) &&
        ((!obj.coordinates && is_update) || typeof obj.coordinates === "string") &&
        (!obj.it_description || typeof obj.it_description === "string") &&
        (!obj.en_description || typeof obj.en_description === "string") &&
        (!obj.number_of_votes || (typeof obj.rating === "number" && obj.number_of_votes >= 0)) &&
        (!obj.votes_sum || (typeof obj.votes_sum === "number" && obj.votes_sum >= 0)) &&
        ((!obj.fk_city_id && is_update) || typeof obj.fk_city_id === "number");
}
// ***************** VISITS *****************
type visits_body = {
    rating: number,
    private_description?: string,
    date_time: string,
    fk_monument_id: number
}
function is_visits_body(obj: any, is_update: boolean = false): obj is visits_body {
    return ((!obj.rating && is_update) || (typeof obj.rating === "number" && obj.rating >= 0 && obj.rating <= 5)) &&
        (!obj.private_description || typeof obj.private_description === "string") &&
        ((!obj.date_time && is_update) || typeof obj.date_time === "string") &&
        ((!obj.fk_monument_id && is_update) || typeof obj.fk_monument_id === "number");
}
// ***************** TYPES OF MONUMENTS *****************
type types_of_monuments_body = {
    real_name: string,
    it_name?: string,
    en_name?: string,
    it_description?: string,
    en_description?: string,
}
function is_types_of_monuments_body(obj: any, is_update : boolean = false): obj is types_of_monuments_body {
    return ((!obj.real_name && is_update) || (typeof obj.real_name === "string" && obj.real_name.length <= 50)) &&
        (!obj.it_name || (typeof obj.it_name === "string" && obj.it_name.length <= 50)) &&
        (!obj.en_name || (typeof obj.en_name === "string" && obj.en_name.length <= 50)) &&
        (!obj.it_description || typeof obj.it_description === "string") &&
        (!obj.en_description || typeof obj.en_description === "string");
}
// ***************** MONUMENT TYPES *****************
type monument_types_body = {
    fk_monument_id: number,
    fk_type_id: number
}
function is_monument_types_body(obj: any, is_update : boolean = false): obj is monument_types_body {
    return ((!obj.fk_monument_id && is_update) || typeof obj.fk_monument_id === "number") &&
        ((!obj.fk_type_id && is_update) || typeof obj.fk_type_id === "number");
}
// ***************** TEST TYPES (Disable in prod) *****************
type test_body = {
    name: string,
    number: number,
}
function is_test(obj: any, is_update : boolean = false): obj is test_body {
    return ((!obj.name && is_update) || typeof obj.name === "string" && obj.name.length <= 50) &&
        ((!obj.number && is_update) || typeof obj.number === "number");
}

const body_validators = {
    countries: is_countries_body,
    cities: is_cities_body,
    languages: is_languages_body,
    users: is_users_body,
    monuments: is_monuments_body,
    visits: is_visits_body,
    types_of_monuments: is_types_of_monuments_body,
    monument_types: is_monument_types_body, 
    test: is_test, //Disable test in production
};

const exclude_fields_by_language = { //Removes all the fields that are not needed for the language
    continents: (language: string, prefix = "continents") => get_fields("continents", prefix, 
        x => x.startsWith("real_") || !(x.endsWith("_name") && !x.startsWith(language)),
        false
    ),
    countries: (language: string, prefix = "countries") => get_fields("countries", prefix,
        x => x.startsWith("real_") || !(x.endsWith("_name") && !x.startsWith(language)),
        false
    ),
    cities: (language: string, prefix = "cities") => get_fields("cities", prefix,
        x => x.startsWith("real_") || !(x.endsWith("_name") && !x.startsWith(language)),
        false
    ),
    monuments: (language: string, prefix = "monuments") => get_fields("monuments", prefix,
        x => x.startsWith("real_") || !((x.endsWith("_name") || x.endsWith("_description")) && !x.startsWith(language)),
        false
    ),
    types_of_monuments: (language: string, prefix = "types_of_monuments") => get_fields("types_of_monuments", prefix,
        x => x.startsWith("real_") || !((x.endsWith("_name") || x.endsWith("_description")) && !x.startsWith(language)),
        false
    )
};

export { 
    get_fields, extract_values_of_fields,
    body_validators, exclude_fields_by_language
};