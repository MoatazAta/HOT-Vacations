global.config = require(process.env.NODE_ENV === "production" ? "./config-prod.json" : "./config-dev.json");

// require('dotenv').config({ path: './.env' });

const express = require("express");
const cors = require("cors");
const server = express();
const expressFileUpload = require("express-fileupload");

//socket.io Logic
const vacationSocketLogic = require("./business-logic-layer/vacation-socket-logic");

//controllers
const vacationController = require("./controllers-layer/vacations-controller");
const authController = require("./controllers-layer/auth-controller");
const followersController = require("./controllers-layer/followers-controller");



server.use(cors());
server.use(express.json());
server.use(expressFileUpload());

server.use("/api/vacations", vacationController);
server.use("/api/auth", authController);
server.use("/api/followers", followersController);


server.use("*", (_, response) => {
    response.status(404).send(_.originalUrl + " route was not found");
});

const listener = server.listen(3001, () => console.log("Listening on 3001..."));

vacationSocketLogic.init(listener);