import "./Navbar.css";
import { Link, useLocation } from "react-router-dom";

import { apiUrl } from "../../utils/api";

const Navbar = () => {
  const location = useLocation();
  const isFormListPage = location.pathname === "/FormList";

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/FormList" className="navbar-brand">
          Styroform
        </Link>

        <ul className="navbar-links">
          <li>
            <Link to="/FormList" className="navbar-link">
              Home
            </Link>
          </li>
          {isFormListPage && (
            <li>
              <Link to="/CreateForm" className="navbar-link">
                Create Form
              </Link>
            </li>
          )}
          <li>
            <Link to="/AccountPreview" className="navbar-link">
              Account
            </Link>
          </li>
          {isFormListPage && (
            <li>
              <a href={apiUrl("/accounts/logout/")} className="navbar-link">
                Logout
              </a>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
