import "./MenuDrawer.css";
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import FlightTakeoffOutlinedIcon from '@mui/icons-material/FlightTakeoffOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import OutboxIcon from '@mui/icons-material/Outbox';
import { NavLink } from "react-router-dom";
import { Fab, Typography } from "@material-ui/core";
import store from "../../../Redux/Store";

type Anchor = 'right';

function MenuDrawer(): JSX.Element {
    const [state, setState] = React.useState({
        right: false,
    });
    const isAdmin = store.getState().authState.user.isAdmin;

    const toggleDrawer =
        (anchor: Anchor, open: boolean) =>
            (event: React.KeyboardEvent | React.MouseEvent) => {
                if (
                    event.type === 'keydown' &&
                    ((event as React.KeyboardEvent).key === 'Tab' ||
                        (event as React.KeyboardEvent).key === 'Shift')
                ) {
                    return;
                } 

                setState({ ...state, [anchor]: open });
            };

    const list = (anchor: Anchor) => (
        <Box
            sx={{ width: 300 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>
                <Typography variant="h5" color="primary" align="center">Hello {store.getState().authState.user.firstName}</Typography>
                <Typography variant="subtitle1" color="inherit" align="center">Your Menu</Typography>
            </List>
            <Divider />
            <List>
                <NavLink className="nav-menu" activeClassName="active" to="/vacations" exact>
                    <ListItem button>
                        <ListItemIcon>
                            <FlightTakeoffOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary="Vacations" />
                    </ListItem>
                </NavLink>
 
                {isAdmin === 1 && <NavLink className="nav-menu" to="/vacations/add-vacation" exact>
                    <ListItem button>
                        <ListItemIcon>
                            <AddCircleOutlineOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary="Add Vacation" />
                    </ListItem>
                </NavLink>}

                {isAdmin === 1 && <NavLink className="nav-menu" to="/vacations/chart-vacation" exact>
                    <ListItem button>
                        <ListItemIcon>
                            <InsertChartOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary="Chart" />
                    </ListItem>
                </NavLink>}

            </List>
            <Divider />
            <List>
                {isAdmin === 0 && <NavLink className="nav-menu" to="/contact-us" exact>

                    <ListItem button key="1">
                        <ListItemIcon>
                            <OutboxIcon />
                        </ListItemIcon>
                        <ListItemText primary="Contact us" />
                    </ListItem>
                </NavLink>}

                <NavLink className="nav-menu" to="/logout" exact>
                    <ListItem button key="2">
                        <ListItemIcon>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItem>
                </NavLink>

            </List>
        </Box>
    );
    return (
        <>
            {(['right'] as const).map((anchor) => (
                <React.Fragment key={anchor}>

                    <Fab size="large" variant="extended" color="primary" aria-label="menu" className="menu" onClick={toggleDrawer(anchor, true)}> <MenuOpenIcon />OPEN MENU </Fab>
                    <Drawer
                        anchor={anchor}
                        open={state[anchor]}
                        onClose={toggleDrawer(anchor, false)}
                    >
                        {list(anchor)}
                    </Drawer>
                </React.Fragment>
            ))}
        </>
    );
}

export default MenuDrawer;
