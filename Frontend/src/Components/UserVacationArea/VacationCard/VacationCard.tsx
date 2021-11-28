import { NavLink, useHistory } from "react-router-dom";
import VacationModel from "../../../Models/VacationModel";
import store from "../../../Redux/Store";
import config from "../../../Services/Config";
import Config from "../../../Services/Config";
import jwtAxios from "../../../Services/jwtAxios";
import notify from "../../../Services/Notify";
import FollowersCount from "../../FollowersArea/FollowersCount/FollowersCount";
import Following from "../../FollowersArea/Following/Following";
import "./VacationCard.css";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import { CardContent, Fab, IconButton, Typography } from "@material-ui/core";
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { Delete } from "@material-ui/icons";
import { VacationActionType } from "../../../Redux/VacationState";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface VacationCardProps {
    vacation: VacationModel;
    isAdmin?: number;
}

function VacationCard(props: VacationCardProps): JSX.Element {
    const history = useHistory();

    const deleteVacation = async () => {
        try {
            const ok = window.confirm("Are you sure?");
            if (!ok) return;
            await jwtAxios.delete(config.vacationsURL + props.vacation.vacationId);
            store.dispatch({ type: VacationActionType.VacationDeleted, payload: props.vacation.vacationId });

            notify.success("Vacation has been deleted");
            history.push("/vacations");
        } catch (err) {
            notify.error(err);
        }
    }

    return (
        <div className="VacationCard">
            <Card elevation={3}>
                <CardHeader
                    action={
                        <IconButton>
                            <FollowersCount vacationId={props.vacation.vacationId} />
                        </IconButton>
                    }
                    title={props.vacation.destination}
                    subheader={props.vacation.price}
                />
                <div className="img-card">
                    <img src={Config.vacationImagesURL + props.vacation.picture} width="200" height="150" alt="vacation" />
                    <NavLink className="info" to={"/vacations/details/" + props.vacation.vacationId} >
                        <Fab size="small" color="primary" aria-label="info"> <InfoOutlinedIcon /> </Fab>
                    </NavLink>
                </div>
                <CardContent>
                    <Typography variant="body2" color="primary">
                        {props.vacation.start} to {props.vacation.end}
                    </Typography>

                    <Typography variant="body2" color="textSecondary" noWrap >
                        {props.vacation.description}
                    </Typography>
                </CardContent>
                <div className="bottomMenu">
                    {props.isAdmin === 1 && <NavLink to={"/vacations/edit/" + props.vacation.vacationId}><Fab color="secondary" size="small" aria-label="edit"> <EditOutlinedIcon /></Fab></NavLink>}

                    {props.isAdmin === 1 && <NavLink to={"/vacations/delete/" + props.vacation.vacationId} ><Fab size="small" color="primary" aria-label="delete" onClick={() => deleteVacation()}> <Delete /> </Fab></NavLink>}

                    {props.isAdmin === 0 && <Following vacationId={props.vacation.vacationId}></Following>}

                </div>
            </Card>
        </div>
    );
}

export default VacationCard;
