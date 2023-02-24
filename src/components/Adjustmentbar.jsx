import React from "react";
import {Link} from "react-router-dom";
import "../App.css";

export default function Adjustmentbar() {
    let user = localStorage.getItem(`data_user`);

    let Logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("user_role");
        localStorage.removeItem("data_user");
        window.location = "/login";
    };

    return (
        <div className="col-lg-12 cardContent row">
            <div className="m-4">
                <div className="col-lg-4">
                    {/* <img src={`http://localhost:8080/assets/image/${user.user_photo}`} alt="" />
                    <h5>{user.user_name}</h5>
                    <h5>dddjrrn</h5> */}
                    <button type="button" className="btn btn-danger" onClick={() => Logout()}>
                        Log out
                    </button>
                </div>
            </div>
        </div>
    );
}
