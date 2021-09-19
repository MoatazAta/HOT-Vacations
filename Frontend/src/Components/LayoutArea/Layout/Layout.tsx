import { Typography } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import AuthMenu from "../../AuthArea/AuthMenu/AuthMenu";
import Routing from "../Routing/Routing";
import "./Layout.css";
import logoImage from "../../../Assets/Images/travelnow.png";

function Layout(): JSX.Element {

    return (
        <div className="Layout">

            <div className="Logo">
                <img alt="" src={logoImage} />
            </div>

            <AuthMenu />

            <Typography variant="h5" align="center" color="primary">Travel Now</Typography>

            <div>
                <NavLink to="/home" exact>Home</NavLink>
                <span> | </span>
                <NavLink to="/vacations" exact>Vacations</NavLink>
            </div>

            <hr />

            <Routing />
        </div>
    );
}

export default Layout;
