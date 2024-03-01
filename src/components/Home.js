import '../styles/Home.css';
import {Link} from "react-router-dom";

export const Home = () => {

    return (
        <div className="home">
            <h1>Andrisan Thesis</h1>
            <Link to={'/get-started'} className="cta-button">Get Started! </Link>
        </div>
    );
};