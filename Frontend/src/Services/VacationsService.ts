import { io, Socket } from 'socket.io-client'; // npm i socket.io-client
import VacationModel from '../Models/VacationModel';

class VacationsService {

    public socket: Socket;

    public connect(): void {

        if (this.socket === undefined || !this.socket.connected) {
            this.socket = io("http://localhost:3001");
        }
    }

    public edit(updatedVacation: VacationModel) {
        this.socket.emit("updated-vacation-from-client", updatedVacation);
    } 

    public add(addedVacation: VacationModel) {
        this.socket.emit("added-vacation-from-client", addedVacation);
    }

    public delete(vacationId: number) {
        this.socket.emit("deleted-vacation-from-client", vacationId);
    }

    public disconnect(): void {
        if (!this.socket || this.socket.disconnect()) return;
        this.socket.disconnect();
    }
}

const vacationsService = new VacationsService();

export default vacationsService;