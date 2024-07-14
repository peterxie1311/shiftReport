import { FC } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

interface WitronProps {}

const Header: FC<WitronProps> = ({}) => {
  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="#">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/5d/Witron_Logo.svg"
              height="30"
              alt="Witron Logo"
            />
          </a>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <a className="nav-link" href="www.google.com">
                  Incident Report
                </a>
              </li>
              {/* Add more items as needed */}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
