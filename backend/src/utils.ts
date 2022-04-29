
import {Response} from "express";
import {DB_result, QueryResult} from "./logic/db_interface/DB_interface";

const error_to_statusCode = (error_code: string): number => {
    if(error_code.startsWith("i")) return 500;
    if(error_code === "Unauthorized") return 401;
    if(error_code === "23505") return 409;
    return 400;
}

type func = (arg: Array<QueryResult<any>>) => Object;
type statusCode = {
    success?: number,
    error?: number
};
type optional_args = {
    statusCode?: statusCode,
    processing_func?: func
};

function send_json(res: Response, result: DB_result | string, args?: optional_args) {
    let {statusCode, processing_func} = args || {};
    if(typeof result === "string")
        result = {
            error: result
        } as DB_result;

    if (result.result) {
        if(processing_func === undefined) processing_func = (result) => { return result[0].rows; };
        res.status(statusCode?.success|| 200).send(processing_func(result.result));
    }
    else {
        const status = statusCode?.error || error_to_statusCode(result.error as string);
        res.status(status).send({error: result.error});
    }
}

export {send_json, optional_args};