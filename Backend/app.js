global.config = require("./config-dev.json");
const express = require("express");
const cors = require("cors");
const vacationController = require("./controllers-layer/vacations-controller");
const authController = require("./controllers-layer/auth-controller");
const followersController = require("./controllers-layer/followers-controller");
const vacationSocketLogic = require("./business-logic-layer/vacation-socket-logic");
const expressFileUpload = require("express-fileupload");
const server = express();


server.use(expressFileUpload());

server.use(cors());
server.use(express.json());
server.use("/api/vacations", vacationController);
server.use("/api/auth", authController);
server.use("/api/followers", followersController);

const listener = server.listen(3001, () => console.log("Listening..."));

vacationSocketLogic.init(listener);