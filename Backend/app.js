global.config = require("./config-dev.json");
const express = require("express");
const cors = require("cors");
const vacationController = require("./controllers-layer/vacations-controller");
const authController = require("./controllers-layer/auth-controller");
const expressFileUpload = require("express-fileupload");
const server = express();


server.use(expressFileUpload());

server.use(cors());
server.use(express.json());
server.use("/", vacationController);
server.use("/api/auth", authController);

server.listen(3001, () => console.log("Listening..."));

