import { Component } from "react";
import { RouteComponentProps } from "react-router";
import { NavLink } from "react-router-dom";
import VacationModel from "../../../Models/VacationModel";
import store from "../../../Redux/Store";
import config from "../../../Services/Config";
import notify from "../../../Services/Notify";
import "./VacationDetails.css";
import { Fab, Typography } from "@material-ui/core";


// interface for declaring which parameters we have in the route declaration:
interface RouteParams {
    id: string; // must be string and must be the same parameter name as specified in the route (:id).
}

interface VacationDetailsProps extends RouteComponentProps<RouteParams> {
}

interface VacationDetailsState {
    vacation: VacationModel;
}

class VacationDetails extends Component<VacationDetailsProps, VacationDetailsState> {

    public async componentDidMount() {
        try {
            const id = +this.props.match.params.id;

            const foundVacation = store.getState().vacationState.vacations.find(v => v.vacationId === id);
            this.setState({ vacation: foundVacation });

        } catch (err: any) {
            notify.error(err.message);
        }
    }
    public render(): JSX.Element {
        return (
            <div className="VacationDetails Box">
				{this.state &&
                    <div className="CardContainer">
                        <div className="leftside">
                            <img src={config.vacationImagesUrl + this.state.vacation.picture} />
                        </div>

                        <div className="rightside">
                            <h3>{this.state.vacation.destination}</h3>
                            <h3>Price: ${this.state.vacation.price}</h3>
                            <Typography variant="body2" color="primary">
                                {this.state.vacation.start} to {this.state.vacation.end}
                            </Typography>
                        </div>
                        <br />
                        <NavLink to="/vacations">Back to List</NavLink>
                    </div>
                }
            </div>
        );
    }
}

export default VacationDetails;
