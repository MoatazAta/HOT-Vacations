import { io, Socket } from "socket.io-client";
import VacationModel from "../Models/VacationModel";

// handling real time updates, adds and deletion of vacations
class SocketService {
  private socket: Socket;

  public connect(): boolean {
    if (this.socket?.connected) {
      return false;
    }
    this.socket = io("http://localhost:3001");
    return true;
  }
  public isConnected(): Boolean {
    return this.socket ? (this.socket.connected ? true : false) : false;
  }
  public vacationAdded(updateState: Function) {
    if (!this.socket?.hasListeners("vacation-added")) {
      this.socket.on("vacation-added", (vacation) => updateState(vacation));
    }
  }
  public addVacation(vacation: VacationModel) {
    if (!this.socket?.hasListeners("add-new-vacation")) {
      this.socket.emit("add-new-vacation", vacation);
    }
  }
  public vacationUpdated(updateState: Function) {
    if (!this.socket?.hasListeners("vacation-updated")) {
      this.socket.on("vacation-updated", (vacation) => updateState(vacation));
    }
  }
  
  public updateVacation(vacation: VacationModel) {
    if (!this.socket?.hasListeners("update-vacation")) {
      this.socket.emit("update-vacation", vacation);
    }
  }

  public vacationDeleted(updateState: Function) {
    if (!this.socket?.hasListeners("vacation-deleted")) {
      this.socket.on("vacation-deleted", (vacationId: string) =>
        updateState(vacationId)
      );
    }
  }

  public deleteVacation(vacationId: string) {
    if (!this.socket?.hasListeners("delete-vacation")) {
      this.socket.emit("delete-vacation", vacationId);
    }
  }

  public disconnect(): void {
    this.socket.disconnect();
  }
}

const socketService = new SocketService();

export default socketService;
