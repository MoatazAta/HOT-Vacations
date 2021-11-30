import { Component } from "react";
import { RouteComponentProps } from "react-router";
import { NavLink } from "react-router-dom";
import VacationModel from "../../../Models/VacationModel";
import Loading from "../../SharedArea/Loading/Loading";
import store from "../../../Redux/Store";
import config from "../../../Services/Config";
import notify from "../../../Services/Notify";
import "./VacationDetails.css";
import { Divider, Fab, Typography } from "@material-ui/core";
import DateRangeTwoToneIcon from '@mui/icons-material/DateRangeTwoTone';
import Following from "../../FollowersArea/Following/Following";
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';

interface RouteParams {
    uuid: string;
}

interface VacationDetailsProps extends RouteComponentProps<RouteParams> { }

interface VacationDetailsState {
    vacation: VacationModel;
}

class VacationDetails extends Component<VacationDetailsProps, VacationDetailsState> {
    private isAdmin = store.getState().authState.user.isAdmin;
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
            <div className="VacationDetails Box Bg2">
                {!this.state && <Loading />}
                {this.state && 
                    <div className="CardContainer">
                        <div className="media">
                            <img src={config.vacationImagesURL + this.state.vacation?.picture} alt="vacation" />
                        </div>
                        <div className="vacation-info">
                            <Typography className="text" variant="h4" color="inherit">{this.state.vacation?.destination}</Typography>
                            <Divider />
                            <Typography className="text" variant="body1" align="justify">{this.state.vacation.description}</Typography>
                            <Divider />


                            <Typography className="text" variant="body1" color="primary">
                                <Fab size="small" color="primary" aria-label="date">
                                    <DateRangeTwoToneIcon /></Fab>   From:  {this.state.vacation?.start}
                            </Typography>

                            <Typography className="text" variant="body1" color="primary">
                                <Fab size="small" color="primary" aria-label="date">
                                    <DateRangeTwoToneIcon /></Fab>  To: {this.state.vacation?.end}
                            </Typography>
                            <Typography className="text" variant="h6" color="error">Price: ${this.state.vacation?.price}</Typography>
                            <Divider />
                            <div className="bottomMenu">
                                {this.isAdmin === 1 && <NavLink to={"/vacations/edit/" + this.state.vacation.vacationId}><Fab color="secondary" size="large" aria-label="edit"> <EditOutlinedIcon /></Fab></NavLink>}

                                {/* {this.isAdmin === 1 && <NavLink to={"/vacations/delete/" + this.state.vacation.vacationId} ><Fab size="small" color="primary" aria-label="delete" onClick={() => deleteVacation()}> <Delete /> </Fab></NavLink>} */}

                                {this.isAdmin === 0 && <Following vacationId={this.state.vacation.vacationId}></Following>}
                                <NavLink className="back" to="/vacations" exact>Back</NavLink>

                            </div>
                        </div>

                    </div>
                }
            </div>);
    }
}

export default VacationDetails;
