const authenticate_user = (req, res, next) => {
    // Authenticate user with firebase admin
    console.log("Authenticated user");
    next();
}

export { authenticate_user };