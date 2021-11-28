const express = require("express");
const followersLogic = require("../business-logic-layer/followers-logic");
const VacationModel = require("../models/vacation-model");
const logHelper = require("../helpers/log-helper");
const errorsHelper = require("../helpers/errors-helper");
const uuidValidateV4 = require("../middleware/check-uuid");
const Follower = require("../models/follower-model");
const verifyLoggedIn = require("../middleware/verify-logged-in");

const router = express.Router(); 
 
//The user must be logged in.
router.use(verifyLoggedIn);


// GET http://localhost:3001/api/followers/number-followers-per-vacation
router.get("/all-followed-vacations", async (request, response) => {
    try {
        const followers = await followersLogic.getFollowersNumberAsync();
        response.json(followers);
    }
    catch (err) {
        errorsHelper.internalServerError(response, err);
    }
});


// GET all followed vacations by user id: */api/followers/by-user-id/:uuid
router.get('/by-user-id/:uuid', uuidValidateV4, async (request, response) => {
    try {
        // data
        const userId = request.params.uuid;

        // logic
        const vacations = await followersLogic.getFollowedVacationsByUserIdAsync(userId);

        // success
        response.json(vacations);
    } catch (error) {
        errorsHelper.internalServerError(response, error);
    }
});
 
// GET all following users by vacation id: */api/followers/by-vacation-id/:uuid
router.get('/by-vacation-id/:uuid', uuidValidateV4, async (request, response) => {
    try {
        // data
        const vacationId = request.params.uuid;

        // logic
        const users = await followersLogic.getFollowedVacationsByVacationIdAsync(vacationId);

        // success
        response.json(users);
    } catch (error) {
        errorsHelper.internalServerError(response, error);
    }
});

// GET http://localhost:3001/api/followers/:uid/:vid
router.get("/:userId/:vacationId", async (request, response) => {
    try {
        const userId = request.params.userId;
        const vacationId = request.params.vacationId;
        const following = await followersLogic.getFollowingOnVacationAsync(userId, vacationId);
        response.json(following);
    }
    catch (err) {
        errorsHelper.internalServerError(response, err);
    }
});



// POST http://localhost:3001/api/followers/:uid/:vid
router.post("/", async (request, response) => {
    try {
        const follower = new Follower(request.body);
        // validation
        const errors = follower.validate();
        if (errors) return response.status(400).send(errors);

        // logic
        const addedFollower = await followersLogic.addFollowingToVacationAsync(follower);
        if (!addedFollower) {
            return response.send(false);
        }

        //  success
        response.status(201).json(addedFollower);
    }
    catch (err) {
        errorsHelper.internalServerError(response, err);
    }
});

// DELETE http://localhost:3001/api/followers/:uid/:vid
router.delete("/:userId/:vacationId", async (request, response) => {
    try {
        // data
        const follower = new Follower(request.params);
        console.log(follower); 
        // validation
        const errors = follower.validate();
        if (errors) return response.status(400).send(errors);
 
        // logic
        const success = await followersLogic.deleteFollowingFromVacationAsync(follower);
        if (!success) return response.status(404).send("either the vacation id or the user id given were not found.");

        //success
        response.sendStatus(204);
    }
    catch (err) {
        errorsHelper.internalServerError(response, err);
    }
});

module.exports = router;