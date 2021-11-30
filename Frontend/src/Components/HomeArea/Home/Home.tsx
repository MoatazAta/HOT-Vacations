import { Button, Typography } from "@material-ui/core";
import { useHistory } from "react-router";
import "./Home.css";
import logo from "../../../Assets/Images/welcomeLogo.png";

function Home(): JSX.Element {
    const history = useHistory();
    return (
        <div className="Home Bg">
            <div className="intro">
                <div>
                    <img src={logo} alt="logo" />
                    <Typography gutterBottom variant="h3" color="primary">Welcome To <strong>HOT VACATIONS</strong></Typography>
                    <Typography variant="h6" color="primary">Looking For a Fun Vacation with <strong>Excellent Price</strong></Typography>
                    <br />
                    <Typography variant="body1" color="primary">JOIN US NOW (Please <strong>Login</strong> or <strong>Register</strong>):</Typography>

                </div>
                <div className="intro-nav">
                    <Button variant="contained" onClick={() => history.push("/login")}>
                        Login
                    </Button>
                    <Button variant="contained" onClick={() => history.push("/register")}>
                        Register
                    </Button> 
                </div>
            </div>
        </div>
    );
}

export default Home;
