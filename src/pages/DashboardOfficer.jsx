import { useState, useEffect } from "react";
import { Toast } from "bootstrap";
import axios from "axios";
import Navbar from "../components/Navbar";
import Adjustmentbar from "../components/Adjustmentbar";

export default function DashboardHotel() {
  if (!localStorage.getItem(`token`)) {
    window.location = `./login`;
  }

  let [bookedRooms, setBookedRooms] = useState([]);
  let [message, setMessage] = useState("");

  let token = localStorage.getItem(`token`);
  let authorization = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  let showToast = (message) => {
    let myToast = new Toast(document.getElementById(`myToast`), {
      autohide: true,
    });
    setMessage(message);
    myToast.show();
  };

  let getBookedRoomsData = (date) => {
    let endpoint = `http://localhost:8080/room/booked-room`;
    let request = {
      today_date: date,
    };
    axios
      .post(endpoint, request, authorization)
      .then((response) => {
        setBookedRooms(response.data.unavailableRoomByType);
      })
      .catch(() => showToast("Failed to Get Data"));
  };

  useEffect(() => {
    let today = new Date().toISOString().substring(0, 10);
    getBookedRoomsData(today);
  }, []);

  return (
    <div className="row col-lg-12">
      {/* start component toast untuk menggantikan alert*/}
      <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1 }}>
        <div className="toast bg-light" id="myToast">
          <div className="toast-header bg-info text-white">
            <strong>Message</strong>
          </div>
          <div className="toast-body">{message}</div>
        </div>
      </div>
      <div className="col-lg-2 mt-4">
        <Navbar />
      </div>
      <div className="col-lg-7 mt-4">
        <div className="ms-4 me-2 cardContent">
          <div className="p-4">
            <h1 className="fw-bold">Welcome, Noval!</h1>
            <h5 className="mb-4">You have some guest right now</h5>
            <div className="col-md-12 row mb-4">
              {bookedRooms
                .filter((item, index) => index < 2)
                .map((item, index) => (
                  <div className="col-md-6">
                    <div className={index === 0 ? "cardC1 p-4" : "cardC2 p-4"}>
                      <p className="textC2 fw-bold text-center">
                        {item.room_count}
                      </p>
                      <h5 className="text-center">
                        {item.room_type_name}'s Room Guest
                      </h5>
                    </div>
                  </div>
                ))}
            </div>
            <div className="col-md-12 row mb-4">
              {bookedRooms
                .filter((item, index) => index >= 2 && index <= 3)
                .map((item, index) => (
                  <div className="col-md-6">
                    <div className={index === 0 ? "cardC3 p-4" : "cardC4 p-4"}>
                      <p className="textC2 fw-bold text-center">
                        {item.room_count}
                      </p>
                      <h5 className="text-center">
                        {item.room_type_name}'s Room Guests
                      </h5>
                    </div>
                  </div>
                ))}
            </div>
            <div className="col-md-12 row">
              {bookedRooms
                .filter((item, index) => index > 3 && index < 7)
                .map((item, index) => (
                  <div className="col-md-4">
                    <div
                      className={
                        index === 0
                          ? "cardC5 p-4"
                          : index === 2
                          ? "cardC6 p-4"
                          : "cardC7 p-4"
                      }
                    >
                      <p className="textC2 fw-bold text-center">
                        {item.room_count}
                      </p>
                      <h5 className="text-center">
                        {item.room_type_name}'s Room Guests
                      </h5>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-3 mt-4">
        <Adjustmentbar />
      </div>
    </div>
  );
}
