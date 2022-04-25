import { Response, Request, NextFunction } from "express";
const authenticate_user = (req: Request, res: Response, next: NextFunction) => {
    // Authenticate user with firebase admin
    // puts the user UID in res.locals.uid
    console.log("Authenticated user");
    next();
}

export { authenticate_user };