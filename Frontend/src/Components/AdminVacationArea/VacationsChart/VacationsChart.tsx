import React, { Component } from "react";
import FollowersModel from "../../../Models/FollowersModel";
import store from "../../../Redux/Store";
import config from "../../../Services/Config";
import jwtAxios from "../../../Services/jwtAxios";
import notify from "../../../Services/Notify";
import "./VacationsChart.css";
import { Paper, Typography } from "@material-ui/core";
import { VictoryBar, VictoryChart, VictoryAxis } from 'victory';


interface VacationsChartProps {
    history: History;
}

interface VacationsChartState {
    followedVacations: FollowersModel[];
    info: any;
}

class VacationsChart extends Component<VacationsChartProps, VacationsChartState> {

    public constructor(props: VacationsChartProps) {
        super(props);
        this.state = { followedVacations: [], info: [] };
    }

    public async componentDidMount() {
        try {
            if (!store.getState().authState.user) {
                notify.error("You are not logged-in");
                return;
            }
            else if (!store.getState().authState.user.isAdmin) {
                notify.error("You are not authorized to enter here!");
                return;
            }

            const response = await jwtAxios.get<FollowersModel[]>(config.getAllFollowedVacations);
            this.setState({ followedVacations: response.data });

            this.state.followedVacations.forEach(async v => {
                let data = { "quarter": v.destination, "earnings": v.followerNumber }
                this.state.info.push(data);
            })
            this.setState({ info: this.state.info });
        }
        catch (error) {
            notify.error(error);
        }
    }

    public render(): JSX.Element {
        return (
            <div className="VacationsChart Bg">
                <React.StrictMode>
                    <Paper variant="elevation" className="chart-container">
                    <Typography variant="h5" color="primary" align="center">Followed Vacations</Typography>

                        <VictoryChart

                            domainPadding={25}
                        >
                            <VictoryAxis
                                tickValues={[1, 2, 3, 4]}
                                tickFormat={this.state.info.quarter}
                            />
                            <VictoryAxis
                                dependentAxis
                                tickFormat={(x) => (`${x}`)}
                            />
                            <VictoryBar
                                data={this.state.info}
                                x="quarter"
                                y="earnings"
                            />
                        </VictoryChart>
                    </Paper>
                </React.StrictMode>

            </div>
        );
    }
}

export default VacationsChart;
