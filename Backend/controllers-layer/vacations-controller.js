const express = require("express");
const vacationLogic = require("../business-logic-layer/vacations-logic");
const VacationModel = require("../models/VacationModel");
const router = express.Router();
const logHelper = require("../helpers/log-helper");
const expressFileUpload = require("express-fileupload");
const path = require("path");
const fs = require('fs');

const server = express();


server.use(expressFileUpload());


// GET all vacations
router.get("/", async (request, response) => {
    try {
        const vacations = await vacationLogic.getAllVacationsAsync();
        response.json(vacations);

    } catch (error) {
        response.status(500).send(error.message);
    }
});

// GET one vacation
router.get("/:vacationId", async (request, response) => {
    try {
        vacationId = +request.params.vacationId;
        const vacation = await vacationLogic.getOneVacationAsync(vacationId);
        response.json(vacation);

    } catch (error) {
        response.status(500).send(error.message);
    }
});

//POST new vacation
router.post("/", async (request, response) => {
    try {
        if (!request.files.image) {
            response.status(400).send("No image sent");
            return;
        }
        const newVacation = new VacationModel(request.body);
        const addedVacation = await vacationLogic.addVacationAsync(newVacation, request.files ? request.files.image : null);
        response.status(201).json(addedVacation);

    } catch (error) {
        response.status(500).send(error.message);
    }
});

// PUT http://localhost:3001/api/vacations/7
router.put("/:id", async (request, response) => {
    try {
        const vacationId = +request.params.id;
        request.body.vacationId = vacationId;

        // request.body.description = ".......";
        // request.body.destination = "Istanbul";
        // request.body.start = "2021-08-22";
        // request.body.end = "2021-08-22";
        // request.body.price = 3577;

        const vacationToUpdate = new VacationModel(request.body);
        const vacation = await vacationLogic.getOneVacationAsync(vacationId);
        currentImageName = vacation[0].picture
        // // Validation:
        // const errors = vacation.validatePut();
        // if(errors) {
        //     response.status(400).send(errors);
        //     return;
        // }

        // Logic: 
        const updatedVacation = await vacationLogic.updateFullVacationAsync(vacationToUpdate, request.files ? request.files.picture : null, currentImageName);
        if (!updatedVacation) {
            response.status(404).send(`id ${vacationId} not found`);
            return;
        }
        // Success: 
        response.json(updatedVacation);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});


// DELETE vacation
router.delete("/:vacationId", async (request, response) => {
    try {
        const vacationId = +request.params.vacationId;
        const vacation = await vacationLogic.getOneVacationAsync(vacationId);
        const currentImageName = vacation[0].picture;
        const success = await vacationLogic.deleteVacationAsync(vacationId, currentImageName);
        if (!success) {
            response.status(404).send(`id ${vacationId} not found`);
            return;
        }
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

// // PATCH partial vacation
// router.patch("/api/vacations/:vacationId", async (request, response) => {
//     try {
//         // Model:
//         const vacationId = +request.params.vacationId;
//         request.body.vacationId = vacationId;
//         const vacation = new VacationModel(request.body);
//         console.log("id in patch: " + vacation.vacationId)
//         // // Validation:
//         // const errors = product.validatePatch();
//         // if(errors) {
//         //     response.status(400).send(errors);
//         //     return;
//         // }

//         // Logic: 
//         const updatedVacation = await vacationLogic.updatePartialVacationAsync(vacation);
//         console.log(vacation)
//         if (!updatedVacation) {
//             response.status(404).send(`id ${id} not found`);
//             return;
//         }

//         // Success: 
//         response.json(updatedVacation);
//     }
//     catch (err) {
//         response.status(500).send(err.message);
//     }
// });

module.exports = router;