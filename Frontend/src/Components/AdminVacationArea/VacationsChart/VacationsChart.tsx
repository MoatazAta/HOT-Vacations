import { Component } from "react";
import FollowersModel from "../../../Models/FollowersModel";
import store from "../../../Redux/Store";
import config from "../../../Services/Config";
import jwtAxios from "../../../Services/jwtAxios";
import notify from "../../../Services/Notify";
import "./VacationsChart.css";

import { VictoryBar, VictoryChart, VictoryAxis } from 'victory';

interface VacationsChartProps {
    history: History;
}

interface VacationsChartState {
    followers: FollowersModel[];
    info: any;
}

class VacationsChart extends Component<VacationsChartProps, VacationsChartState> {

    public constructor(props: VacationsChartProps) {
        super(props);
        this.state = { followers: [], info: [] };
    }

    public async componentDidMount() {
        try {
            if (!store.getState().authState.user) {
                notify.error("You are not logged-in");
                return;
            }

            if (this.state.followers.length === 0) {
                const response = await jwtAxios.get<FollowersModel[]>(config.getAllFollowedVacations);
                this.setState({ followers: response.data });

                this.state.followers.forEach(async v => {
                    let data = { "quarter": v.destination, "earnings": v.followerNumber }
                    this.state.info.push(data);
                })
                this.setState({ info: this.state.info });
            }
        }
        catch (error) {
            notify.error(error);
        }
    }

    public render(): JSX.Element {
        return (
            <div className="VacationsChart Box">
                <VictoryChart
                    // domainPadding will add space to each side of VictoryBar to
                    // prevent it from overlapping the axis
                    domainPadding={25}
                >
                    <VictoryAxis
                        // tickValues specifies both the number of ticks and where
                        // they are placed on the axis
                        tickValues={[1, 2, 3, 4]}
                        tickFormat={this.state.info.quarter}
                    />
                    <VictoryAxis
                        dependentAxis
                        // tickFormat specifies how ticks should be displayed
                        tickFormat={(x) => (`${x}`)}
                    />
                    <VictoryBar
                        data={this.state.info}
                        x="quarter"
                        y="earnings"
                    />
                </VictoryChart>
            </div>
        );
    }
}

export default VacationsChart;
