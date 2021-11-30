import "./Header.css";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import logoImage from "../../../Assets/Images/logo-trans.png";
import MenuDrawer from "../MenuDrawer/MenuDrawer";

function Header(): JSX.Element {
    return (
        <div className="Header">
            <AppBar color="default">
                <Toolbar>
                    <img alt="logo" src={logoImage} />
                    <Typography className="brand-header" variant="h6" component="div" sx={{ flexGrow: 2 }}>
                    </Typography>
                    <MenuDrawer />
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default Header;
