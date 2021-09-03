import axios from "axios";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import UserModel from "../../../Models/UserModel";
import { AuthActionType } from "../../../Redux/AuthState";
import store from "../../../Redux/Store";
import "./Register.css";

function Register(): JSX.Element {

    const history = useHistory();
    const {register, handleSubmit} = useForm<UserModel>();

    async function send(user: UserModel) {
        try {
            const response = await axios.post<UserModel>("http://localhost:3001/api/auth/register", user);
            store.dispatch({type: AuthActionType.UserRegistered, payload: response.data});
            // notify.success
            // history.push("/home");

        } catch (error) {
            alert(error);
            // notify.error(error);
        }
    }

    return (
        <div className="Register Box">
			<h2>Register</h2>
            <form onSubmit={handleSubmit(send)}>

                <label>First name: </label>
                <input type="text" {...register("firstName")} />
                
                <label>Last name: </label>
                <input type="text" {...register("lastName")} />

                <label>Username: </label>
                <input type="text" {...register("username")} />

                <label>Password: </label>
                <input type="password" {...register("password")} />

                <button>Register</button>

            </form>
        </div>
    );
}

export default Register;
