import { Component } from "react";
import FollowersModel from "../../../Models/FollowersModel";
import config from "../../../Services/Config";
import jwtAxios from "../../../Services/jwtAxios";
import notify from "../../../Services/Notify";
import "./FollowersCount.css";

interface FollowersCountProps {
    vacationId?: string;
}

interface FollowersCountState {
    followedVacations: FollowersModel[];
}
 
class FollowersCount extends Component<FollowersCountProps, FollowersCountState> {

    public constructor(props: FollowersCountProps) {
        super(props);
        this.state = { followedVacations: [] };
    }

    public async componentDidMount() {
        try {
            const response = await jwtAxios.get<FollowersModel[]>(config.getAllFollowedVacations);
            this.setState({ followedVacations: response.data });
        }
        catch (err) {
            notify.error(err);
        }
    }

    public async componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }

    public render(): JSX.Element {
        return (
            <div className="FollowersCount">
                {this.state.followedVacations.map(f => f.vacationId === this.props.vacationId && <div key={f.vacationId}>{f.followerNumber}</div>)}
            </div>
        );
    }
}

export default FollowersCount;
