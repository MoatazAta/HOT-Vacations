import { Component } from "react";
import VacationModel from "../../../Models/VacationModel";
import store from "../../../Redux/Store";
import VacationCard from "../VacationCard/VacationCard";
import "./VacationList.css";
import notify from "../../../Services/Notify";
import jwtAxios from "../../../Services/jwtAxios";
import { History } from "history";
import Loading from "../../SharedArea/Loading/Loading";
import { VacationActionType } from "../../../Redux/VacationState";
import UserModel from "../../../Models/UserModel";
import { NavLink } from "react-router-dom";
import config from "../../../Services/Config";
import vacationsService from "../../../Services/VacationsService";

interface VacationListState {
    vacations: VacationModel[];
    isAdmin: number;
    isFollow: boolean;
    user: UserModel;
}

interface VacationsListProps {
    history: History;
}

class VacationList extends Component<VacationsListProps, VacationListState> {

    public constructor(props: VacationsListProps) {
        super(props);
        this.state = { vacations: [], isAdmin: 0, isFollow: false, user: store.getState().authState.user };
    }

    public async componentDidMount() {
        try {
            if (!store.getState().authState.user) {
                this.props.history.push("/login");
                notify.error("You are not logged-in");
                return;
            }

            if (store.getState().vacationState.vacations.length === 0) {
                console.log("go to the server!!");
                const response = await jwtAxios.get<VacationModel[]>(config.vacationsUrl);
                this.setState({ vacations: response.data, isAdmin: this.state.user.isAdmin });
                store.dispatch({ type: VacationActionType.VacationsDownloaded, payload: response.data });
            }
            this.setState({ vacations: store.getState().vacationState.vacations, isAdmin: this.state.user.isAdmin })

            vacationsService.socket.on("updated-vacation-from-server", updatedVacation => {
                const allVacations = [...this.state.vacations];
                const indexToUpdate = allVacations.findIndex(v => v.vacationId === updatedVacation.vacationId);
                allVacations[indexToUpdate] = updatedVacation;
                this.setState({ vacations: allVacations });
                store.dispatch({ type: VacationActionType.VacationUpdated, payload: updatedVacation })
            });

            vacationsService.socket.on("added-vacation-from-server", addedVacation => {
                const allVacations = [...this.state.vacations];
                allVacations.push(addedVacation);
                this.setState({ vacations: allVacations });
                store.dispatch({ type: VacationActionType.VacationAdded, payload: addedVacation })

            });

            vacationsService.socket.on("deleted-vacation-from-server", deletedVacation => {
                const allVacations = [...this.state.vacations];
                const indexToDelete = allVacations.findIndex(v => v.vacationId === deletedVacation);
                allVacations.splice(indexToDelete, 1);
                this.setState({ vacations: allVacations });
                store.dispatch({ type: VacationActionType.VacationDeleted, payload: deletedVacation })
            });
        }
        catch (error) {
            notify.error(error);
        }
    }

    public async componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }

    public render(): JSX.Element {
        return (
            <div className="VacationList">
                {this.state.vacations.length === 0 && <Loading />}
                <div className="VacationsBar">
                    {this.state.isAdmin === 1 && <NavLink to="/vacations/add-vacation" >add</NavLink>}
                    <span> || </span>
                    {this.state.isAdmin === 1 && <NavLink to="/vacations/chart-vacation" >chart</NavLink>}
                </div>
                {this.state.vacations.map(v => <VacationCard key={v.vacationId} vacation={v} isAdmin={this.state.isAdmin} />)}
            </div>
        );
    }
}

export default VacationList;
