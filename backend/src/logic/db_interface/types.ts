function get_continents_fields(filter_by?: (x: string) => boolean): string[] {
    const fields = ["id", "it_name", "en_name"];
    if(filter_by) 
        return fields.filter(filter_by);
    return fields;
}

type countries_body = {
    real_name: string;
    it_name: string;
    en_name: string;
    iso_alpha_3: string;
    fk_continent_id: number;
}
function is_countries_body(obj: any): obj is countries_body {
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
function get_countries_fields(filter_by?: (x: string) => boolean): string[] {
    const fields = ["id", "real_name", "it_name", "en_name", "iso_alpha_3", "fk_continent_id"]
    if(filter_by)
        return fields.filter(filter_by);
    return fields;
}

type cities_body = {
    real_name: string,
    it_name: string,
    en_name: string,
    rating: number, 
    fk_country_id: number
}
function is_cities_body(obj: any): obj is cities_body {
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
function get_cities_fields(filter_by?: (x: string) => boolean): string[] {
    const fields = ["id", "real_name", "it_name", "en_name", "rating", "fk_country_id"];
    if(filter_by)
        return fields.filter(filter_by);
    return fields;
}

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
function get_languages_fields(filter_by?: (x: string) => boolean): string[] {
    const fields = ["id", "name", "abbreviation"];
    if(filter_by)
        return fields.filter(filter_by);
    return fields;
}

type users_body = {
    firebase_id: string,
    fk_language_id: number
}
function is_users_body(obj: any): obj is users_body {
    return typeof obj.firebase_id === "string" &&
        typeof obj.fk_language_id === "number";
}
function get_users_fields(filter_by?: (x: string) => boolean): string[] {
    const fields = ["firebase_id", "fk_language_id"];
    if(filter_by)
        return fields.filter(filter_by);
    return fields;
}

type monuments_body = {
    real_name: string,
    it_name: string,
    en_name: string,
    coordinates: string,
    it_description: string,
    en_description: string,
    fk_city_id: number
}
function is_monuments_body(obj: any): obj is monuments_body {
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
function get_monuments_fields(filter_by?: (x: string) => boolean): string[] {
    const fields = ["id", "real_name", "it_name", "en_name", "coordinates", "it_description", "en_description", "fk_city_id"];
    if(filter_by)
        return fields.filter(filter_by);
    return fields;
}

type visits_body = {
    rating: number,
    private_description: string,
    date_time: string,
    fk_user_id: number,
    fk_monument_id: number
}
function is_visits_body(obj: any): obj is visits_body {
    return typeof obj.rating === "number" &&
        obj.rating >= 0 && obj.rating <= 5 &&
        typeof obj.private_description === "string" &&
        typeof obj.date_time === "string" &&
        typeof obj.fk_user_id === "number" &&
        typeof obj.fk_monument_id === "number";
}
function get_visits_fields(filter_by?: (x: string) => boolean): string[] {
    const fields = ["id", "rating", "private_description", "date_time", "fk_user_id", "fk_monument_id"];
    if(filter_by)
        return fields.filter(filter_by);
    return fields;
}

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
        typeof obj.it_name === "string" &&
        obj.it_name.length <= 50 &&
        typeof obj.en_name === "string" &&
        obj.en_name.length <= 50 &&
        typeof obj.it_description === "string" &&
        typeof obj.en_description === "string" &&
        typeof obj.period_start === "string" &&
        typeof obj.period_end === "string";
}
function get_types_of_monuments_fields(filter_by?: (x: string) => boolean): string[] {
    const fields = ["id", "real_name", "it_name", "en_name", "it_description", "en_description", "period_start", "period_end"];
    if(filter_by)
        return fields.filter(filter_by);
    return fields;
}

type monument_types_body = {
    fk_monument_id: number,
    fk_type_of_monument_id: number
}
function is_monument_types_body(obj: any): obj is monument_types_body {
    return typeof obj.fk_monument_id === "number" &&
        typeof obj.fk_type_of_monument_id === "number";
}
function get_monument_types_fields(filter_by?: (x: string) => boolean): string[] {
    const fields = ["fk_monument_id", "fk_type_of_monument_id"];
    if(filter_by)
        return fields.filter(filter_by);
    return fields;
}

export { 
    get_continents_fields,
    countries_body, is_countries_body, get_countries_fields,
    cities_body, is_cities_body, get_cities_fields,
    languages_body, is_languages_body, get_languages_fields,
    users_body, is_users_body, get_users_fields,
    monuments_body, is_monuments_body, get_monuments_fields,
    visits_body, is_visits_body, get_visits_fields,
    types_of_monuments_body, is_types_of_monuments_body, get_types_of_monuments_fields,
    monument_types_body, is_monument_types_body, get_monument_types_fields
};