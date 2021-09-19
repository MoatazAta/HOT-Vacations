const express = require("express");
const authLogic = require("../business-logic-layer/auth-logic");
const router = express.Router();
const errorsHelper = require("../helpers/errors-helper")
const CredentialsModel = require("../models/credentials-model");
const UserModel = require("../models/user-model");

router.post("/login", async (request, response) => {
    try {
        const credentials = new CredentialsModel(request.body);

        const errors = credentials.validatePost();
        if (errors) return response.status(400).send(errors);

        const loggedInUser = await authLogic.loginAsync(credentials);
        if (!loggedInUser) return response.status(401).send("Incorrect username or password!");

        response.json(loggedInUser);
    } catch (err) {
        errorsHelper.internalServerError(response, err);
    }
});

router.post("/register", async (request, response) => {
    try {
        const userToAdd = new UserModel(request.body);

        const errors = userToAdd.validatePost();
        if (errors) return response.status(400).send(errors);

        const isUsernameTaken = await authLogic.isUsernameTakenAsync(userToAdd.username);
        if (isUsernameTaken === null) return response.status(400).send("username already taken!");

        const addedUser = await authLogic.registerAsync(userToAdd);

        response.status(201).json(addedUser)
    } catch (err) {
        errorsHelper.internalServerError(response, err);
    }
});

module.exports = router;