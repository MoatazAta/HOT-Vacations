import "./Loading.css";
import loading from "../../../Assets/Images/loading1.gif";

function Loading(): JSX.Element {
    return (
        <div className="Loading">
			<img alt="" src={loading} />
        </div>
    );
}

export default Loading;
