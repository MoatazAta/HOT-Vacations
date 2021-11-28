import { Component } from "react";
import FollowersModel from "../../../Models/FollowersModel";
import config from "../../../Services/Config";
import jwtAxios from "../../../Services/jwtAxios";
import notify from "../../../Services/Notify";
import "./Following.css";
import { FavoriteBorder, FavoriteSharp } from "@material-ui/icons";
import { Fab } from "@material-ui/core";
import store from "../../../Redux/Store";

interface FollowingProps {
    vacationId?: string;
}

interface FollowingState {
    isFollow: boolean;
    userId: string;
}

class Following extends Component<FollowingProps, FollowingState> {

    public constructor(props: FollowingProps) {
        super(props);
        this.state = { isFollow: false, userId: store.getState().authState.user.userId };
    }

    public async componentDidMount() {
        try {
            const response = await jwtAxios.get<FollowersModel[]>(config.followersURL + this.state.userId + "/" + this.props.vacationId);
            if (response.data) {
                this.setState({ isFollow: true });
            }
        }
        catch (err) {
            notify.error(err);
        }
    }

    public followVacation = async (vacationId: string, userId: string) => {
        console.log(config.followersURL)
        await jwtAxios.post(config.followersURL, { userId, vacationId, });
        notify.success("Following vacation");
    }

    public unFollowVacation = async (vacationId: string, userId: string) => {
        await jwtAxios.delete(config.followersURL + userId + "/" + vacationId);
        notify.success("UnFollowing vacation");
    }

    public isFollowingVacation = (vacationId: string, userId: string) => {
        console.log("isFollow: ", this.state.isFollow);
        this.setState({ isFollow: !this.state.isFollow });
        if (!this.state.isFollow) {
            console.log("follow");
            this.followVacation(vacationId, userId);
        }
        else {
            console.log("unfollow");

            this.unFollowVacation(vacationId, userId);

        }
    }

    public render(): JSX.Element {
        return (
            <div className="Following">
                <div onClick={(e) => this.isFollowingVacation(this.props.vacationId, this.state.userId)}>
                    {this.state.isFollow === false && <Fab size="small" color="primary" aria-label="follow"  > {<FavoriteBorder />}</Fab>}
                    {this.state.isFollow === true && <Fab size="small" color="primary" aria-label="unFollow" > {<FavoriteSharp />}</Fab>}
                </div>
            </div>

        );
    }
}

export default Following;
