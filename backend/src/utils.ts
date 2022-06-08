
import { Response } from "express";
import { DB_result, QueryResult } from "./logic/db_interface/DB_interface";
import { error_codes_to_status_code } from "./logic/tables/utils";

type func = (arg: Array<QueryResult<any>>) => Object;
type optional_args = {
    success?: number,
    error?: number,
};

function send_json(res: Response, result: DB_result | string | DB_result[], args?: optional_args) {
    let {success, error} = args || {};
    if(typeof result === "string") {
        const destructured_error = result.split("_");
        const status = error || error_codes_to_status_code(destructured_error);
        res.status(status).send({error:destructured_error[destructured_error.length - 1]});
    }
    else 
        res.status(success|| 200).send(result);
}

export {send_json, optional_args};