import axios from "axios";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import CredentialsModel from "../../../Models/CredentialsModel";
import { AuthActionType } from "../../../Redux/AuthState";
import store from "../../../Redux/Store";
import notify from "../../../Services/Notify";
import "./Login.css";

function Login(): JSX.Element {
    const history = useHistory();
    const { register, handleSubmit, formState } = useForm<CredentialsModel>();

    async function send(credentials: CredentialsModel) {
        try {
            const response = await axios.post<CredentialsModel>("http://localhost:3001/api/auth/login", credentials);
            store.dispatch({ type: AuthActionType.UserLoggedIn, payload: response.data });
            notify.success("Logged-In Successfully!");
            history.push("/vacations");

        } catch (error) {
            notify.error(error);
        }
    }

    return (
        <div className="Login Box">
            <h2>Login</h2>
            <form onSubmit={handleSubmit(send)}>

                <label>Username: </label>
                <input type="text" {...register("username", {
                    required: { value: true, message: "Missing username! " },
                    minLength: { value: 4, message: "password must be larger than" }
                 })} />
                <br />
                <span>{formState.errors.username?.message}</span>
                <label>Password: </label>
                <input type="password" {...register("password")} />

                <button>Login</button>
            </form>
        </div>
    );
}

export default Login;
