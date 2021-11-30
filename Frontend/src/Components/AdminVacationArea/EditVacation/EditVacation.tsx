import { useState, useEffect } from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import VacationModel from "../../../Models/VacationModel";
import store from "../../../Redux/Store";
import notify from "../../../Services/Notify";
import "./EditVacation.css";
import jwtAxios from "../../../Services/jwtAxios";
import config from "../../../Services/Config";
import { VacationActionType } from "../../../Redux/VacationState";
import socketService from "../../../Services/socketService";
import { Button, FormControl, Typography } from "@material-ui/core";
import { checkStartEndDate } from "../../../Helpers/HandleDate";
import { AuthActionType } from "../../../Redux/AuthState";

interface RouteParams {
    uuid: string;
}

interface EditVacationProps extends RouteComponentProps<RouteParams> {
}

function EditVacation(props: EditVacationProps): JSX.Element {

    const id = props.match.params.uuid;
    const isoDate = (date: string) => date.split("T")[0];
    const history = useHistory();
    const { register, handleSubmit, formState } = useForm<VacationModel>({ mode: "onChange" });
    const [vacation, setVacation] = useState<VacationModel>(null);
 
    useEffect(() => {
        if (!store.getState().authState.user) {
            notify.error("You are not logged in!");
            return history.replace("/login");
        }
        if (!store.getState().authState.user.isAdmin) {
            notify.error("You are not authorized!");
            return history.replace("/");
        }
        const currentVacation = store.getState().vacationState.vacations.find(v => v.vacationId === id);

        setVacation(currentVacation);
    },[vacation]); 

    async function send(vacation: VacationModel) {
        try {
            vacation.vacationId = id;
            const checked = checkStartEndDate(vacation.start, vacation.end);
            if (!checked.answer) {
                return notify.error(checked.message);
            }
            const myFormData = new FormData();
            myFormData.append("description", vacation.description);
            myFormData.append("destination", vacation.destination);
            myFormData.append("price", vacation.price.toString());
            myFormData.append("start", vacation.start);
            myFormData.append("end", vacation.end);
            myFormData.append("image", vacation.image.item(0));
            const response = await jwtAxios.put<VacationModel>(config.vacationsURL + `${id}`, myFormData);
            const updatedVacation = response.data;

            store.dispatch({ type: VacationActionType.VacationUpdated, payload: updatedVacation });

            socketService.updateVacation(response.data);

            notify.success("Vacations has been update");
            history.push("/vacations");

        }
        catch (err: any) {
            if (err.response.status === 401) {
                return history.replace("/");
            }
            else if (err.response.status === 403) {
                store.dispatch({ type: AuthActionType.UserLoggedOut, });
                return history.replace("/login");
            }
            notify.error(err);
        }
    }

    return (
        <div className="EditVacation Box" >

            {vacation &&
                <>
                    <Typography variant="h6" color="primary" align="center">Update Vacation</Typography>

                    <form onSubmit={handleSubmit(send)}>

                        <FormControl className="TextBox">
                            <label htmlFor="component-destination">Destination</label>
                            <input
                                className="TextBox"
                                id="component-destination"
                                defaultValue={vacation.destination}
                                name="destination"
                                {...register("destination", {
                                    required: true,
                                    minLength: 4,
                                    maxLength: 60,
                                })}
                            />
                            {formState.errors.destination?.type === "required" && (
                                <span>Please enter a destination</span>
                            )}

                            {formState.errors.destination?.type === "minLength" && (
                                <span>A destination should be at least 4 characters</span>
                            )}
                            {formState.errors.destination?.type === "maxLength" && (
                                <span>A destination should be at most 60 characters</span>
                            )}
                        </FormControl>


                        <FormControl className="TextBox">
                            <label htmlFor="component-description">Description</label>
                            <textarea
                                id="component-description"
                                defaultValue={vacation.description}
                                name="description"

                                {...register("description", {
                                    required: true,
                                    minLength: 10,
                                    maxLength: 1500,
                                })}
                            />
                        </FormControl>
                        {formState.errors.description?.type === "required" && (
                                <span>Please enter a description</span>
                            )}
                        {formState.errors.description?.type === "minLength" && (
                            <span>A description should be at least 10 characters</span>
                        )}
                        {formState.errors.description?.type === "maxLength" && (
                            <span>A description should be at most 1500 characters</span>
                        )}

                        <FormControl className="TextBox">
                            <label htmlFor="component-price">Price</label>
                            <input
                                name="price"
                                type="number"
                                id="component-price"
                                step="0.01"
                                defaultValue={vacation.price}
                                {...register("price", {
                                    required: true,
                                    min: 0,
                                    max: 10000,
                                })}
                            />
                        </FormControl>
                        {formState.errors.price?.type === "required" && (
                                <span>Please enter a price</span>
                            )}
                        {formState.errors.price?.type === "min" && (
                            <span>A price cannot be negative</span>
                        )}
                        {formState.errors.price?.type === "max" && (
                            <span>A price can be maximum $10000</span>
                        )}

                        <FormControl className="TextBox">
                            <label htmlFor="component-from">
                                From
                            </label>
                            <input
                                name="start"
                                type="date"
                                id="component-from"
                                defaultValue={isoDate(vacation.start)}
                                {...register("start", {
                                    required: true})}
                            />
                        </FormControl>
                        {formState.errors.start?.type === "required" && (
                                <span>Please enter a start date</span>
                            )}

                        <FormControl className="TextBox">
                            <label htmlFor="component-to">
                                To
                            </label>
                            <input
                                name="end"
                                type="date"
                                id="component-to"
                                defaultValue={isoDate(vacation.end)}
                                {...register("end", {
                                    required: true})}
                            />
                        </FormControl>
                        {formState.errors.end?.type === "required" && (
                                <span>Please enter a end date</span>
                            )}

                        <FormControl className="TextBox">
                            <label className="label">Image</label>
                            <input className="upload" type="file" accept="image/*" {...register("image")} />
                        </FormControl>

                        <Button type="submit" variant="contained" color="primary">
                            Submit
                        </Button>
                    </form>
                </>
            }

        </div>
    );
}

export default EditVacation;
