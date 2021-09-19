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
import CardMedia from '@material-ui/core/CardMedia';
import DateRangeIcon from '@material-ui/icons/DateRange';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { Delete } from "@material-ui/icons";
import EditIcon from "@material-ui/icons";
import vacationsService from "../../../Services/VacationsService";
import { VacationActionType } from "../../../Redux/VacationState";

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
            await jwtAxios.delete(config.vacationsUrl + props.vacation.vacationId);
            vacationsService.delete(props.vacation.vacationId);
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
                <img src={Config.vacationImagesUrl + props.vacation.picture} width="200" height="150" />
                <CardContent>
                    <Typography variant="body2" color="primary">
                        {props.vacation.start} to {props.vacation.end}
                    </Typography>

                    <Typography  variant="body2" color="textSecondary" noWrap >
                        {props.vacation.description}
                    </Typography>
                </CardContent>
                <div className="bottomMenu">
                    {props.isAdmin === 1 && <NavLink to={"/vacations/edit/" + props.vacation.vacationId}><Fab color="secondary" size="small" aria-label="edit"> <EditOutlinedIcon /></Fab></NavLink>}

                    {props.isAdmin === 1 && <NavLink to={"/vacations/delete/" + props.vacation.vacationId} ><Fab size="small" color="primary" aria-label="delete" onClick={() => deleteVacation()}> <Delete /> </Fab></NavLink>}

                    {props.isAdmin === 0 && <Following vacationId={props.vacation.vacationId} userId={store.getState().authState.user.userId}></Following>}
                </div>
            </Card>
        </div>
    );
}

export default VacationCard;
