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

interface VacationCardProps {
    vacation: VacationModel;
    isAdmin?: number;
}

function VacationCard(props: VacationCardProps): JSX.Element {
    const history = useHistory();

    const deleteVacation = async () => {
        try {
            const vacationSocket = store.getState().authState.vacationSocket.socket;
            const ok = window.confirm("Are you sure?");
            if (!ok) return;
            const response = await jwtAxios.delete(config.vacationsUrl + props.vacation.vacationId);
            vacationSocket.emit("deleted-vacation-from-client", response);
            notify.success("Vacation has been deleted");
            history.push("/vacations");
        } catch (err) {
            notify.error(err);
        }
    }

    return (
        <div className="VacationCard">
            <FollowersCount vacationId={props.vacation.vacationId} />
            destination: {props.vacation.destination}
            <br />
            description: {props.vacation.description}
            <br />
            price: {props.vacation.price}
            <br />
            departure: {props.vacation.start}
            <br />
            return: {props.vacation.end}
            <br />
            <img src={Config.vacationImagesUrl + props.vacation.picture} width="100" height="90" />
            <div className="AdminControl">
                {props.isAdmin === 1 && <NavLink to={"/vacations/edit/" + props.vacation.vacationId}>Edit</NavLink>}
                <span> | </span>
                {props.isAdmin === 1 && <NavLink to={"/vacations/delete/" + props.vacation.vacationId} onClick={() => deleteVacation()} >Delete</NavLink>}
                <span> | </span>
                {/* {props.isAdmin === 0 && <Following vacationId={props.vacation.vacationId}></Following>} */}
            </div>
        </div>
    );
}

export default VacationCard;
