const io = require('socket.io');

function init(listener) {

    const socketManager = io(listener, { cors: { origin: "http://localhost:3000" } });

    socketManager.sockets.on("connection", socket => {
        console.log("A client has been connected.");
        console.log(socket.id);

        socket.on("add-new-vacation", vacation => {
            console.log("added new vacation");
            // broadcast to everyone except yourself  
            socket.broadcast.emit("vacation-added", vacation);
        });

        socket.on("delete-vacation", (vacationId) => {
            console.log("vacation deleted");
            // broadcast to everyone except yourself  
            socket.broadcast.emit("vacation-deleted", vacationId);
        });
        
        socket.on("update-vacation", (vacation) => {
            console.log("vacation updated");
            // broadcast to everyone except yourself  
            socket.broadcast.emit("vacation-updated", vacation);
        });

        socket.on("disconnect", () => {
            console.log("A client has been disconnected");
        });
    });

}
module.exports = {
    init
}