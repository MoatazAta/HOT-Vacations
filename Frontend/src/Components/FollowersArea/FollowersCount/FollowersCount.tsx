import { Component } from "react";
import FollowersModel from "../../../Models/FollowersModel";
import config from "../../../Services/Config";
import jwtAxios from "../../../Services/jwtAxios";
import notify from "../../../Services/Notify";

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

        } catch (err: any) {
            notify.error(err);
        }
    }


    public render(): JSX.Element {
        return (
            <>
                {this.state.followedVacations.map(f => f.vacationId === this.props.vacationId && <span key={f.vacationId}>{f.followerNumber} liked</span>)}
            </>
        );
    }
}

export default FollowersCount;
