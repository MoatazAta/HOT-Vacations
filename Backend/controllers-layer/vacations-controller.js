const express = require("express");
const vacationLogic = require("../business-logic-layer/vacations-logic");
const VacationModel = require("../models/vacation-model");
const router = express.Router();
const logHelper = require("../helpers/log-helper");
const expressFileUpload = require("express-fileupload");
const path = require("path");
const fs = require('fs');
const verifyLoggedIn = require("../middleware/verify-logged-in");
const verifyAdmin = require("../middleware/verify-admin");
const uuidValidateV4 = require("../middleware/check-uuid");

const server = express();


server.use(expressFileUpload());


// GET all vacations
router.get("/", verifyLoggedIn, async (request, response) => {
    try {
        const vacations = await vacationLogic.getAllVacationsAsync();

        response.json(vacations);

    } catch (error) {
        response.status(500).send(error.message);
    }
});

// GET one vacation
router.get("/:uuid", verifyLoggedIn, uuidValidateV4, async (request, response) => {
    try {
        const vacationId = request.params.uuid;
        const vacation = await vacationLogic.getOneVacationAsync(vacationId);
        response.json(vacation);

    } catch (error) {
        response.status(500).send(error.message);
    }
});

//POST new vacation
router.post("/", [verifyLoggedIn, verifyAdmin], async (request, response) => {
    try {
        if (!request.files.image) {
            response.status(400).send("No image sent.");
            return;
        }

        const newVacation = new VacationModel(request.body);

        const errors = newVacation.validatePost();
        if (errors) return response.status(400).send(errors);

        const addedVacation = await vacationLogic.addVacationAsync(newVacation, request.files ? request.files.image : null);
        response.status(201).json(addedVacation);

    } catch (error) {
        response.status(500).send(error.message);
    }
});

// PUT http://localhost:3001/api/vacations/2
router.put("/:uuid", verifyLoggedIn, verifyAdmin, uuidValidateV4, async (request, response) => {
    try {
        request.body.vacationId = request.params.uuid;

        const vacationToUpdate = new VacationModel(request.body);

        const vacation = await vacationLogic.getOneVacationAsync(vacationToUpdate.vacationId);
        currentImageName = vacation[0].picture
 
        const errors = vacationToUpdate.validatePut();
        if (errors) return response.status(400).send(errors);


        const updatedVacation = await vacationLogic.updateFullVacationAsync(vacationToUpdate, request.files ? request.files.picture : null, currentImageName);
        if (!updatedVacation) {
            response.status(404).send(`vacation not found`);
            return;
        }

        response.json(updatedVacation);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

// PATCH a vacation : */api/vacations/:uuid
router.patch('/:uuid', verifyLoggedIn, verifyAdmin, uuidValidateV4, async (request, response) => {
    try {
        // model
        request.body.vacationId = request.params.uuid;
        const vacation = new VacationModel(request.body);

        // // validate
        // const errors = vacation.validatePatch();
        // if (errors) return response.status(400).send(errors);

        // logic
        const updatedVacation = await vacationLogic.updatePartialVacationAsync(vacation);
        if (!updatedVacation) return response.status(404).send("vacation with given id was not found.");

        // success
        response.json(updatedVacation);

    } catch (error) {
        errorsHelper.internalServerError(response, error);
    }
});

// DELETE vacation
router.delete("/:uuid", verifyLoggedIn, verifyAdmin, uuidValidateV4, async (request, response) => {
    try {
        const vacationId = request.params.uuid;
        const vacation = await vacationLogic.getOneVacationAsync(vacationId);
        const currentImageName = vacation[0].picture;
        const success = await vacationLogic.deleteVacationAsync(vacationId, currentImageName);
        if (!success) return response.status(404).send(`id ${vacationId} not found`);

        response.sendStatus(204);
    }
    catch (err) {
        logHelper.log("Failed to delete vacation", err);
        response.status(500).send(err.message);
    }
});


router.get("/images/:name", (request, response) => {
    try {
        const name = request.params.name;
        let fullPath = path.join(__dirname, "..", "images", name);
        if (!fs.existsSync(fullPath)) {
            fullPath = path.join(__dirname, "..", "images", "ImageNotFound.jpg");
        }
        response.sendFile(fullPath);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

module.exports = router;