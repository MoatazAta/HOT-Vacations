import { Component } from "react";
import { RouteComponentProps } from "react-router";
import { NavLink } from "react-router-dom";
import VacationModel from "../../../Models/VacationModel";
import Loading from "../../SharedArea/Loading/Loading";
import store from "../../../Redux/Store";
import config from "../../../Services/Config";
import notify from "../../../Services/Notify";
import "./VacationDetails.css";
import { Divider, Typography } from "@material-ui/core";


interface RouteParams {
    uuid: string;
}
interface VacationDetailsProps extends RouteComponentProps<RouteParams> { }

interface VacationDetailsState {
    vacation: VacationModel;
}

class VacationDetails extends Component<VacationDetailsProps, VacationDetailsState> {

    public async componentDidMount() {
        try {
            const id = this.props.match.params.uuid;
            const currentVacation = store.getState().vacationState.vacations.find(v => v.vacationId === id);
            this.setState({ vacation: currentVacation });

        } catch (err: any) {
            notify.error(err.message);
        }
    }
    public render(): JSX.Element {
        return (
            <div className="VacationDetails Box">
                <NavLink to="/vacations" exact>Back to List</NavLink>
                {!this.state && <Loading />}
                {this.state &&
                    <div className="CardContainer">
                        <div className="media">
                            <img src={config.vacationImagesURL + this.state.vacation?.picture} alt="vacation" />
                        </div>
                        <div className="vacation-info">
                            <Typography variant="h4" color="inherit">{this.state.vacation?.destination}</Typography>
                            <Divider />
                            <Typography  variant="body1" align="justify">{this.state.vacation.description}</Typography>
                            <Divider />


                            <Typography variant="subtitle1" color="inherit">
                                From:  {this.state.vacation?.start}
                            </Typography>
                            <Typography variant="subtitle2" color="inherit">
                                To: {this.state.vacation?.end}
                            </Typography>
                            <Typography variant="h6" color="inherit">Price: ${this.state.vacation?.price}</Typography>

                        </div>
                    </div>
                }
            </div>);
    }
}

export default VacationDetails;
