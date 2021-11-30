import { useHistory } from "react-router-dom";
import VacationModel from "../../../Models/VacationModel";
import { useForm } from "react-hook-form";
import "./AddVacation.css";
import { useEffect } from "react";
import store from "../../../Redux/Store";
import notify from "../../../Services/Notify";
import jwtAxios from "../../../Services/jwtAxios";
import config from "../../../Services/Config";
import { VacationActionType } from "../../../Redux/VacationState";
import { Button, FormControl, Input, InputLabel, TextField, Typography } from "@material-ui/core";
import { checkStartEndDate } from "../../../Helpers/HandleDate";
import socketService from "../../../Services/socketService";
import { AuthActionType } from "../../../Redux/AuthState";

function AddVacation(): JSX.Element {

    const history = useHistory();
    const { register, handleSubmit, formState } = useForm<VacationModel>();

    // If you are not logged in:
    useEffect(() => {
        if (!store.getState().authState.user) {
            notify.error("You are not logged in!");
            return history.replace("/login");
        }

        if (!store.getState().authState.user.isAdmin) {
            notify.error("You are not authorized!");
            return history.replace("/");
        }

    });
    async function send(vacation: VacationModel) {
        try {
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

            const response = await jwtAxios.post<VacationModel>(config.vacationsURL, myFormData);

            store.dispatch({ type: VacationActionType.VacationAdded, payload: response.data });

            socketService.addVacation(response.data);

            notify.success("vacation has been added successfully.");
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
        <div className="AddVacation Bg Box">

            <form onSubmit={handleSubmit(send)}>
                <Typography variant="h6" color="primary" align="center">Add Vacation</Typography>
                <TextField
                    label="Destination"
                    variant="outlined"
                    className="TextBox"
                    {...register("destination", {
                        required: true,
                        minLength: 3,
                        maxLength: 50,
                    })}
                />
                {formState.errors.destination?.type === "required" && (
                    <span>Please enter a destination</span>
                )}

                {formState.errors.destination?.type === "minLength" && (
                    <span>A destination should be at least 3 characters</span>
                )}
                {formState.errors.destination?.type === "maxLength" && (
                    <span>A destination should be at most 50 characters</span>
                )}

                <TextField
                    size="medium"
                    label="Description"
                    variant="outlined"
                    multiline
                    rows={3}
                    className="TextBox"
                    {...register("description", {
                        required: true,
                        minLength: 10,
                        maxLength: 1000,
                    })}
                />
                {formState.errors.description?.type === "required" && (
                    <span>Please enter your description</span>
                )}
                {formState.errors.description?.type === "minLength" && (
                    <span>A description should be at least 10 characters</span>
                )}
                {formState.errors.description?.type === "maxLength" && (
                    <span>A description should be at most 1000 characters</span>
                )}

                <TextField
                    type="number"
                    inputProps={{ step: "0.01" }}
                    label="price"
                    variant="outlined"
                    className="TextBox"
                    {...register("price", {
                        required: true,
                        min: 0,
                        max: 10000,
                    })}
                />
                {formState.errors.price?.type === "required" && <span>Please enter a price</span>}
                {formState.errors.price?.type === "min" && (
                    <span>A price cannot be negative</span>
                )}
                {formState.errors.price?.type === "max" && (
                    <span>A price can be maximum $10000</span>
                )}


                <FormControl className="TextBox">
                    <InputLabel htmlFor="component-from" shrink={true}>
                        From
                    </InputLabel>
                    <Input
                        type="date"
                        id="component-from"
                        {...register("start", {
                            required: true,
                        })}
                    />
                </FormControl>
                {formState.errors.start?.type === "required" && (
                    <span>Please enter a start date</span>
                )}
                <FormControl className="TextBox">
                    <InputLabel htmlFor="component-to" shrink={true}>
                        To
                    </InputLabel>
                    <Input
                        type="date"
                        id="component-to"
                        {...register("end", {
                            required: true,
                        })}
                    />
                </FormControl>
                {formState.errors.end?.type === "required" && (
                    <span>Please enter an end date</span>
                )}

                <FormControl className="TextBox">
                    <label className="label">Image</label>
                    <input className="upload" type="file" accept="image/*" {...register("image", { required: true, })} />
                </FormControl>
                {formState.errors.image && <span>Missing image.</span>}

                <Button type="submit" variant="contained" color="primary">
                    Submit
                </Button>
            </form>

        </div>
    );
}

export default AddVacation;
