import { useState, useEffect } from "react";
import { RouteComponentProps, useHistory, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import VacationModel from "../../../Models/VacationModel";
import store from "../../../Redux/Store";
import notify from "../../../Services/Notify";
import "./EditVacation.css";
import jwtAxios from "../../../Services/jwtAxios";
import config from "../../../Services/Config";
import axios from "axios";
import { VacationActionType } from "../../../Redux/VacationState";

interface RouteParams {
    id: string;
}

interface EditVacationProps extends RouteComponentProps<RouteParams> {
}

function EditVacation(props: EditVacationProps): JSX.Element {

    const id = + props.match.params.id;
    const history = useHistory();
    const { register, handleSubmit, formState } = useForm<VacationModel>();
    const [vacation, setVacation] = useState<VacationModel[]>([]);

    useEffect(() => {

        if (!store.getState().authState.user) {
            notify.error("You are not logged in!");
            history.push("/login");
        }
        jwtAxios.get<VacationModel[]>(config.vacationsUrl + `${id}`)
            .then(response => setVacation(response.data))
            .catch(error => {
                notify.error(error);
            });
    }, []);


    async function send(vacation: VacationModel) {
        try {
            //socket is here!
            const vacationSocket = store.getState().authState.vacationSocket.socket;   

            const myFormData = new FormData();
            myFormData.append("description", vacation.description);
            myFormData.append("destination", vacation.destination);
            myFormData.append("price", vacation.price.toString());
            myFormData.append("start", vacation.start);
            myFormData.append("end", vacation.end);
            myFormData.append("image", vacation.image.item(0));
            const response = await axios.put<VacationModel>(config.vacationsUrl + `${id}`, myFormData);
            const updatedVacation = response.data;
            vacationSocket.emit("updated-vacation-from-client", updatedVacation);

            // store.dispatch({ type: VacationActionType.VacationUpdated, payload: updatedVacation });

            notify.success("Vacations has been update");
            history.push("/vacations");
        } catch (err) {
            notify.error(err);
            // if (err.response.data === "Your login session has expired.") {
            //     store.dispatch({ type: AuthActionType.UserLoggedOut });
            //     history.push("/login");
            // }
        }


    }

    return (
        <div className="EditVacation" >
            {vacation.map(v =>
                <form onSubmit={handleSubmit(send)} key={v.vacationId} >

                    <label>Destination: </label>
                    <input type="text" defaultValue={v.destination} {...register("destination", { required: true, minLength: 2 })} />
                    {formState.errors.destination?.type === "required" && <span>Missing destination.</span>}
                    {formState.errors.destination?.type === "minLength" && <span>destination too short.</span>}

                    <label>Description:</label>
                    <textarea defaultValue={v.description} {...register("description", { required: true, minLength: 2 })} ></textarea>
                    {formState.errors.description?.type === "required" && <span>Missing description.</span>}
                    {formState.errors.description?.type === "minLength" && <span>Description too short.</span>}

                    <label>Price:</label>
                    <input type="number" step="0.01" defaultValue={v.price} {...register("price", { required: true, min: 0 })} />
                    {formState.errors.price?.type === "required" && <span>Missing price.</span>}
                    {formState.errors.price?.type === "min" && <span>Price can't be negative.</span>}

                    <label>Departure Date:</label>
                    <input type="date" defaultValue={v.start} {...register("start", { required: true })} />
                    {formState.errors.start?.type === "required" && <span>Missing Departure Date.</span>}

                    <label>Return Date:</label>
                    <input type="date" defaultValue={v.end} {...register("end", { required: true })} />
                    {formState.errors.end?.type === "required" && <span>Missing Return Date.</span>}

                    <label>Image: </label>
                    <input type="file" accept="image/*" {...register("image")} />
                    {formState.errors.image && <span>Missing image.</span>}

                    <button>Update</button>
                </form>

            )}
        </div>
    );
}

export default EditVacation;
