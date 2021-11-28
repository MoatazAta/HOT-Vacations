import "./Header.css";
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import logoImage from "../../../Assets/Images/travelnow.png";
import MenuDrawer from "../MenuDrawer/MenuDrawer";

function Header(): JSX.Element {
    return (
        <div className="Header">
            <AppBar >
                <Toolbar>

                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <img alt="logo" src={logoImage} />
                    </IconButton>

                    <Typography className="brand-header" variant="h6" component="div" sx={{ flexGrow: 2 }}>
                        Tavel-Now
                    </Typography>

                    <MenuDrawer />
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default Header;
