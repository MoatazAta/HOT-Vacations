import { Component } from "react";
import VacationModel from "../../../Models/VacationModel";
import store from "../../../Redux/Store";
import VacationCard from "../../UserVacationArea/VacationCard/VacationCard";
import "./ShowAdminVacations.css";
import notify from "../../../Services/Notify";
import jwtAxios from "../../../Services/jwtAxios";
import { History } from "history";
import { VacationActionType } from "../../../Redux/VacationState";
import UserModel from "../../../Models/UserModel";
import config from "../../../Services/Config";
import { AuthActionType } from "../../../Redux/AuthState";
import socketService from "../../../Services/socketService";
import { Unsubscribe } from "redux";

interface ShowAdminVacationsState {
    vacations: VacationModel[];
    isAdmin: number;
    isFollow: boolean;
    user: UserModel;
}

interface VacationsListProps {
    history: History;
} 


class ShowAdminVacations extends Component<VacationsListProps, ShowAdminVacationsState> {

    private unsubscribeMe: Unsubscribe;


    public constructor(props: VacationsListProps) {
        super(props);
        this.state = { vacations: [], isAdmin: 0, isFollow: false, user: store.getState().authState.user };
    }

    public async componentDidMount() {
        try {
            if (!store.getState().authState.user) {
                notify.error("You are not logged-in");

                return this.props.history.replace("/login");
            }

            if (!store.getState().authState.user.isAdmin) {
                notify.error("You are not authorized!");
                return this.props.history.replace("/");
            }

            if (!socketService.isConnected()) {
                socketService.connect();
            }

            if (store.getState().vacationState.vacations.length === 0) {
                const response = await jwtAxios.get<VacationModel[]>(config.vacationsURL);
                // const sortedVacations = await sortVacations(response.data);
                store.dispatch({ type: VacationActionType.VacationsDownloaded, payload: response.data });
            }

            this.setState({ vacations: store.getState().vacationState.vacations, isAdmin: this.state.user.isAdmin });

            this.unsubscribeMe = store.subscribe(() => {
                this.setState({ vacations: store.getState().vacationState.vacations });
            });
        }
        catch (err: any) {
            if (err.response.status === 401) {
                return this.props.history.replace("/");
            }
            else if (err.response.status === 403) {
                store.dispatch({ type: AuthActionType.UserLoggedOut, });
                return this.props.history.replace("/login");
            }
            notify.error(err);
        }
    }

    
    public componentWillUnmount(): void {
        this.unsubscribeMe();
    }

    public render(): JSX.Element {
        return (
            <div className="ShowAdminVacations">

                {this.state.vacations.length === 0 && <span>There are no vacations!</span>}
                {this.state.vacations.map(v => <VacationCard key={v.vacationId} vacation={v} isAdmin={this.state.isAdmin} />)}

            </div>
        );
    }
}

export default ShowAdminVacations;
