import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          Styroform
        </Link>

        <ul className="navbar-links">
          <li>
            <Link to="/FormList" className="navbar-link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/Login" className="navbar-link">
              Account
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
