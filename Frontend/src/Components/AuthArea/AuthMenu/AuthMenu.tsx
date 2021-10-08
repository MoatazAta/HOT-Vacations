import { Component } from "react";
import { NavLink } from "react-router-dom";
import { Unsubscribe } from "redux";
import UserModel from "../../../Models/UserModel";
import store from "../../../Redux/Store";
import "./AuthMenu.css";
// import LogoutIcon from '@mui/icons-material/Logout';
// import LogoutIcon from '@material-ui/icons/Logout';
import { Fab } from "@material-ui/core";

interface AuthMenuState {
    user: UserModel;
}

class AuthMenu extends Component<{}, AuthMenuState> {

    private unsubscribeMe: Unsubscribe;

    public constructor(props: {}) {
        super(props);
        this.state = { user: store.getState().authState.user };
    }

    public componentDidMount(): void {
        this.unsubscribeMe = store.subscribe(() => {
            this.setState({ user: store.getState().authState.user });
        });
    }

    public componentWillUnmount(): void {
        this.unsubscribeMe();
    }

    public render(): JSX.Element {
        return (
            <div className="AuthMenu">
                {this.state.user &&
                    <>
                        <span>Hello {this.state.user.firstName + " " + this.state.user.lastName}</span>
                        <span> | </span>
                        <NavLink to="/logout" exact><Fab color="secondary" size="small" aria-label="edit"> <LogoutIcon /></Fab></NavLink>

                    </>
                }
                {
                    !this.state.user &&
                    <>
                        <span>Hello Guest</span>
                        <span> | </span>
                        <NavLink to="/login" exact>Login</NavLink>
                        <span> | </span>
                        <NavLink to="/register" exact>Register</NavLink>
                    </>
                }
            </div>
        );
    }
}

export default AuthMenu;
