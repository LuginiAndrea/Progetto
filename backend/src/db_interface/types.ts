type countries_body = {
    real_name: string;
    it_name: string;
    en_name: string;
    iso_alpha_3: string;
    fk_continent_id: number;
}
function is_countries_body(obj: any): obj is countries_body {
    return typeof obj.real_name === "string" &&
        typeof obj.it_name === "string" &&
        typeof obj.en_name === "string" &&
        typeof obj.iso_alpha_3 === "string" &&
        typeof obj.fk_continent_id === "number";
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
        typeof obj.it_name === "string" &&
        typeof obj.en_name === "string" &&
        typeof obj.rating === "number" &&
        typeof obj.fk_country_id === "number";
}



export { countries_body, cities_body, is_countries_body, is_cities_body };