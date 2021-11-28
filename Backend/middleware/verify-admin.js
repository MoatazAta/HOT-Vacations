const jwt = require("jsonwebtoken");

function verifyAdmin(request, response, next) {
    if (!request.headers.authorization) {
        response.status(401).send("You are not logged in.");
        return;
    }

    const token = request.headers.authorization.split(" ")[1];

    jwt.verify(token, global.config.jwtKey , (err, payload) => { // payload.user is the user object

        const { user } = payload;
        if (user.isAdmin) {
            next(); // All is good.
        } else {
            return response.status(403).send("You are not authorized to use this service!")
        }

    });
}
module.exports = verifyAdmin;