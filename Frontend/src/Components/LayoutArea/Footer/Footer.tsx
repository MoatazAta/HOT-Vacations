import "./Footer.css";

function Footer(): JSX.Element {
    const getYear = () => new Date().getFullYear();

    return (
        <div className="Footer">
			      <p>All rights reserved to HOT-VACATIONS | {getYear()} ©</p>
        </div>
    );
}

export default Footer;  
