import { Redirect, Route } from "react-router-dom";
import Login from "../../AuthArea/Login/Login";
import Logout from "../../AuthArea/Logout/Logout";
import Register from "../../AuthArea/Register/Register";
import Home from "../../HomeArea/Home/Home";
import AddVacation from "../../VacationArea/AddVacation/AddVacation";
import EditVacation from "../../VacationArea/EditVacation/EditVacation";
import VacationDetails from "../../VacationArea/VacationDetails/VacationDetails";
import VacationList from "../../VacationArea/VacationList/VacationList";
import VacationsChart from "../../VacationArea/VacationsChart/VacationsChart";

function Routing(): JSX.Element {
    return (
        <div className="Routing">
			<Route path="/register" component={Register} exact />
            <Route path="/login" component={Login} exact />
            <Route path="/home" component={Home} exact />
            <Route path="/logout" component={Logout} exact />
            <Route path="/vacations/add-vacation" component={AddVacation} exact></Route>
            <Route path="/vacations/chart-vacation" component={VacationsChart} exact></Route>
            <Route path="/vacations/details/:id([0-9]+)" component={VacationDetails} exact />
            <Route path="/vacations" component={VacationList} exact></Route>
            <Route path="/vacations/edit/:id" component={EditVacation} exact></Route>
            <Redirect from="/" to="/home" exact />
        </div>
    );
}

export default Routing;
