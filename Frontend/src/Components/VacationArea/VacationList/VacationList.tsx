import { Component } from "react";
import VacationModel from "../../../Models/VacationModel";
import store from "../../../Redux/Store";
import VacationCard from "../VacationCard/VacationCard";
import "./VacationList.css";
import { useEffect } from "react";
import notify from "../../../Services/Notify";
import jwtAxios from "../../../Services/jwtAxios";
import { History } from "history";
import Loading from "../../SharedArea/Loading/Loading";
import { VacationActionType } from "../../../Redux/VacationState";
import UserModel from "../../../Models/UserModel";
import { NavLink } from "react-router-dom";
import config from "../../../Services/Config";

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

            if (this.state.vacations.length === 0) {
                const response = await jwtAxios.get<VacationModel[]>(config.vacationsUrl);
                this.setState({ vacations: response.data, isAdmin: this.state.user.isAdmin });
                store.dispatch({ type: VacationActionType.VacationsDownloaded, payload: response.data });
            }
            else {
                this.setState({ isAdmin: this.state.user.isAdmin });
            }
            // this.setState({ vacations: store.getState().vacationState.vacations });

            console.log(this.state.user.userId + " :" + store.getState().authState.vacationSocket);

            store.getState().authState.vacationSocket.socket.on("added-vacation-from-server", addVacation => {
                const allVacations = [...this.state.vacations];
                allVacations.push(addVacation);
                this.setState({ vacations: allVacations });
            });

            store.getState().authState.vacationSocket.socket.on("updated-vacation-from-server", updatedVacation => {
                const allVacations = [...this.state.vacations];
                const indexToUpdate = allVacations.findIndex(v => v.vacationId === updatedVacation.vacationId);
                allVacations[indexToUpdate] = updatedVacation;
                this.setState({ vacations: allVacations });
            });

            store.getState().authState.vacationSocket.socket.on("deleted-vacation-from-server", deletedVacation => {
                const allVacations = [...this.state.vacations];
                const indexToDelete = allVacations.findIndex(v => v.vacationId === deletedVacation);
                allVacations.splice(indexToDelete, 1);
                this.setState({ vacations: allVacations });
            });

        }
        catch (error) {
            alert(error.message);
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
                <h2>Vacations</h2>
                {this.state.vacations.length === 0 && <Loading />}
                <div className="VacationsBar">
                    <p>{this.state.vacations.length} vacations are currently available</p>
                    {/* {this.state.isAdmin === 1 && <NavLink to="/vacations/new/" ></NavLink> }
                    {this.state.isAdmin === 1 && <NavLink to="/vacations-chart" > </NavLink> } */}
                </div>
                {this.state.vacations.map(v => <VacationCard key={v.vacationId} vacation={v} isAdmin={this.state.isAdmin} />)}
            </div>
        );
    }
}

export default VacationList;
