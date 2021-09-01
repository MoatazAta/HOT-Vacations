const jwt = require("jsonwebtoken");

function verifyLoggedIn(request, response, next) {

    if (!request.headers.authorization) {
        response.status(401).send("You are not logged in.");
        return;
    }

    // authorization --> "Bearer the-token"
    const token = request.headers.authorization.split(" ")[1];

    if (!token) {
        response.status(401).send("You are not logged in.");
        return;
    }

    // Here we have a "token" but we don't know yet if the token is valid.

    jwt.verify(token, global.config.jwtKey, (err, payload) => { // payload.user is the user object

        if (err && err.message === "jwt expired") {
            response.status(403).send("Your login session has expired.");
            return;
        }

        if (err) {
            response.status(401).send("You are not logged in.");
            return;
        }

        // response.headers.refreshToken = ...;

        next(); // All is good.

    });

}

module.exports = verifyLoggedIn;
