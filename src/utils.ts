
import { Response, Request, NextFunction } from "express";
import { DB_result } from "./logic/db_interface/DB_interface";
import { error_codes_to_status_code, error_codes } from "./logic/tables/utils";


type optional_args = {
    success?: number,
    error?: number,
};

async function send_json(res: Response, result: DB_result | DB_result[], args?: optional_args) {
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
            const [first, second, ...rest] = single.split("_");
            const destructured_error = [first, second, rest.join("_")];
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

async function validate_ids(req: Request, res: Response, next: NextFunction) {
    if(req.query.ids === undefined) 
        send_json(res, error_codes.INVALID_QUERY("ids")); 
    else {
        res.locals.ids = (req.query.ids as string).split(",") || [];
        if(res.locals.ids.length === 0) 
            send_json(res, error_codes.NO_REFERENCED_ITEM("ids"));
        else 
            next()
    }
}

async function validate_rating(req: Request, res: Response, next: NextFunction) { //Function to check if the parameters for comparing
    const operator = (req.query.operator as string).toUpperCase(); //rating are correct
    const rating = req.query.rating === "NULL" ?
        "NULL" :
        parseInt(req.query.rating as string)
    if(!operator || !rating)
        send_json(res, error_codes.INVALID_QUERY("Rating parameters"));

    const valid = (rating === "NULL" && ["IS", "IS NOT"].includes(operator)) || (["=", "!=", ">", "<", ">=", "<="].includes(operator) && rating >= 0 && rating <= 5);
    if(valid) {
        res.locals.rating = rating;
        res.locals.operator = operator;
        next();
    }
    else 
        send_json(res, error_codes.INVALID_QUERY("Rating parameters"))
}
    


export {send_json, optional_args, validate_ids, validate_rating};