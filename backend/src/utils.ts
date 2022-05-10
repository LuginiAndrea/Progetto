
import { Response } from "express";
import { DB_result, QueryResult } from "./logic/db_interface/DB_interface";
import { error_codes_to_status_code } from "./logic/tables/utils";

type func = (arg: Array<QueryResult<any>>) => Object;
type optional_args = {
    success?: number,
    error?: number,
    processing_func?: func
};

function send_json(res: Response, result: DB_result | string, args?: optional_args) {
    let {success, error, processing_func} = args || {};
    if(typeof result === "string")
        result = {
            error: result
        };

    if (result.result) {
        res.status(success|| 200).send(processing_func ?
            processing_func(result.result) : 
            result.result.map(res => res.rows)
        );
    }
    else {
        const status = error || error_codes_to_status_code(result.error || "");
        res.status(status).send({error: result.error});
    }
}

export {send_json, optional_args};