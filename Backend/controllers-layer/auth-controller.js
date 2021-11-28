const express = require("express");
const authLogic = require("../business-logic-layer/auth-logic");
const router = express.Router();
const errorsHelper = require("../helpers/errors-helper")
const CredentialsModel = require("../models/credentials-model");
const UserModel = require("../models/user-model");
const uuidValidateV4 = require("../middleware/check-uuid");
const verifyLoggedIn = require("../middleware/verify-logged-in");

router.post("/login", async (request, response) => {
    try {
        const credentials = new CredentialsModel(request.body);

        const errors = credentials.validateLogin();
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
        if (!isUsernameTaken) return response.status(400).send(`Username "${user.username}" already taken.`);

        const addedUser = await authLogic.registerAsync(userToAdd);
        console.log(addedUser); 

        response.status(201).json(addedUser)
    } catch (err) {
        response.status(500).send(err.message);    
    }
});

// GET user by id */api/auth/get-user/:uuid
router.get("/get-user/:uuid", verifyLoggedIn, uuidValidateV4, async (request, response) => {
    try {
        const userId = request.params.uuid;

        const user = await authLogic.getUserById(userId);
        if (!user) return response.status(400).send("User with this id was not found.");
        response.json(user);
    }
    catch (error) {
        errorsHelper.internalServerError(response, error);
    }
});

module.exports = router;