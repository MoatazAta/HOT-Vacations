import { Redirect, Route } from "react-router-dom";
import Login from "../../AuthArea/Login/Login";
import Logout from "../../AuthArea/Logout/Logout";
import Register from "../../AuthArea/Register/Register";
import AddVacation from "../../VacationArea/AddVacation/AddVacation";
import EditVacation from "../../VacationArea/EditVacation/EditVacation";
import VacationList from "../../VacationArea/VacationList/VacationList";

function Routing(): JSX.Element {
    return (
        <div className="Routing">
			<Route path="/register" component={Register} exact />
            <Route path="/login" component={Login} exact />
            <Route path="/logout" component={Logout} exact />
            <Route path="/vacations/add-vacation" component={AddVacation} exact></Route>
            <Route path="/vacations" component={VacationList} exact></Route>
            <Route path="/vacations/edit/:id" component={EditVacation} exact></Route>
            <Redirect from="/" to="/home" exact />
        </div>
    );
}

export default Routing;
