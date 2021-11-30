import { Button, ButtonGroup, Checkbox, FormControlLabel, TextField, Typography } from "@material-ui/core";
import { Clear, ContactMail, Send } from "@material-ui/icons";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import store from "../../../Redux/Store";
import notify from "../../../Services/Notify";
import "./ContactUs.css";

interface ContactUsForm {
    name: string;
    email: string;
    message?: string;
}

function ContactUs(): JSX.Element {
    const history = useHistory();
    const { register, handleSubmit, formState,} = useForm<ContactUsForm>();


    useEffect(() => {
        document.title = "Contact us";
        if (!store.getState().authState.user) {
            notify.error("You are not logged in.");
            return history.replace("/login");
        }
    });

    function send(cts: ContactUsForm) {
        notify.success("Your message has been sent");
        history.push("/vacations");
    }


    return (

        <div className="ContactUs Box">
            <Typography variant="h4" className="Headline" color="primary" >
                <ContactMail />
                Contact Us
            </Typography>

            <Typography gutterBottom variant="body2" className="subtitle" align="center">
                We love to receive your complaints or suggestions.So please send us a message.
            </Typography>

            <form onSubmit={handleSubmit(send)}>
                <TextField
                    label="Name"
                    variant="outlined"
                    className="TextBox"
                    name="name"
                    {...register("name", {
                        required: true,
                    })}
                />
                {formState.errors.name?.type === "required" && (
                    <span>Please enter your full name</span>
                )}
                <TextField label="Email" variant="outlined" type="email" className="TextBox"
                    {...register("email", {
                        required: true,
                    })} />
                {formState.errors.email?.type === "required" && (
                    <span>Please enter your email</span>
                )}

                <TextField multiline rows={2} label="Message" variant="outlined" className="TextBox"
                    {...register("message", {
                        required: true,
                    })} />
                {formState.errors.message?.type === "required" && (
                    <span>Please enter a message</span>
                )}

                <FormControlLabel label="Send me promotional emails" control={<Checkbox />} />

                <ButtonGroup variant="contained" fullWidth>
                    <Button type="submit" color="primary" startIcon={<Send />}>  Send</Button>
                    <Button color="secondary" startIcon={<Clear />} type="reset">Clear</Button>
                </ButtonGroup>
            </form>
        </div>
    );

}

export default ContactUs;
 