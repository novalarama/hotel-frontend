import { useState, useEffect } from "react";
import { Modal, Toast } from "bootstrap";
import axios from "axios";
import moment from "moment";
import Navbar from "../components/Navbar";

export default function BookingData() {
  if (!localStorage.getItem(`token`)) {
    window.location = `./login`;
  }

  let [bookingsData, setBookingsData] = useState([]);
  let [bookingId, setBookingId] = useState(0);
  let [bookingNumber, setBookingNumber] = useState(0);
  let [bookingName, setBookingName] = useState();
  let [bookingEmail, setBookingEmail] = useState();
  let [bookingDate, setBookingDate] = useState();
  let [bookingCheckInDate, setBookingCheckInDate] = useState();
  let [bookingCheckOutDate, setBookingCheckOutDate] = useState();
  let [bookingGuestName, setBookingGuestName] = useState();
  let [bookingNumberOfRooms, setBookingNumberOfRooms] = useState(0);
  let [roomTypeId, setRoomTypeId] = useState(0);
  let [bookingStatus, setBookingStatus] = useState();
  let [userId, setUserId] = useState(0);

  let [bookingNameSelected, setBookingNameSelected] = useState("");
  let [bookingCheckInDateSelected, setBookingCheckInDateSelected] =
    useState("");
  let [statusRadio, setStatusRadio] = useState("");

  let [action, setAction] = useState();
  let [message, setMessage] = useState();
  let [modal, setModal] = useState(null);
  let [modalDetail, setModalDetail] = useState(null);
  let [modalDate, setModalDate] = useState(null);

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

  let getBookingsData = (bookingNameSelected, bookingCheckInDateSelected) => {
    let endpoint = `http://localhost:8080/booking?booking_name=${bookingNameSelected}&booking_check_in_date=${bookingCheckInDateSelected}`;

    axios
      .get(endpoint, authorization)
      .then((result) => {
        setBookingsData(result.data.data);
        showToast("Success to Get Booking Data");
      })
      .catch(() => {
        showToast("Failed to Get Booking Data");
      });
  };

  let editBookingData = (item) => {
    modal.show();

    setBookingId(item.booking_id);
    setBookingNumber(item.booking_number);
    setBookingName(item.booking_name);
    setBookingStatus(item.booking_status);
    setUserId(item.user_id);
  };

  let detailBookingData = (item) => {
    modalDetail.show();
    setBookingId(item.booking_id);
    setBookingNumber(item.booking_number);
    setBookingName(item.booking_name);
    setBookingEmail(item.booking_email);
    setBookingDate(item.booking_date);
    setBookingCheckInDate(item.booking_check_in_date);
    setBookingCheckOutDate(item.booking_check_out_date);
    setBookingGuestName(item.booking_guest_name);
    setBookingNumberOfRooms(item.booking_number_of_rooms);
    setRoomTypeId(item.room_type_id);
    setBookingStatus(item.booking_status);
    setUserId(item.user_id);
  };

  let deleteBookingData = (bookingId) => {
    if (window.confirm(`Are you sure want to delete this data ?`)) {
      let endpoint = `http://localhost:8080/booking/${bookingId}`;

      axios
        .delete(endpoint, authorization)
        .then((response) => {
          showToast(response.data.message);
          getBookingsData();
        })
        .catch(() => {
          showToast("Failed to delete data");
          getBookingsData();
        });
    }
  };

  let updateBookingStatus = (event) => {
    event.preventDefault();
    let endpoint = `http://localhost:8080/booking/${bookingId}`;
    let request = {
      booking_status: bookingStatus,
    };

    axios
      .put(endpoint, request, authorization)
      .then((response) => {
        showToast("Success to Change Booking Status");
        modal.hide();
        getBookingsData();
      })
      .catch((error) => {
        showToast("Failed to Change Booking Status");
        modal.hide();
        getBookingsData();
      });
  };

  let handleFilterChange = (event) => {
    let filterType = event.target.value;
    if (filterType !== "clean-filter") {
      setBookingCheckInDateSelected(filterType);
    } else {
      setBookingCheckInDateSelected("");
    }
  };

  useEffect(() => {
    let modal = new Modal(document.getElementById(`modal`));
    let modalDetail = new Modal(document.getElementById(`modal-detail`));
    let modalDate = new Modal(document.getElementById(`modal-date`));
    setModal(modal);
    setModalDetail(modalDetail);
    setModalDate(modalDate);
    getBookingsData(bookingNameSelected, bookingCheckInDateSelected);
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
            <div className="row col-md-12">
              <div className="col-md-8">
                <h1 className="fw-bold">Booking List</h1>
                <h5 className="mb-4">This is booking list data of hotel</h5>
              </div>
              <div class=" mb-4 col-md-4 d-flex align-items-center">
                <div class="input-group md-form form-sm form-2 pl-0">
                  <input
                    class="form-control my-0 py-1 amber-border"
                    type="text"
                    placeholder="Search"
                    aria-label="Search"
                    onChange={(ev) => {
                      setBookingNameSelected(ev.target.value);
                      getBookingsData(
                        ev.target.value,
                        bookingCheckInDateSelected
                      );
                    }}
                  />
                  <div class="input-group-append">
                    <span
                      class="input-group-text amber lighten-3"
                      id="basic-text1"
                      onClick={() => modalDate.show()}
                    >
                      <i class="bx bx-filter text-grey" aria-hidden="true"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="row rounded-3 col-md-12">
              <ul className="list-group list-group-flush mt-2">
                <li
                  className="list-group-item ms-2 p-4 rounded-4"
                  style={{ background: `#240046` }}
                >
                  <div className="row">
                    <div className="col-md-2 mx-auto text-center">
                      <h5 className="text-white">
                        <b>Guest</b>
                      </h5>
                    </div>
                    <div className="col-md-2 mx-auto text-center">
                      <h5 className="text-white">
                        <b>Customer Name</b>
                      </h5>
                    </div>
                    <div className="col-md-2 mx-auto text-center">
                      <h5 className="text-white">
                        <b>Check In</b>
                      </h5>
                    </div>
                    <div className="col-md-2 mx-auto text-center">
                      <h5 className="text-white">
                        <b>Check Out</b>
                      </h5>
                    </div>
                    <div className="col-md-2 mx-auto text-center">
                      <h5 className="text-white">
                        <b>Status</b>
                      </h5>
                    </div>
                    <div className="col-md-2 mx-auto text-center">
                      <h5 className="text-white">
                        <b>Actions</b>
                      </h5>
                    </div>
                  </div>
                </li>
              </ul>
              <div className="table-wrapper-scroll-y my-custom-scrollbar">
                {bookingsData.map((item) => (
                  <ul className="list-group list-group-flush mt-2">
                    <li
                      className="list-group-item ms-2 p-4 rounded-4"
                      style={{ background: `#dec9e9` }}
                      key={`key${item.booking_id}`}
                    >
                      <div className="row">
                        <div className="col-md-2 mx-auto text-center">
                          <h5 className="text-custom">
                            {item.booking_guest_name}
                          </h5>
                        </div>
                        <div className="col-md-2 mx-auto text-center">
                          <h5 className="text-custom">{item.booking_name}</h5>
                        </div>
                        <div className="col-md-2 mx-auto text-center">
                          <h6 className="text-custom">
                            {moment(item.booking_check_in_date).format(
                              "ddd, D MMM YYYY, HH:mm"
                            )}
                          </h6>
                        </div>
                        <div className="col-md-2 mx-auto text-center">
                          <h6 className="text-custom">
                            {moment(item.booking_check_out_date).format(
                              "ddd, D MMM YYYY, HH:mm"
                            )}
                          </h6>
                        </div>
                        <div className="col-md-2 mx-auto text-center">
                          <h5 className="text-custom">
                            <span
                              className={`badge rounded-pill ${
                                item.booking_status === "New"
                                  ? `text-bg-primary`
                                  : item.booking_status === "Check In"
                                  ? `text-bg-warning`
                                  : `text-bg-success`
                              }`}
                            >
                              {item.booking_status}
                            </span>
                          </h5>
                        </div>
                        <div className="col-md-2 mx-auto text-center">
                          <button
                            className="btn btn-sm btn-primary ms-1 me-2"
                            onClick={() => detailBookingData(item)}
                          >
                            <span className="fa fa-circle-info"></span>
                          </button>
                          <button
                            className="btn btn-sm btn-warning ms-1 me-2"
                            onClick={() => editBookingData(item)}
                          >
                            <span className="fa fa-edit"></span>
                          </button>
                          <button
                            className="btn btn-sm btn-danger ms-1 me-2"
                            onClick={() => deleteBookingData(item.booking_id)}
                          >
                            <span className="fa fa-trash"></span>
                          </button>
                        </div>
                      </div>
                    </li>
                  </ul>
                ))}
              </div>
              <div className="modal" id="modal">
                <div className="modal-dialog modal-md">
                  <div className="modal-content">
                    <div className="modal-header bg-white">
                      <h4 className="">Change Status</h4>
                      <button
                        onClick={() => modal.hide()}
                        className="btn btn-light"
                      >
                        <span className="fa fa-close"></span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <form onSubmit={(ev) => updateBookingStatus(ev)}>
                        <label className="mt-2">ID</label>
                        <input
                          type="text"
                          className="form-control mb-2"
                          disabled
                          value={bookingId}
                        />
                        <label>Booking Number</label>
                        <input
                          type="email"
                          className="form-control mb-2"
                          disabled
                          value={bookingNumber}
                        />
                        <label>Status</label>
                        <select
                          className="form-control border-secondary"
                          value={bookingStatus}
                          onChange={(ev) => setBookingStatus(ev.target.value)}
                          required
                        >
                          <option value="">--- Booking Status ---</option>
                          <option value="New">New</option>
                          <option value="Check In">Check In</option>
                          <option value="Check Out">Check Out</option>
                        </select>

                        <br />
                        <button type="submit" className="btn-custom col-lg-12">
                          Save
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal" id="modal-detail">
                <div className="modal-dialog modal-md">
                  <div className="modal-content">
                    <div className="modal-header bg-white">
                      <h4 className="">Detail Booking</h4>
                      <button
                        onClick={() => modalDetail.hide()}
                        className="btn btn-light"
                      >
                        <span className="fa fa-close"></span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <small>Room ID</small>
                      <h5>{bookingId}</h5>
                      <br />
                      <small>Room Number</small>
                      <h5>{bookingNumber}</h5>
                      <br />
                      <small>Room Type</small>
                      <h5>{bookingName}</h5>
                      <br />
                      <small>Price</small>
                      <h5>{bookingEmail}</h5>
                      <br />
                      <small>Description</small>
                      <h5>{bookingDate}</h5>
                      <br />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal" id="modal-date">
                <div className="modal-dialog modal-md">
                  <div className="modal-content">
                    <div className="modal-header bg-white">
                      <h4 className="">Choose Date</h4>
                      <button
                        onClick={() => modalDate.hide()}
                        className="btn btn-light"
                      >
                        <span className="fa fa-close"></span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <label>Filter by:</label>
                      <div className="form-check mt-2 mb-2">
                        <input
                          type="radio"
                          id="choose-date"
                          name="filterType"
                          value="date-filter"
                          onChange={(ev) => setStatusRadio("date-filter")}
                          checked={statusRadio === "date-filter"}
                          className="form-check-input"
                        />
                        <label
                          htmlFor="choose-date"
                          className="form-check-label"
                        >
                          Choose Date Filter
                        </label>
                      </div>
                      {statusRadio === "date-filter" ? (
                        <div>
                          <label>Selected Date:</label>
                          <input
                            type="date"
                            className="form-control mb-4 mt-2"
                            value={bookingCheckInDateSelected}
                            onChange={(ev) => {
                              setBookingCheckInDateSelected(ev.target.value);
                              getBookingsData(
                                bookingNameSelected,
                                ev.target.value
                              );
                            }}
                          />
                        </div>
                      ) : (
                        <div />
                      )}
                      <div className="form-check mb-4">
                        <input
                          type="radio"
                          id="clean-filter"
                          name="filterType"
                          value="clean-filter"
                          onChange={() => {
                            setBookingCheckInDateSelected("");
                            setStatusRadio("clean-filter");
                            getBookingsData("", "");
                          }}
                          checked={statusRadio === "clean-filter"}
                          className="form-check-input"
                        />
                        <label
                          htmlFor="clean-filter"
                          className="form-check-label"
                        >
                          Clean Filter
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-3 mt-4 cardContent">
        <div className="m-4">
          <h1>{bookingNameSelected}</h1>
          <h1>{bookingCheckInDateSelected}</h1>
        </div>
      </div>
    </div>
  );
}
