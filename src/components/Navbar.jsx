import React from "react";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "../App.css";
import "./Navbar.css";

export default function Navbar(props) {
    let Logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location = "/login";
    };

    return (
        <div className="col-lg-12 bg-white sidebar ms-4 mb-4 row">
            <img src="../assets/logo_inap_management.png" alt="" width="50%" className="logo mx-auto"/>
            <ul className="nav-list">
                <li>
                    <Link id="dashboard-officer" to="/management" className="nav-link button">
                        <i className="bx bx-grid-alt"></i>
                        <span className="links_name ms-2">Dashboard</span>
                    </Link>
                </li>
                <li>
                    <Link id="room" to="/management/room" className="nav-link button">
                        <i className="bx bx-user"></i>
                        <span className="links_name ms-2">Room</span>
                    </Link>
                </li>
                <li>
                    <Link id="room-type" to="/management/room-type" className="nav-link button">
                        <i className="bx bx-chat"></i>
                        <span className="links_name ms-2">Room Type</span>
                    </Link>
                </li>
                <li>
                    <Link id="booking" to="/management/booking" className="nav-link button">
                        <i className="bx bx-pie-chart-alt-2"></i>
                        <span className="links_name ms-2">Booking</span>
                    </Link>
                </li>
            </ul>
            <div>
              <h6 className="text-secondary textCopyright text-center mb-3 mt-3">©️ novalarama's web</h6>
            </div>
        </div>
    );
}
