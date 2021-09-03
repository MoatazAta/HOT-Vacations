import { useHistory } from "react-router-dom";
import VacationModel from "../../../Models/VacationModel";
import { useForm } from "react-hook-form";
import "./AddVacation.css";
import { useEffect } from "react";
import store from "../../../Redux/Store";
import notify from "../../../Services/Notify";
import jwtAxios from "../../../Services/jwtAxios";
import { VacationActionType } from "../../../Redux/VacationState";
import config from "../../../Services/Config";

function AddVacation(): JSX.Element {
    const history = useHistory();
    const { register, handleSubmit, formState } = useForm<VacationModel>();

    // If you are not logged in:
    useEffect(() => {
        if (!store.getState().authState.user) {
            notify.error("You are not logged in!");
            history.push("/login");
        }
    });

    async function send(vacation: VacationModel) {
        try {
            const vacationSocket = store.getState().authState.vacationSocket.socket;   
            const myFormData = new FormData();
            myFormData.append("description", vacation.description);
            myFormData.append("destination", vacation.destination);
            myFormData.append("price", vacation.price.toString());
            myFormData.append("start", vacation.start);
            myFormData.append("end", vacation.end);
            myFormData.append("image", vacation.image.item(0));
            // POST to the server the FormData object:
            // const headers = { "authorization": "Bearer " + store.getState().authState.user?.token };
            // const response = await axios.post<ProductModel>(config.productsUrl, myFormData, { headers });
            const response = await jwtAxios.post<VacationModel>(config.vacationsUrl, myFormData);
            vacationSocket.emit("added-vacation-from-client", response.data);
            // Add the added product to Redux (response.data is the added product which backend sends us back): 
            // store.dispatch({ type: VacationActionType.VacationAdded, payload: response.data });
            // Success message: 
            notify.success("vacation has been added.");

            // Navigate to "/products" route: 
            history.push("/vacations");
        }
        catch (err) {
            notify.error(err);
        }
    }

    return (
        <div className="AddVacation">
            <h2>Add New Vacation</h2>
            <form onSubmit={handleSubmit(send)} >

                <label>Destination: </label>
                <input type="text" {...register("destination", { required: true, minLength: 2 })} />
                {formState.errors.destination?.type === "required" && <span>Missing destination.</span>}
                {formState.errors.destination?.type === "minLength" && <span>destination too short.</span>}

                <label>Description:</label>
                <textarea {...register("description", { required: true, minLength: 2 })} ></textarea>
                {formState.errors.description?.type === "required" && <span>Missing description.</span>}
                {formState.errors.description?.type === "minLength" && <span>Description too short.</span>}

                <label>Price:</label>
                <input type="number" step="0.01"  {...register("price", { required: true, min: 0 })} />
                {formState.errors.price?.type === "required" && <span>Missing price.</span>}
                {formState.errors.price?.type === "min" && <span>Price can't be negative.</span>}

                <label>Departure Date:</label>
                <input type="date"  {...register("start", { required: true })} />
                {formState.errors.start?.type === "required" && <span>Missing Departure Date.</span>}

                <label>Return Date:</label>
                <input type="date"  {...register("end", { required: true })} />
                {formState.errors.end?.type === "required" && <span>Missing Return Date.</span>}

                <label>Image: </label>
                <input type="file" accept="image/*" {...register("image", { required: true })} />
                {formState.errors.image && <span>Missing image.</span>}

                <button>Add</button>
            </form>
        </div>
    );
}

export default AddVacation;
