const express = require("express");
const followersLogic = require("../business-logic-layer/followers-logic");
const VacationModel = require("../models/VacationModel");
const logHelper = require("../helpers/log-helper");
const errorsHelper = require("../helpers/errors-helper")

const router = express.Router();

router.get("/", async (request, response) => {
    try {
        const followers = await followersLogic.getFollowerDetailsAsync();
        response.json(followers);
    }
    catch (err) {
        errorsHelper.internalServerError(response, err);
    } 
});

router.get("/", async (request, response) => {
    try {
        const followers = await followersLogic.getNumberOfFollowersPerVacationAsync();
        response.json(followers);
    }
    catch (err) {
        errorsHelper.internalServerError(response, err);
    } 
});


