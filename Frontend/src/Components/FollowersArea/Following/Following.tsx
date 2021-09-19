import { Component } from "react";
import FollowersModel from "../../../Models/FollowersModel";
import config from "../../../Services/Config";
import jwtAxios from "../../../Services/jwtAxios";
import notify from "../../../Services/Notify";
import "./Following.css";
import { FavoriteBorder, FavoriteSharp } from "@material-ui/icons";
import { Fab } from "@material-ui/core";

interface FollowingProps {
    vacationId?: number;
    userId?: number;
}

interface FollowingState {
    isFollow: boolean;
}

class Following extends Component<FollowingProps, FollowingState> {

    public constructor(props: FollowingProps) {
        super(props);
        this.state = { isFollow: false };
    }

    public async componentDidMount() {
        try {
            const response = await jwtAxios.get<FollowersModel[]>(config.followersUrl + this.props.userId + "/" + this.props.vacationId);
            if (response.data) {
                this.setState({ isFollow: true });
            }
        }
        catch (err) {
            notify.error(err);
        }
    }

    public followVacation = async () => {
        await jwtAxios.post(config.followersUrl + this.props.userId + "/" + this.props.vacationId);
        notify.success("Following vacation.")
    }

    public unFollowVacation = async () => {
        await jwtAxios.delete(config.followersUrl + this.props.userId + "/" + this.props.vacationId);
        notify.success("UnFollowing vacation.")
    }

    public isFollowingVacation = async () => {
        await this.setState({ isFollow: !this.state.isFollow });
        if (this.state.isFollow) {
            this.followVacation();
        }
        else {
            this.unFollowVacation();
        }
    }

    public render(): JSX.Element {
        return (
            <div className="Following">
                <div onClick={this.isFollowingVacation}>
                    {this.state.isFollow === false && <Fab size="small" color="inherit" aria-label="follow"  > {<FavoriteBorder />}</Fab>}
                    {this.state.isFollow === true && <Fab size="small" color="inherit" aria-label="unFollow" > {<FavoriteSharp />}</Fab>}
                </div>
            </div>

        );
    }
}

export default Following;
