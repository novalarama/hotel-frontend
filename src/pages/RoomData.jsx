import { useState, useEffect } from "react";
import { Modal } from "bootstrap";
import { Toast } from "bootstrap";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function RoomData() {
  if (!localStorage.getItem(`token`)) {
    window.location = `./login`;
  }
  let [list, setList] = useState([]);

  let [roomId, setRoomId] = useState("")
  let [roomNumber, setRoomNumber] = useState("")
  let [roomTypeName, setRoomTypeName] = useState("")
  let [roomTypePrice, setRoomTypePrice] = useState(0)
  let [roomTypeDescription, setRoomTypeDescription] = useState("")
  let [selectedRoomTypeId, setSelectedRoomTypeId] = useState(0)
  let [roomType, setRoomType] = useState([])

  let [action, setAction] = useState("");
  let [message, setMessage] = useState("");
  let [modal, setModal] = useState(null);

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

  let getRoomsData = () => {
    let endpoint = `http://localhost:8080/room`;

    axios
      .get(endpoint, authorization)
      .then((result) => {
        setList(result.data.data);
        // console.log(result.data)
      })
      .catch((error) => console.log(error));
  };

  let addRoomData = () => {
    setAction("insert");
    modal.show();

    setRoomId(0);
    setRoomNumber("");
    setSelectedRoomTypeId(0);
  };

  let editRoomData = (item) => {
    setAction("edit")
    modal.show()

    setRoomId(item.room_id)
    setRoomNumber(item.room_number)
    setSelectedRoomTypeId(item.room_type_id)
  }

  let deleteRoomData = (item) => {
    if(window.confirm(`Are you sure want to delete this data ?`)){
      let endpoint = `http://localhost:8080/room/${item.room_id}`

      axios.delete(endpoint, authorization)
      .then((response) => {
        showToast(response.data.message)
        getRoomsData()
      }).catch((error) => console.log(error))
    }
  }

  let detailRoomData = (item) => {
    setAction("detail")
    modal.show()

    setRoomId(item.room_id)
    setRoomNumber(item.room_number)
    setRoomTypeName(item.room_type.room_type_name)
    setRoomTypePrice(item.room_type.room_type_price)
    setRoomTypeDescription(item.room_type.room_type_description)
  }

  let saveRoomData = (event) => {
    event.preventDefault()

    modal.hide();
    if (action === "insert") {
      let endpoint = `http://localhost:8080/room`;

      let request = {
        room_number: roomNumber,
        room_type_id: selectedRoomTypeId,
      };

      axios
        .post(endpoint, request, authorization)
        .then((response) => {
          showToast(response.data.message);
          getRoomsData();
        })
        .catch((error) => {
          showToast(error);
          console.log(error);
        });
    } else if (action === "edit") {
      let endpoint = `http://localhost:8080/room/${roomId}`;
      let request = {
        room_number: roomNumber,
        room_type_id: selectedRoomTypeId,
      };

      axios
        .put(endpoint, request, authorization)
        .then((response) => {
          showToast(response.data.message);
          getRoomsData();
        })
        .catch((error) => showToast(`Failed to update`));
    }
  };

  let getRoomTypeData = () => {
    let endpoint = `http://localhost:8080/room-type`;
    axios
      .get(endpoint, authorization)
      .then((result) => {
        setRoomType(result.data.data);
      })
      .catch((error) => console.log(error));
  };

  let onGenerateRoomNumber = (ev) => {
    setSelectedRoomTypeId(parseInt(ev));

    // choose room which room_type_id suitable with selectedRoomTypeId
    let filteredList = list.filter((room) => room.room_type_id == ev);

    let lastIndex = filteredList.length - 1;
    let lastValue = filteredList[lastIndex].room_number;
    let number = parseInt(lastValue.substr(2));
    let newNumber = number + 1;

    switch (ev) {
      case "4":
        setRoomNumber(`B-${newNumber}`);
        break;
      case "5":
        setRoomNumber(`C-${newNumber}`);
        break;
      case "6":
        setRoomNumber(`D-${newNumber}`);
        break;
      case "7":
        setRoomNumber(`E-${newNumber}`);
        break;
      case "8":
        setRoomNumber(`F-${newNumber}`);
        break;
      case "9":
        setRoomNumber(`G-${newNumber}`);
        break;
      default:
        setRoomNumber(`A-${newNumber}`);
        break;
    }
  };

  useEffect(() => {
    let modal = new Modal(document.getElementById(`modal-room`));
    setModal(modal)
    getRoomsData();
    getRoomTypeData();
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
              <div className="col-md-10">
                <h1 className="fw-bold">Room List</h1>
                <h5 className="mb-4">This is room list data of hotel</h5>
              </div>
              <button
                className="btn btn-white text-white text-center col-md-2"
                onClick={() => addRoomData()}
              >
                <div className="btn-custom text-center pt-3">
                  <i className="bx bx-plus"></i>
                  Add Room
                </div>
              </button>
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
                        <b>Room ID</b>
                      </h5>
                    </div>
                    <div className="col-md-4 mx-auto text-center">
                      <h5 className="text-white">
                        <b>Room Number</b>
                      </h5>
                    </div>
                    <div className="col-md-4 mx-auto text-center">
                      <h5 className="text-white">
                        <b>Room Type</b>
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
                {list.map((item) => (
                  <ul className="list-group list-group-flush mt-2">
                    <li
                      className="list-group-item ms-2 p-4 rounded-4"
                      style={{ background: `#dec9e9` }}
                      key={`key${item.room_id}`}
                    >
                      <div className="row">
                        <div className="col-md-2 mx-auto text-center">
                          <h2 className="text-custom">
                            <b>{item.room_id}</b>
                          </h2>
                        </div>
                        <div className="col-md-4 mx-auto text-center">
                          <h5 className="text-custom">{item.room_number}</h5>
                        </div>
                        <div className="col-md-4 mx-auto text-center">
                          <h5 className="text-custom">
                            {item.room_type.room_type_name}
                          </h5>
                        </div>
                        <div className="col-md-2 mx-auto text-center">
                          <button className="btn btn-sm btn-primary ms-1 me-2" onClick={() => detailRoomData(item)}>
                            <span className="fa fa-circle-info"></span>
                          </button>
                          <button className="btn btn-sm btn-warning ms-1 me-2" onClick={() => editRoomData(item)}>
                            <span className="fa fa-edit"></span>
                          </button>
                          <button className="btn btn-sm btn-danger ms-1 me-2" onClick={() => deleteRoomData(item)}>
                            <span className="fa fa-trash"></span>
                          </button>
                        </div>
                      </div>
                    </li>
                  </ul>
                ))}
                </div>
              <div className="modal" id="modal-room">
                <div className="modal-dialog modal-md">
                  {action === "detail" ? <div className="modal-content">
                    <div className="modal-header bg-white">
                      <h4 className="">Detail Room</h4>
                      <button onClick={() => modal.hide()} className="btn btn-light">
                      <span className="fa fa-close"></span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <small>Room ID</small>
                      <h5>{roomId}</h5>
                      <br />
                      <small>Room Number</small>
                      <h5>{roomNumber}</h5>
                      <br />
                      <small>Room Type</small>
                      <h5>{roomTypeName}</h5>
                      <br />
                      <small>Price</small>
                      <h5>Rp{roomTypePrice.toLocaleString('id-ID')}</h5>
                      <br />
                      <small>Description</small>
                      <h5>{roomTypeDescription}</h5>
                      <br />
                    </div>
                  </div> : <div className="modal-content">
                    <div className="modal-header bg-white">
                      <h4>Add New Room</h4>
                    </div>
                    <div className="modal-body">
                      <form onSubmit={(ev) => saveRoomData(ev)}>
                      Room Number
                      {action === "edit" ? <input
                        type="text"
                        className="form-control mb-2"
                        required
                        value={roomNumber}
                        onChange={(ev) => setRoomNumber(ev.target.value)}
                      /> : <input
                      type="text"
                      className="form-control mb-2"
                      required
                      disabled
                      value={roomNumber}
                      onChange={(ev) => setRoomNumber(ev.target.value)}
                    />}
                      <div className="col-3 mt-2">Room Type</div>
                      <div className="col-12">
                        {action === "edit" ? <select
                          className="form-control border-primary"
                          onChange={(ev) => onGenerateRoomNumber(ev.target.value)}
                          value={selectedRoomTypeId}
                          disabled
                          required
                        >
                          <option value="">--- Room Type List ---</option>
                          {roomType.map((item) => (
                            <option
                              value={item.room_type_id}
                              key={`key${item.room_type_id}`}
                            >
                              {item.room_type_id}-{item.room_type_name}{" "}
                            </option>
                          ))}{" "}
                        </select> : <select
                          className="form-control border-primary"
                          onChange={(ev) =>
                            onGenerateRoomNumber(ev.target.value)
                          }
                          value={selectedRoomTypeId}
                          required
                        >
                          <option value="">--- Room Type List ---</option>
                          {roomType.map((item) => (
                            <option
                              value={item.room_type_id}
                              key={`key${item.room_type_id}`}
                            >
                              {item.room_type_id}-{item.room_type_name}{" "}
                            </option>
                          ))}{" "}
                        </select>}
                      </div>
                      <br />
                      <button
                        type="submit"
                        className="btn-custom col-lg-12"
                      >
                        Save
                      </button>
                      </form>
                    </div>
                  </div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-3 mt-4 cardContent">
        <div className="m-4">
          <h1>ss</h1>
        </div>
      </div>
    </div>
  );
}
