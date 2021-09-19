import { Typography } from "@material-ui/core";
import "./Home.css";

function Home(): JSX.Element {
    return (
        <div className="Home">
            <Typography variant="h5" color="primary">Welcome To Travel Now</Typography>
            <br />
            <Typography variant="body1">Traveling is fun and you can do it without breaking the bank — you just have to know where to go online first.</Typography>
        </div>
    );
}

export default Home;
