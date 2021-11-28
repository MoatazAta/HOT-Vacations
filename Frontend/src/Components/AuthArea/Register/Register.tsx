import axios from "axios";
import { useForm } from "react-hook-form";
import { NavLink, useHistory } from "react-router-dom";
import UserModel from "../../../Models/UserModel";
import { AuthActionType } from "../../../Redux/AuthState";
import store from "../../../Redux/Store";
import notify from "../../../Services/Notify";
import config from "../../../Services/Config";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import "./Register.css";
import { Button, Fab, TextField, Typography } from "@material-ui/core";

function Register(): JSX.Element {

    const history = useHistory();
    const { register, handleSubmit, formState } = useForm<UserModel>();

    async function send(user: UserModel) {
        try {
            const myFormData = new FormData();
            myFormData.append("firstName", user.firstName);
            myFormData.append("lastName", user.lastName);
            myFormData.append("username", user.username);
            myFormData.append("password", user.password);

            const response = await axios.post<UserModel>(config.registerURL, myFormData);
            store.dispatch({ type: AuthActionType.UserRegistered, payload: response.data });
            notify.success("your register success!")
            history.push("/home");

        } catch (error) {
            notify.error(error);
        }
    }

    return (
        <div className="Register">

            <Fab size="large" color="primary" ><Typography component="h3" variant="h6">Sign Up </Typography>
                <LockOutlinedIcon /> </Fab>
            <form onSubmit={handleSubmit(send)}>

                <TextField className="input" label="First Name*" variant="outlined"
                    {...register("firstName", { required: true, minLength: 2, maxLength: 30, pattern: /^[a-zA-Z]{2,30}$/ })} />
                {formState.errors.firstName?.type === "required" && <span className="ErrorSpan">Please Enter your first name.</span>}
                {formState.errors.firstName?.type === "minLength" && <span className="ErrorSpan">first name too short.</span>}
                {formState.errors.firstName?.type === "maxLength" && <span className="ErrorSpan">first name too long.</span>}
                {formState.errors.firstName?.type === "pattern" && <span className="ErrorSpan">Invalid first name</span>}



                <TextField className="input" label="Last Name*" variant="outlined" type="text"
                    {...register("lastName", { required: true, minLength: 2, maxLength: 30, pattern: /^[a-zA-Z]{2,35}$/ })} />
                {formState.errors.lastName?.type === "required" && <span className="ErrorSpan">Please enter your last name.</span>}
                {formState.errors.lastName?.type === "minLength" && <span className="ErrorSpan">last name too short.</span>}
                {formState.errors.lastName?.type === "maxLength" && <span className="ErrorSpan">last name too long.</span>}
                {formState.errors.lastName?.type === "pattern" && <span className="ErrorSpan">Invalid last name</span>}

                <TextField className="input" label="Username*" variant="outlined" type="text"
                    {...register("username", { required: true, minLength: 3, maxLength: 30, pattern: /^[0-9a-zA-Z]{4,30}$/ })} />
                {formState.errors.username?.type === "required" && <span className="ErrorSpan">Please enter your username.</span>}
                {formState.errors.username?.type === "minLength" && <span className="ErrorSpan">username too short.</span>}
                {formState.errors.username?.type === "maxLength" && <span className="ErrorSpan">username too long.</span>}
                {formState.errors.username?.type === "pattern" && <span className="ErrorSpan">Invalid username</span>}

                <TextField className="input" label="Password*" variant="outlined" type="password"
                    {...register("password", { required: true, minLength: 6, maxLength: 30 })} />
                {formState.errors.password?.type === "required" && <span className="ErrorSpan">Please enter your password</span>}
                {formState.errors.password?.type === "minLength" && <span className="ErrorSpan">Please enter password with at least 6 chars</span>}
                {formState.errors.password?.type === "maxLength" && <span className="ErrorSpan">pPlease enter password with at most 30 chars</span>}


                <Button variant="outlined" type="submit">Register</Button>
                <NavLink to="/login" exact>You already have an account? </NavLink>


            </form>
        </div>
    );
}

export default Register;
