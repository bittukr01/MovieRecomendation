import { Link } from "react-router-dom";
import "./styles/NavBarStyles.css";

const NavBar = () => {
    return (
        <nav className="nav-container">
            <div className="nav-left">
              
            </div>

            <div className="nav-right">
                <Link to="/" className="nav-btn">
                    <i className="fas fa-home"></i> Home
                </Link>
            </div>
        </nav>
    );
};

export default NavBar;

