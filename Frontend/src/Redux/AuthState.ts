import UserModel from "../Models/UserModel";
import VacationsService from "../Services/VacationsService";

export class AuthState {
    public user: UserModel = null;

    public vacationSocket: VacationsService = new VacationsService();;

    public constructor() {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            this.user = user;
        }
    }
}

export enum AuthActionType {
    UserRegistered = "UserRegistered",
    UserLoggedIn = "UserLoggedIn",
    UserLoggedOut = "UserLoggedOut"
}

export interface AuthAction {
    type: AuthActionType;
    payload?: any;
}

export function authReducer(currentState: AuthState = new AuthState(), action: AuthAction) {
    const newState = { ...currentState };
    switch (action.type) {
        case AuthActionType.UserRegistered:
        case AuthActionType.UserLoggedIn:
            newState.user = action.payload;
            newState.vacationSocket.connect();
            localStorage.setItem("user", JSON.stringify(newState.user));
            break;
        case AuthActionType.UserLoggedOut:
            newState.user = null;
            newState.vacationSocket.disconnect();
            localStorage.removeItem("user");
            break;
    }

    return newState;
}
