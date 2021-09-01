const express = require("express");
const authLogic = require("../business-logic-layer/auth-logic");
const router = express.Router();
const errorsHelper = require("../helpers/errors-helper")

router.post("/login", async (request, response) => {
    try {
        const loggedInUser = await authLogic.loginAsync(request.body);
        if (!loggedInUser) return response.status(401).send("Incorrect username or password.");
        response.json(loggedInUser);
    } catch (err) {
        errorsHelper.internalServerError(response, err);
        // console.log(err.message)
    }
});

router.post("/register", async (request, response) => {
    try {
        const addedUser = await authLogic.registerAsync(request.body);
        response.status(201).json(addedUser)
    } catch (err) {
        errorsHelper.internalServerError(response, err);
    }
});

module.exports = router;