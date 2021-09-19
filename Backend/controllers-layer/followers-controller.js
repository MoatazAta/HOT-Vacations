const express = require("express");
const followersLogic = require("../business-logic-layer/followers-logic");
const VacationModel = require("../models/vacation-model");
const logHelper = require("../helpers/log-helper");
const errorsHelper = require("../helpers/errors-helper");

const router = express.Router();

// GET http://localhost:3001/api/followers
router.get("/", async (request, response) => {
    try {
        const followers = await followersLogic.getFollowingDetailsAsync();
        response.json(followers);
    }
    catch (err) {
        errorsHelper.internalServerError(response, err);
    }
});


// GET http://localhost:3001/api/followers/number-followers-per-vacation
router.get("/number-followers-per-vacation", async (request, response) => {
    try {
        const followers = await followersLogic.getNumberOfFollowersPerVacationAsync();
        response.json(followers);
    }
    catch (err) {
        errorsHelper.internalServerError(response, err);
    }
});


// GET http://localhost:3001/api/followers/per-user/:id
router.get("/per-user/:id", async (request, response) => {
    try {
        const userId = +request.params.id;
        const vacations = await followersLogic.getVacationsPerFollowerAsync(userId);
        response.json(vacations);
    }
    catch (err) {
        errorsHelper.internalServerError(response, err);
    }
});

// GET http://localhost:3001/api/per-vacation/:id
router.get("/per-vacation/:id", async (request, response) => {
    try {
        const vacationId = +request.params.id;
        const follower = await followersLogic.getUsersPerVacationFollowingAsync(vacationId);
        response.json(follower);
    }
    catch (err) {
        errorsHelper.internalServerError(response, err);
    }
});

// GET http://localhost:3001/api/followers/:uid/:vid
router.get("/:userId/:vacationId", async (request, response) => {
    try {
        const userId = +request.params.userId;
        const vacationId = +request.params.vacationId;
        const following = await followersLogic.getFollowingOnVacationAsync(userId, vacationId);
        response.json(following);
    }
    catch (err) {
        errorsHelper.internalServerError(response, err);
    }
});



// POST http://localhost:3001/api/followers/:uid/:vid
router.post("/:userId/:vacationId", async (request, response) => {
    try {
        const userId = +request.params.userId;
        const vacationId = +request.params.vacationId;
        const addedFollower = await followersLogic.addFollowingToVacationAsync(userId, vacationId);
        response.json(addedFollower);
    }
    catch (err) {
        errorsHelper.internalServerError(response, err);
    }
});

// DELETE http://localhost:3001/api/followers/:uid/:vid
router.delete("/:userId/:vacationId", async (request, response) => {
    try {
        const userId = +request.params.userId;
        const vacationId = +request.params.vacationId;
        await followersLogic.deleteFollowingFromVacationAsync(userId, vacationId);
        response.sendStatus(204);
    }
    catch (err) {
        errorsHelper.internalServerError(response, err);
    }
});

module.exports = router;