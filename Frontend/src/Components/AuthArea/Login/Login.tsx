import { Button, Fab, TextField, Typography } from "@material-ui/core";
import axios from "axios";
import { useForm } from "react-hook-form";
import { NavLink, useHistory } from "react-router-dom";
import CredentialsModel from "../../../Models/CredentialsModel";
import { AuthActionType } from "../../../Redux/AuthState";
import store from "../../../Redux/Store";
import notify from "../../../Services/Notify";
import "./Login.css";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useEffect } from "react";
import config from "../../../Services/Config";


function Login(): JSX.Element {
    const history = useHistory();
    const { register, handleSubmit, formState } = useForm<CredentialsModel>();

    useEffect(() => {
        if (store.getState().authState.user) {
            return history.replace("/")
        }
    });

    async function send(credentials: CredentialsModel) {
        try {
            const response = await axios.post<CredentialsModel>(config.loginURL, credentials);
            store.dispatch({ type: AuthActionType.UserLoggedIn, payload: response.data });
            notify.success("Logged-In Successfully!");
            history.replace("/");

        } catch (error) {
            notify.error(error);
        }
    }

    return (
        <div className="Login">
            <form onSubmit={handleSubmit(send)}>

                <Fab size="large" color="primary" ><Typography component="h3" variant="h6">Sign In </Typography>
                    <LockOutlinedIcon /> </Fab>


                <TextField className="input" label="Username*" variant="outlined" type="text" {...register("username", {
                    required: { value: true, message: "Missing username" }
                })} />
                <span className="ErrorSpan">{formState.errors.username?.message}</span>


                <TextField className="input" label="Password*" variant="outlined" type="password" {...register("password", {
                    required: { value: true, message: "Missing Password" }
                })} />
                <span className="ErrorSpan">{formState.errors.password?.message}</span>


                <Button type="submit" variant="outlined">Login</Button>
                <NavLink to="/register" exact>You don't have an account?</NavLink>

            </form>
        </div>
    );
}

export default Login;
