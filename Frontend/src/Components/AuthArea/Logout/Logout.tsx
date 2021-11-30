import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { AuthActionType } from "../../../Redux/AuthState";
import store from "../../../Redux/Store";
import notify from "../../../Services/Notify";
import socketService from "../../../Services/socketService";

function Logout(): JSX.Element {
    const history = useHistory();
    useEffect(() => {
        store.dispatch({ type: AuthActionType.UserLoggedOut });
        if (socketService.isConnected()) {
            socketService.disconnect();
        }
        notify.success("you are logged out.");
        history.replace("/home");
    });
    return null;
}

export default Logout;
