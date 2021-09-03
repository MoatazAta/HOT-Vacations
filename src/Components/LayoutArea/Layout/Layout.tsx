import { NavLink } from "react-router-dom";
import AuthMenu from "../../AuthArea/AuthMenu/AuthMenu";
import Routing from "../Routing/Routing";
import "./Layout.css";

function Layout(): JSX.Element {
    return (
            <div className="Layout">
                <h1>Enjoy Your Vacation </h1>
                <AuthMenu />
                <NavLink to="/vacations" exact>Vacations</NavLink>
                <span> | </span>
                <NavLink to="/vacations/add-vacation" exact>Add Vacation</NavLink>

                <hr />

                <Routing />
            </div>
    );
}

export default Layout;
