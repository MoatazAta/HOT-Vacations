import UserModel from "../Models/UserModel";

export class AuthState {
    public user: UserModel = null;

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
            localStorage.setItem("user", JSON.stringify(newState.user));
            break;
        case AuthActionType.UserLoggedOut:
            newState.user = null;
            localStorage.removeItem("user");
            break;
    }

    return newState;
}
