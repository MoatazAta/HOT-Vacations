import { io, Socket } from 'socket.io-client'; // npm i socket.io-client

class VacationsService {

    public socket: Socket;

    // public connect(): void {
    //     this.socket = io("http://localhost:3001");
    //     // this.socket.on("msg-from-server", msg => displayMessage(msg));
    // }

    // public disconnect(): void {
    //     this.socket.disconnect();
    // }
    public connect(): void {
        if(this.socket === undefined || !this.socket.connected){
            this.socket = io("http://localhost:3001");
        }

    }

    public disconnect(): void {
        if(!this.socket || this.socket.disconnect()) return;
        this.socket.disconnect();

    }

}

// const vacationsService = new VacationsService();

export default VacationsService;