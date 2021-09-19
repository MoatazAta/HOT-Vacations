import axios from "axios";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import UserModel from "../../../Models/UserModel";
import { AuthActionType } from "../../../Redux/AuthState";
import store from "../../../Redux/Store";
import notify from "../../../Services/Notify";
import config from "../../../Services/Config";

import "./Register.css";

function Register(): JSX.Element {

    const history = useHistory();
    const { register, handleSubmit, formState } = useForm<UserModel>();

    async function send(user: UserModel) {
        try {
            const response = await axios.post<UserModel>(config.authUrl + "register", user);
            store.dispatch({ type: AuthActionType.UserRegistered, payload: response.data });
            notify.success("your register success!")
            history.push("/home");

        } catch (error) {
            notify.error(error);
        }
    }

    return (
        <div className="Register Box">
            <h2>Register</h2>
            <form onSubmit={handleSubmit(send)}>

                <label>First name: </label>
                <input type="text" {...register("firstName", { required: true, minLength: 2 })} />
                {formState.errors.firstName?.type === "required" && <span>Missing first name.</span>}
                {formState.errors.firstName?.type === "minLength" && <span>first name too short.</span>}

                <label>Last name: </label>
                <input type="text" {...register("lastName", { required: true, minLength: 2 })} />
                {formState.errors.lastName?.type === "required" && <span>Missing last name.</span>}
                {formState.errors.lastName?.type === "minLength" && <span>last name too short.</span>}

                <label>Username: </label>
                <input type="text" {...register("username", { required: true, minLength: 3 })} />
                {formState.errors.username?.type === "required" && <span>Missing username.</span>}
                {formState.errors.username?.type === "minLength" && <span>username too short.</span>}

                <label>Password: </label>
                <input type="password" {...register("password", { required: true, minLength: 4 })} />
                {formState.errors.password?.type === "required" && <span>Missing password.</span>}
                {formState.errors.password?.type === "minLength" && <span>password too short.</span>}

                <button>Register</button>

            </form>
        </div>
    );
}

export default Register;
