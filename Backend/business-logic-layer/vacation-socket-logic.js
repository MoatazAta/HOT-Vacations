const io = require("socket.io");

function init(listener) {

    const socketsManager = io(listener, { cors: { origin: "http://localhost:3000" } }); // Allow react front

    socketsManager.sockets.on("connection", socket => {

        console.log("A client has been connected.");

        socket.on("added-vacation-from-client", addedVacation => {
            socketsManager.sockets.emit("added-vacation-from-server", addedVacation);
        });

        socket.on("updated-vacation-from-client", updatedVacation => {
            socketsManager.sockets.emit("updated-vacation-from-server", updatedVacation);
        });

        socket.on("deleted-vacation-from-client", deletedVacation => {
            socketsManager.sockets.emit("deleted-vacation-from-server", deletedVacation);
        }); 

        socket.on("disconnect", () => {
            console.log("A client has been disconnected");
        });

    });

}

module.exports = {
    init
}