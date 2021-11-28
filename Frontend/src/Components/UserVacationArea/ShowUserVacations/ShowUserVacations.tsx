import { Component } from "react";
import VacationModel from "../../../Models/VacationModel";
import store from "../../../Redux/Store";
import VacationCard from "../../UserVacationArea/VacationCard/VacationCard";
import "./ShowUserVacations.css";
import notify from "../../../Services/Notify";
import jwtAxios from "../../../Services/jwtAxios";
import { History } from "history";
import { VacationActionType } from "../../../Redux/VacationState";
import UserModel from "../../../Models/UserModel";
import config from "../../../Services/Config";
import { AuthActionType } from "../../../Redux/AuthState";
import socketService from "../../../Services/socketService";
import sortVacations from "../../../Helpers/SortVacations";
import { Unsubscribe } from "redux";

interface ShowUserVacationsState {
    vacations: VacationModel[];
    isAdmin: number;
    user: UserModel;
}

interface VacationsListProps {
    history: History;
}


class ShowUserVacations extends Component<VacationsListProps, ShowUserVacationsState> {

    private unsubscribeMe: Unsubscribe;

    // socket io functions for handling the events
    vacationHasBeenAdded(vacation: VacationModel) {
        store.dispatch({
            type: VacationActionType.VacationAdded,
            payload: vacation,
        });
    };
    vacationHasBeenUpdated(vacation: VacationModel) {
        store.dispatch({
            type: VacationActionType.VacationUpdated,
            payload: vacation,
        });
    };
    vacationHasBeenDeleted(vacationId: string) {
        store.dispatch({
            type: VacationActionType.VacationDeleted,
            payload: vacationId,
        });
    };

    public constructor(props: VacationsListProps) {
        super(props);
        this.state = { vacations: [], isAdmin: 0, user: store.getState().authState.user };
    }

    public async componentDidMount() {
        try {
            if (!store.getState().authState.user) {
                notify.error("You are not logged-in");
                return this.props.history.replace("/login");
            }

            if (store.getState().vacationState.vacations.length === 0) {
                const response = await jwtAxios.get<VacationModel[]>(config.vacationsURL);
                const sortedVacations = await sortVacations(response.data);
                store.dispatch({ type: VacationActionType.VacationsDownloaded, payload: sortedVacations });
            }

            this.setState({ vacations: store.getState().vacationState.vacations, isAdmin: this.state.user.isAdmin });

            // establishing a connection with the server
            if (!socketService.isConnected()) {
                socketService.connect();
                // listening to add vacation event
                socketService.vacationAdded(this.vacationHasBeenAdded);
                // listening to delete vacation event
                socketService.vacationDeleted(this.vacationHasBeenDeleted);
                // listening to update vacation event
                socketService.vacationUpdated(this.vacationHasBeenUpdated);
            }

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
            <div className="ShowUserVacations">

                {this.state.vacations.length === 0 && <span>There are no vacations!</span>}
                {this.state.vacations.map(v => <VacationCard key={v.vacationId} vacation={v} isAdmin={this.state.isAdmin} />)}

            </div>
        );
    }
}

export default ShowUserVacations;
