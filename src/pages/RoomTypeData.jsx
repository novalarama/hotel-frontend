import { useState, useEffect } from "react";
import { Modal, Toast } from "bootstrap";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function RoomTypeData() {
  let [roomTypeData, setRoomTypeData] = useState([]);
  let [roomTypeId, setRoomTypeId] = useState(0);
  let [roomTypeName, setRoomTypeName] = useState("");
  let [roomTypePrice, setRoomTypePrice] = useState(0);
  let [roomTypeDescription, setRoomTypeDescription] = useState("");

  let [roomPhotoData, setRoomPhotoData] = useState([]);
  let [roomPhotoId, setRoomPhotoId] = useState(0);
  let [roomPhotoPath, setRoomPhotoPath] = useState("");
  let [roomPhotoRoomTypeId, setRoomPhotoRoomTypeId] = useState(0);

  let [roomFacilityData, setRoomFacilityData] = useState([]);

  let [action, setAction] = useState("");
  let [message, setMessage] = useState("");
  let [modal, setModal] = useState(null);
  let [modalPhoto, setModalPhoto] = useState(null);
  let [modalFacility, setModalFacility] = useState(null);

  let [imageCount, setImageCount] = useState(1);
  let [roomPhotoSelected, setRoomPhotoSelected] = useState([
    {
      id: 0,
      name: "",
      url: "",
      file: {}
    }
  ]);
  let [facilityCount, setFacilityCount] = useState(1);
  let [activeIndex, setActiveIndex] = useState(0);
  let [roomFacilitySelected, setRoomFacilitySelected] = useState([
    {
      id: 0,
      name: "",
      description: "",
    },
  ]);

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

  let getRoomTypesData = async () => {
    let endpoint = `http://localhost:8080/room-type`;

    await axios
      .get(endpoint, authorization)
      .then((result) => {
        setRoomTypeData(result.data.data);
      })
      .catch((error) => console.log(error));
  };

  let getRoomPhotoData = async (roomTypeId) => {
    let endpoint = `http://localhost:8080/room-photo/${roomTypeId}`;

    await axios
      .get(endpoint, authorization)
      .then((result) => {
        setRoomPhotoData(result.data.data);
      })
      .catch((error) => console.log(error));
  };
  let getRoomFacilityData = (roomTypeId) => {
    let endpoint = `http://localhost:8080/room-facility/${roomTypeId}`;

    axios
      .get(endpoint, authorization)
      .then((result) => {
        setRoomFacilityData(result.data.data);
      })
      .catch((error) => console.log(error));
  };
  let addRoomTypeData = () => {
    setAction("insert");
    modal.show();

    setRoomTypeId(0);
    setRoomTypeName("");
    setRoomTypePrice(0);
    setRoomTypeDescription("");
  };

  let editRoomTypeData = (item) => {
    setAction("edit");
    modal.show();

    setRoomTypeId(item.room_type_id);
    setRoomTypeName(item.room_type_name);
    setRoomTypePrice(item.room_type_price);
    setRoomTypeDescription(item.room_type_description);
  };

  let deleteRoomTypeData = (item) => {
    if (window.confirm(`Are you sure want to delete this data ?`)) {
      let endpoint = `http://localhost:8080/room-type/${item.room_type_id}`;

      axios
        .delete(endpoint, authorization)
        .then((result) => {
          showToast(result.data.message);
          getRoomTypesData();
        })
        .catch((error) => console.log(error));
    }
  };

  let detailRoomTypeData = async (item) => {
    getRoomFacilityData(item.room_type_id);
    getRoomPhotoData(item.room_type_id);
    setAction("detail");
    modal.show();

    setRoomTypeId(item.room_type_id);
    setRoomTypeName(item.room_type_name);
    setRoomTypePrice(item.room_type_price);
    setRoomTypeDescription(item.room_type_description);
  };

  let saveRoomTypeData = (event) => {
    event.preventDefault();

    modal.hide();
    if (action === "insert") {
      let endpoint = `http://localhost:8080/room-type`;

      let request = {
        room_type_name: roomTypeName,
        room_type_price: roomTypePrice,
        room_type_description: roomTypeDescription,
      };

      axios
        .post(endpoint, request, authorization)
        .then((result) => {
          modalPhoto.show();
          setRoomPhotoId(0);
          setRoomPhotoPath("");
          setRoomPhotoRoomTypeId(result.data.data.room_type_id);
        })
        .catch((error) => {
          showToast(error);
          console.log(error);
        });
    } else if (action === "edit") {
      let endpoint = `http://localhost:8080/room-type/${roomTypeId}`;
      let request = {
        room_type_name: roomTypeName,
        room_type_price: roomTypePrice,
        room_type_description: roomTypeDescription,
      };

      axios
        .put(endpoint, request, authorization)
        .then((result) => {
          showToast(result.data.message);
          getRoomTypesData();
        })
        .catch((error) => showToast(`Failed to update`));
    }
  };

  let uploadRoomPhotoData = (photoPath) => {
    let endpoint = "http://localhost:8080/room-photo";

    let request = new FormData();
    request.append(`room_photo_path`, photoPath);
    request.append(`room_type_id`, roomPhotoRoomTypeId);

    axios
      .post(endpoint, request, authorization)
      .then((result) => {
        console.log(result.data.message);
      })
      .catch((error) => {
        showToast("Failed to add data");
      });
  };

  let saveRoomPhotoData = () => {
    modalPhoto.hide();
    try {
      for (let i = 0; i < roomPhotoSelected.length; i++) {
        uploadRoomPhotoData(roomPhotoSelected[i].file);
      }
      modalFacility.show();
    } catch (error) {
      console.log(error);
      modalFacility.show();
    }
  };

  let addImage = () => {
    let imagePicked = document.getElementById(`image`).files;
    for (let i = 0; i < imagePicked.length; i++) {
      if (checkDuplicate(imagePicked[i].name)) {
        setRoomPhotoSelected([
          ...roomPhotoSelected,
          {
            id : 0,
            name: imagePicked[i].name,
            url: URL.createObjectURL(imagePicked[i]),
            file: imagePicked[i],
          },
        ]);
        setImageCount(imageCount + 1);
      } else {
        console.log("error: Duplicate image");
      }
    }
  };

  let deleteImage = (name) => {
    setRoomPhotoSelected(
      roomPhotoSelected.filter((image) => image.name !== name)
    );
    setImageCount(imageCount - 1);
  };

  let checkDuplicate = (name) => {
    for (let i = 0; i < roomPhotoSelected.length; i++) {
      if (roomPhotoSelected[i].name === name) {
        return false;
      }
    }
    return true;
  };

  let handleAddFacility = () => {
    setRoomFacilitySelected([
      ...roomFacilitySelected,
      {
        name: "",
        description: "",
      },
    ]);
  };

  let handleRemoveFacility = (index) => {
    const updatedFacilities = [...roomFacilitySelected];
    updatedFacilities.splice(index, 1);
    setRoomFacilitySelected(updatedFacilities);
  };

  let handleFacilityChange = (event, index) => {
    const updatedFacilities = [...roomFacilitySelected];
    updatedFacilities[index][event.target.name] = event.target.value;
    setRoomFacilitySelected(updatedFacilities);
  };

  let uploadFacilities = () => {
    let endpoint = "http://localhost:8080/room-facility";

    for (let i = 0; i < roomFacilitySelected.length; i++) {
      let request = {
        room_facility_name: roomFacilitySelected[i].name,
        room_facility_description: roomFacilitySelected[i].description,
        room_type_id: roomPhotoRoomTypeId,
      };

      axios
        .post(endpoint, request, authorization)
        .then(() => {
          console.log("Successfull");
          showToast("Success to upload image and facilities");
          modalPhoto.hide();
          getRoomTypesData();
          setRoomPhotoSelected([]);
          setRoomFacilitySelected([]);
        })
        .catch((error) => {
          console.log(error);
          showToast("failed to upload image and facilities");
          modalPhoto.hide();
          getRoomTypesData();
          setRoomPhotoSelected([]);
          setRoomFacilitySelected([]);
        });
    }
    modalFacility.hide();
  };

  let handlePrevClick = () => {
    setActiveIndex(
      (activeIndex + roomPhotoData.length - 1) % roomPhotoData.length
    );
  };

  let handleNextClick = () => {
    setActiveIndex((activeIndex + 1) % roomPhotoData.length);
  };

  let editFacilityData = (rfData, rtId) => {
    setAction("edit")
    modal.hide()

    let data = rfData.map(facility => {
      return {
        id: facility.room_facility_id,
        name: facility.room_facility_name,
        description: facility.room_facility_description
      }
    })

    setRoomFacilityData(rfData)
    setRoomFacilitySelected(data)
    setRoomTypeId(rtId)

    modalFacility.show()
  }

  let updateFacilities = () => {
    // check data to choose must be update / delete
    roomFacilityData.forEach((facility) => {
      let foundFacility = roomFacilitySelected.find((selected) => selected.id === facility.room_facility_id)
      if (!foundFacility) {
        let endpoint = `http://localhost:8080/room-facility/${facility.room_facility_id}`
        axios.delete(endpoint, authorization).then((result) => console.log("Succesfull")).catch((error) => console.log("Failed"))
      } else {
        let endpoint = `http://localhost:8080/room-facility/${facility.room_facility_id}`
        let request = {
          room_facility_name: foundFacility.name,
          room_facility_description: foundFacility.description
        }
        axios.put(endpoint, request, authorization).then((result) => console.log(result)).catch((error) => console.log(error))
      }
    })
    
    // check data to choose must be create
    roomFacilitySelected.forEach((selected) => {
      let foundFacility = roomFacilityData.find((facility) => facility.room_facility_id === selected.id)
      if(!foundFacility) {
        let endpoint = `http://localhost:8080/room-facility`
        let request = {
          room_facility_name: selected.name,
          room_facility_description: selected.description,
          room_type_id: roomTypeId
        }
        axios.post(endpoint, request, authorization).then(() => console.log("Successfull")).catch((error) => console.log("Failed"))
      }
    })

    showToast("Updated Successfull");
    modalFacility.hide();
    getRoomTypesData();
    setRoomPhotoSelected([]);
    setRoomFacilitySelected([]);
  }

  let editPhotoData = async (rpData, rtId) => {
    setAction("edit")
    modal.hide()

    setRoomPhotoSelected(rpData.map((item) => ({
      id: item.room_photo_id,
      name: item.room_photo_path,
      url: `http://localhost:8080/assets/image/${item.room_photo_path}`,
      file: {}
    })))

    setImageCount(roomPhotoSelected.length)
    setRoomTypeId(rtId)

    modalPhoto.show()
  }

  let updateRoomPhotoData = () => {
    roomPhotoData.forEach((photoData) => {
      let found = false;

      roomPhotoSelected.forEach((selectedPhoto) => {
        if (photoData.room_photo_path === selectedPhoto.name) {
          found = true;
        }
      });

      if (!found) {
        let endpoint = `http://localhost:8080/room-photo/${photoData.room_photo_id}`
        axios.delete(endpoint, authorization).then((result) => console.log("Successfull")).catch((error) => console.log(error))
      }
    });

    roomPhotoSelected.forEach((selectedPhoto) => {
      let found = false;

      roomPhotoData.forEach((photoData) => {
        if (selectedPhoto.name === photoData.room_photo_path) {
          found = true;
        }
      });

      if (!found) {
        let endpoint = `http://localhost:8080/room-photo`
        let request = new FormData();
        request.append(`room_photo_path`, selectedPhoto.file);
        request.append(`room_type_id`, roomTypeId);
        axios.post(endpoint, request, authorization).then((result) => console.log("Successfull")).catch((error) => console.log(error))
      }
    });
    showToast("Updated Successfull");
    modalPhoto.hide();
    getRoomTypesData();
  }
  useEffect(() => {
    let modal = new Modal(document.getElementById(`modal-room`));
    setModal(modal);
    let modalPhoto = new Modal(document.getElementById(`modal-photo`));
    setModalPhoto(modalPhoto);
    let modalFacility = new Modal(document.getElementById(`modal-facility`));
    setModalFacility(modalFacility);
    getRoomTypesData();
    getRoomPhotoData();
    getRoomFacilityData();
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
              <div className="col-md-9">
                <h1 className="fw-bold">Room Type List</h1>
                <h5 className="mb-4">This is room list data of hotel</h5>
              </div>
              <button
                className="btn btn-white text-white text-center col-md-3"
                onClick={() => addRoomTypeData()}
              >
                <div className="btn-custom text-center pt-3">
                  <i className="bx bx-plus"></i>
                  Add Room Type
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
                        <b>ID</b>
                      </h5>
                    </div>
                    <div className="col-md-4 mx-auto text-center">
                      <h5 className="text-white">
                        <b>Name</b>
                      </h5>
                    </div>
                    <div className="col-md-4 mx-auto text-center">
                      <h5 className="text-white">
                        <b>Price</b>
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
                {roomTypeData.map((item) => (
                  <ul className="list-group list-group-flush mt-2">
                    <li
                      className="list-group-item ms-2 p-4 rounded-4"
                      style={{ background: `#dec9e9` }}
                      key={`key${item.room_type_id}`}
                    >
                      <div className="row">
                        <div className="col-md-2 mx-auto text-center">
                          <h2 className="text-custom">
                            <b>{item.room_type_id}</b>
                          </h2>
                        </div>
                        <div className="col-md-4 mx-auto text-center">
                          <h5 className="text-custom">{item.room_type_name}</h5>
                        </div>
                        <div className="col-md-4 mx-auto text-center">
                          <h5 className="text-custom">
                            Rp{item.room_type_price.toLocaleString("id-ID")}{" "}
                          </h5>
                        </div>
                        <div className="col-md-2 mx-auto text-center">
                          <button
                            className="btn btn-sm btn-primary ms-1 me-2"
                            onClick={() => detailRoomTypeData(item)}
                          >
                            <span className="fa fa-circle-info"></span>
                          </button>
                          <button
                            className="btn btn-sm btn-warning ms-1 me-2"
                            onClick={() => editRoomTypeData(item)}
                          >
                            <span className="fa fa-edit"></span>
                          </button>
                          <button
                            className="btn btn-sm btn-danger ms-1 me-2"
                            onClick={() => deleteRoomTypeData(item)}
                          >
                            <span className="fa fa-trash"></span>
                          </button>
                        </div>
                      </div>
                    </li>
                  </ul>
                ))}{" "}
              </div>
              <div className="modal" id="modal-room">
                <div className="modal-dialog modal-md">
                  {action === "detail" ? (
                    <div className="modal-content">
                      <div className="modal-header bg-white">
                        <h4 className="">Detail Room</h4>
                        <button
                          onClick={() => modal.hide()}
                          className="btn btn-light"
                        >
                          <span className="fa fa-close"></span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <small>Room Type ID</small>
                        <h5>{roomTypeId}</h5>
                        <br />
                        <small>Room Type Name</small>
                        <h5>{roomTypeName}</h5>
                        <br />
                        <small>Room Type Price</small>
                        <h5>Rp{roomTypePrice.toLocaleString("id-ID")}</h5>
                        <br />
                        <small>Description</small>
                        <h5>{roomTypeDescription}</h5>
                        <br />
                        <div className="row">
                          <div className="col-md-10">
                            <small>Facility</small>
                          </div>
                          <div className="col-md-1">
                            <button
                              onClick={() => editFacilityData(roomFacilityData, roomTypeId)}
                              className="btn btn-light"
                            >
                              <span className="fa fa-edit"></span>
                            </button>
                          </div>
                        </div>
                        <ul>
                          {roomFacilityData.map((itemFacility) => (
                            <li>
                              <h6>{itemFacility.room_facility_name}</h6>
                              <small>
                                {itemFacility.room_facility_description}{" "}
                              </small>
                            </li>
                          ))}{" "}
                        </ul>
                        <br />
                        <div className="row">
                          <div className="col-md-10">
                            <small>Image</small>
                          </div>
                          <div className="col-md-1">
                            <button
                              onClick={() => editPhotoData(roomPhotoData, roomTypeId)}
                              className="btn btn-light"
                            >
                              <span className="fa fa-edit"></span>
                            </button>
                          </div>
                        </div>
                        <br />
                        <div
                          id="carouselExampleIndicators"
                          class="carousel slide"
                          data-ride="carousel"
                        >
                          <ol class="carousel-indicators">
                            {roomPhotoData.map((itemImage, index) => (
                              <li
                                key={index}
                                data-target="#carouselExampleIndicators"
                                data-slide-to={index}
                                className={
                                  index === activeIndex ? "active" : ""
                                }
                              ></li>
                            ))}
                          </ol>
                          <div class="carousel-inner">
                            {roomPhotoData.map((itemImage, index) => (
                              <div
                                key={index}
                                className={
                                  index === activeIndex
                                    ? "carousel-item active image-cover"
                                    : "carousel-item image-cover"
                                }
                              >
                                <img
                                  class="d-block w-100 image-cover-fit"
                                  src={`http://localhost:8080/assets/image/${itemImage.room_photo_path}`}
                                  alt={`Slide ${index}`}
                                />
                              </div>
                            ))}
                          </div>
                          <a
                            class="carousel-control-prev"
                            href="#carouselExampleIndicators"
                            role="button"
                            data-slide="prev"
                            onClick={handlePrevClick}
                          >
                            <span
                              class="carousel-control-prev-icon"
                              aria-hidden="true"
                            ></span>
                            <span class="sr-only">Previous</span>
                          </a>
                          <a
                            class="carousel-control-next"
                            href="#carouselExampleIndicators"
                            role="button"
                            data-slide="next"
                            onClick={handleNextClick}
                          >
                            <span
                              class="carousel-control-next-icon"
                              aria-hidden="true"
                            ></span>
                            <span class="sr-only">Next</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="modal-content">
                      <div className="modal-header bg-white">
                        <h4>Add New Room Type</h4>
                      </div>
                      <div className="modal-body">
                        <form onSubmit={(ev) => saveRoomTypeData(ev)}>
                          <label>Room Type Name</label>
                          <input
                            type="text"
                            className="form-control mb-2"
                            required
                            value={roomTypeName}
                            onChange={(ev) => setRoomTypeName(ev.target.value)}
                          />
                          <label>Room Type Price</label>
                          <input
                            type="number"
                            className="form-control mb-2"
                            required
                            value={roomTypePrice}
                            onChange={(ev) => setRoomTypePrice(ev.target.value)}
                          />
                          <label>Room Type Description</label>
                          <input
                            type=""
                            className="form-control mb-2"
                            required
                            value={roomTypeDescription}
                            onChange={(ev) =>
                              setRoomTypeDescription(ev.target.value)
                            }
                          />
                          <br />
                          <button
                            type="submit"
                            className="btn-custom col-lg-12"
                          >
                            Continue
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal" id="modal-photo">
                <div className="modal-dialog modal-md">
                  <div className="modal-content">
                    <div className="modal-header bg-white">
                      <h4 className="">Detail Room</h4>
                      <button
                        onClick={() => modalPhoto.hide()}
                        className="btn btn-light"
                      >
                        <span className="fa fa-close"></span>
                      </button>
                    </div>
                    <div className="modal-body row m-2">
                      <div className="col-md-9">
                        <label>Room Photo</label>
                      </div>
                      <div className="col-md-3">
                        <form
                          className="form"
                          action="#"
                          method="post"
                          id="form"
                        >
                          <input
                            type="file"
                            name="image"
                            id="image"
                            accept="image/*"
                            className="d-none"
                            onChange={addImage}
                          />
                          <button
                            className="btn-custom"
                            type="button"
                            onClick={() =>
                              document.getElementById(`image`).click()
                            }
                          >
                            + Image
                          </button>
                        </form>
                      </div>
                      <br />
                      <div
                        className="d-flex flex-wrap justify-content-start"
                        id="container"
                      >
                        {roomPhotoSelected.map((image, index) => (
                          <div className="image-container d-flex justify-content-center position-relative">
                            <img src={`${image.url}`} alt="Photo not Found" />
                            <span
                              className="position-absolute"
                              onClick={() => deleteImage(image.name)}
                            >
                              &times;
                            </span>
                          </div>
                        ))}{" "}
                      </div>
                      <hr />
                      <button
                        type="submit"
                        className="btn-custom col-lg-12 mt-4"
                        onClick={() => action === 'edit' ? updateRoomPhotoData() : saveRoomPhotoData()}
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal" id="modal-facility">
                <div className="modal-dialog modal-md">
                  <div className="modal-content">
                    <div className="modal-header bg-white">
                      <h4 className="">Detail Room</h4>
                      <button
                        onClick={() => modalFacility.hide()}
                        className="btn btn-light"
                      >
                        <span className="fa fa-close"></span>
                      </button>
                    </div>
                    <div className="modal-body row m-2">
                      <h5>Facilities</h5>
                      {roomFacilitySelected.map((facility, index) => (
                        <div key={index} className="col-md-12 row mt-2">
                          <label className="mb-2">
                            <strong>{`Room Facility ${index + 1}`}</strong>
                          </label>
                          <div className="col-md-11 mb-1">
                            <label>Name</label>
                            <input
                              type="text"
                              className="form-control mb-1"
                              value={roomFacilitySelected[index].name}
                              name="name"
                              required
                              placeholder="Masukkan Nama Fasilitas"
                              onChange={(event) =>
                                handleFacilityChange(event, index)
                              }
                            />
                            <label>Description</label>
                            <input
                              type="text"
                              className="form-control"
                              value={roomFacilitySelected[index].description}
                              name="description"
                              placeholder="Tulis Deskripsi"
                              onChange={(event) =>
                                handleFacilityChange(event, index)
                              }
                            />
                          </div>
                          <div className="col-md-1">
                            <button
                              type="button"
                              className="btn btn-light"
                              onClick={() => handleRemoveFacility(index)}
                            >
                              <span className="fa fa-trash"></span>
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn-custom-outline col-md-12 mt-3"
                        onClick={handleAddFacility}
                      >
                        Add Facility
                      </button>
                      <hr />
                      <button
                        type="submit"
                        className="btn-custom col-lg-12 mt-4"
                        onClick={() => action === "edit" ? updateFacilities() : uploadFacilities()}
                      >
                        Save
                      </button>
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
          <h1>ss</h1>
          <pre>{JSON.stringify(roomPhotoSelected, null, 2)}</pre>
          <pre>{JSON.stringify(roomFacilitySelected, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
