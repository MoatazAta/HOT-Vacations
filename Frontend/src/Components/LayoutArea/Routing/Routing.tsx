import { Redirect, Route, Switch } from "react-router-dom";
import Login from "../../AuthArea/Login/Login";
import Logout from "../../AuthArea/Logout/Logout";
import Register from "../../AuthArea/Register/Register";
import Home from "../../HomeArea/Home/Home";
import AddVacation from "../../AdminVacationArea/AddVacation/AddVacation";
import EditVacation from "../../AdminVacationArea/EditVacation/EditVacation";
import VacationDetails from "../../UserVacationArea/VacationDetails/VacationDetails";
import ShowAdminVacations from "../../AdminVacationArea/ShowAdminVacations/ShowAdminVacations";
import VacationsChart from "../../AdminVacationArea/VacationsChart/VacationsChart";
import { useEffect, useState } from "react";
import UserModel from "../../../Models/UserModel";
import store from "../../../Redux/Store";
import ShowUserVacations from "../../UserVacationArea/ShowUserVacations/ShowUserVacations";


function Routing(): JSX.Element {
    const [user, setUser] = useState<UserModel>(store.getState().authState.user);
    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setUser(store.getState().authState.user);
        });
        return () => unsubscribe();
    }, [user]);
    return (
        <>
            <Switch>
                <Route path="/register" component={Register} exact />
                <Route path="/login" component={Login} exact />
                <Route path="/home" component={Home} exact />
                <Route path="/logout" component={Logout} exact />

                {(user?.isAdmin && (<Route path="/vacations" component={ShowAdminVacations} exact />))
                    || <Route path="/vacations" component={ShowUserVacations} exact />}


                <Route path="/vacations/add-vacation" component={AddVacation} exact></Route>
                <Route path="/vacations/chart-vacation" component={VacationsChart} exact></Route>
                <Route path="/vacations/details/:uuid" component={VacationDetails} exact />
                <Route path="/vacations/edit/:uuid" component={EditVacation} exact></Route>
                {((!user) && (<Redirect from="/" to="/home" exact />)) || <Redirect from="/" to="/vacations" exact />}
            </Switch>
        </>
    );
}

export default Routing;
