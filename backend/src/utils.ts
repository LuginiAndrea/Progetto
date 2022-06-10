
import { Response } from "express";
import { DB_result, QueryResult } from "./logic/db_interface/DB_interface";
import { error_codes_to_status_code } from "./logic/tables/utils";

type func = (arg: Array<QueryResult<any>>) => Object;
type optional_args = {
    success?: number,
    error?: number,
};

function send_json(res: Response, result: DB_result | DB_result[], args?: optional_args) {
    let {success, error} = args || {};
    let status = {
        code: 200,
        error_found: false
    };
    let to_send: Array<any> = [];
    if(!(Array.isArray(result) && (Array.isArray(result[0]) || typeof result[0] === "string"))) //In this case it is DB_result[]
        result = [result as DB_result];
    for(const single of result as DB_result[]) {
        if(typeof single === "string") {
            const destructured_error = single.split("_");
            const code = error || error_codes_to_status_code(destructured_error);
            status.error_found = true;
            status.code = code;
            to_send.push({code: code, error:destructured_error[destructured_error.length - 1]});
        }
        else {
            status.code = !status.error_found ? success || 200 : status.code;
            const mapped = single.map(s => s.rows);
            to_send.push(mapped);
        }
    }
    res.status(status.code).json(to_send);
}

export {send_json, optional_args};