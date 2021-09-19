import "./Loading.css";
import loading from "../../../Assets/Images/MEBIB.gif";

function Loading(): JSX.Element {
    return (
        <div className="Loading">
			<img alt="" src={loading} />
        </div>
    );
}

export default Loading;
