import "./Loading.css";
import loading from "../../../Assets/Images/loading.gif";

function Loading(): JSX.Element {
    return (
        <div className="Loading">
			<img src={loading} />
        </div>
    );
}

export default Loading;
