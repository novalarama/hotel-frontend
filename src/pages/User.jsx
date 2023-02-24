import { useState, useEffect } from "react";
import { Modal, Toast } from "bootstrap";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function UserData() {
  if (!localStorage.getItem(`token`)) {
    window.location = `./login`;
  }

  let [userList, setUserList] = useState([]);
  let [userId, setUserId] = useState(0);
  let [userName, setUserName] = useState("");
  let [userPhoto, setUserPhoto] = useState(null);
  let [userEmail, setUserEmail] = useState("");
  let [userPassword, setUserPassword] = useState("");
  let [userRole, setUserRole] = useState("");
  let [uploadPhoto, setUploadPhoto] = useState(false);
  let [changePassword, setChangePassword] = useState(false)

  let [action, setAction] = useState("");
  let [message, setMessage] = useState("");
  let [modal, setModal] = useState(null);
  let [modalDetail, setModalDetail] = useState(null);

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

  let getUsersData = () => {
    let endpoint = `http://localhost:8080/user`;
    axios
      .get(endpoint, authorization)
      .then((result) => setUserList(result.data.data))
      .catch((error) => {
        showToast("Failed to Get User Data");
      });
  };

  let addUserData = () => {
    setAction("insert");
    modal.show();

    setUserId(0);
    setUserName("");
    setUserPhoto(null);
    setUserEmail("");
    setUserPassword("");
    setUserRole("");
    setChangePassword(true)
    setUploadPhoto(true);
  };

  let editUserData = (item) => {
    setAction("edit");
    modal.show();

    setUserId(item.user_id);
    setUserName(item.user_name);
    setUserPhoto(item.user_photo);
    setUserEmail(item.user_email);
    setUserPassword(item.user_password);
    setUserRole(item.user_role);
    setUploadPhoto(false);
    setChangePassword(false)
  };

  let detailUserData = (item) => {
    setAction("detail");
    modalDetail.show();

    setUserId(item.user_id);
    setUserName(item.user_name);
    setUserPhoto(item.user_photo);
    setUserEmail(item.user_email);
    setUserPassword(item.user_password);
    setUserRole(item.user_role);
  };

  let saveUserData = (event) => {
    event.preventDefault();

    if (action === "insert") {
      let endpoint = "http://localhost:8080/user";

      let request = new FormData();
      request.append(`user_name`, userName);
      request.append(`user_photo`, userPhoto);
      request.append(`user_email`, userEmail);
      request.append(`user_password`, userPassword);
      request.append(`user_role`, userRole);

      axios
        .post(endpoint, request, authorization)
        .then((result) => {
          showToast(result.data.message);
          getUsersData();
          modal.hide();
        })
        .catch((error) => {
          showToast("Failed to Add User");
          getUsersData();
          modal.hide();
        });
    } else if (action === "edit") {
      let endpoint = `http://localhost:8080/user/${userId}`;

      let request = new FormData();
      request.append(`user_name`, userName);
      if(uploadPhoto === true) {
        request.append(`user_photo`, userPhoto);
      }
      request.append(`user_email`, userEmail);
      if(changePassword === true) {
        request.append(`user_password`, userPassword);
      }
      request.append(`user_role`, userRole);

      axios
        .put(endpoint, request, authorization)
        .then((result) => {
          showToast(result.data.message);
          getUsersData();
          modal.hide();
        })
        .catch((error) => {
          showToast("Failed to Update User");
          getUsersData();
          modal.hide();
        });
    }
  };

  let deleteUserData = (userId) => {
    if(window.confirm(`Are you sure want to delete this data ?`)){
      let endpoint = `http://localhost:8080/user/${userId}`;
  
      axios
        .delete(endpoint, authorization)
        .then((result) => {
          showToast(result.data.message);
          getUsersData();
          modal.hide();
        })
        .catch((error) => {
          showToast("Failed to Delete User");
          getUsersData();
          modal.hide();
        });
    }
  };

  useEffect(() => {
    let modal = new Modal(document.getElementById(`modal`));
    let modalDetail = new Modal(document.getElementById(`modal-detail`));
    setModal(modal);
    setModalDetail(modalDetail);
    getUsersData();
  }, []);

  return (
    <div className="row col-lg-12">
      {/* start component toast untuk menggantikan alert*/}
      <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1 }}>
        <div className="toast bg-light" id="myToast">
          <div className="toast-header bg-info text-white">
            <strong>Message</strong>
          </div>
          <div className="toast-body"> {message}</div>
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
                <h1 className="fw-bold">User List</h1>
                <h5 className="mb-4">This is user list data of hotel</h5>
              </div>
              <button
                className="btn btn-white text-white text-center col-md-2"
                onClick={() => addUserData()}
              >
                <div className="btn-custom text-center pt-3">
                  <i className="bx bx-plus"></i>
                  Add User
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
                    <div className="col-md-1 mx-auto text-center">
                      <h5 className="text-white">
                        <b>User Role</b>
                      </h5>
                    </div>
                    <div className="col-md-5 mx-auto text-center">
                      <h5 className="text-white">
                        <b>Name</b>
                      </h5>
                    </div>
                    <div className="col-md-4 mx-auto text-center">
                      <h5 className="text-white">
                        <b>Email</b>
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
                {userList.map((item) => (
                  <ul className="list-group list-group-flush mt-2">
                    <li
                      className="list-group-item ms-2 p-4 rounded-4"
                      style={{ background: `#dec9e9` }}
                      key={`key${item.user_id}`}
                    >
                      <div className="row">
                        <div className="col-md-1 mx-auto text-center">
                          <h5 className="text-custom">
                            <b>{item.user_role}</b>
                          </h5>
                        </div>
                        <div className="col-md-5 mx-auto text-center">
                          <h5 className="text-custom"> {item.user_name}</h5>
                        </div>
                        <div className="col-md-4 mx-auto text-center">
                          <h6 className="text-custom">{item.user_email}</h6>
                        </div>
                        <div className="col-md-2 mx-auto text-center">
                          <button
                            className="btn btn-sm btn-primary ms-1 me-2"
                            onClick={() => detailUserData(item)}
                          >
                            <span className="fa fa-circle-info"></span>
                          </button>
                          <button
                            className="btn btn-sm btn-warning ms-1 me-2"
                            onClick={() => editUserData(item)}
                          >
                            <span className="fa fa-edit"></span>
                          </button>
                          <button
                            className="btn btn-sm btn-danger ms-1 me-2"
                            onClick={() => deleteUserData(item.user_id)}
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
                      <h4 className="">Add New User</h4>
                      <button
                        onClick={() => modal.hide()}
                        className="btn btn-light"
                      >
                        <span className="fa fa-close"></span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <form onSubmit={(ev) => saveUserData(ev)}>
                        <label>Role</label>
                        <select
                          className="form-control border-secondary"
                          value={userRole}
                          onChange={(ev) => setUserRole(ev.target.value)}
                          required
                        >
                          <option value="">--- User Role ---</option>
                          <option value='Admin'>Admin</option>
                          <option value='Receptionist'>Receptionist</option>
                        </select>
                        <label className="mt-2">Name</label>
                        <input
                          type="text"
                          className="form-control mb-2"
                          required
                          value={userName}
                          onChange={(ev) => setUserName(ev.target.value)}
                        />
                        <label>Email</label>
                        <input
                          type="email"
                          className="form-control mb-2"
                          required
                          value={userEmail}
                          onChange={(ev) => setUserEmail(ev.target.value)}
                        />
                        <div className="row">
                          <div className="col-md-10">
                            <small>Password</small>
                          </div>
                          {action === 'edit' ? <div className="col-md-1 mb-2">
                            <button
                            type="button"
                              onClick={() => {
                                setChangePassword(true);
                                setUserPassword("")
                              }}
                              className="btn btn-light"
                            >
                              <span className="fa fa-edit"></span>
                            </button>
                          </div> : <div />}
                        </div>
                        <input
                          type="password"
                          className="form-control mb-2"
                          required
                          disabled = {changePassword === true ? false : true}
                          value={userPassword}
                          onChange={(ev) => setUserPassword(ev.target.value)}
                        />
                        <label>Image</label>
                        <input
                          type="file"
                          className={`form-control mb-2 ${
                            uploadPhoto ? `` : `d-none`
                          }`}
                          required={uploadPhoto}
                          accept="image/*"
                          onChange={(e) => setUserPhoto(e.target.files[0])}
                        />
                        <br />
                        <button
                          type="button"
                          className={`btn-custom-outline mb-4 ${
                            uploadPhoto ? `d-none` : ``
                          }`}
                          onClick={() => setUploadPhoto(true)}
                        >
                          Click to re-upload image
                        </button>
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
                      <h4 className="">Add New Use</h4>
                      <button
                        onClick={() => modalDetail.hide()}
                        className="btn btn-light"
                      >
                        <span className="fa fa-close"></span>
                      </button>
                    </div>
                    <div className="modal-body">
                        <small>Role</small>
                        <h5 className="mb-2">{userRole}</h5>
                        <small>Name</small>
                        <h5 className="mb-2">{userName}</h5>
                        <small>Email</small>
                        <h5 className="mb-2">{userEmail}</h5>
                        <small>Photo</small>
                        <br />
                        <img
                            src={`http://localhost:8080/assets/image/${userPhoto}`}
                            alt="My photo"
                            className="circle-photo"
                          />
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
          <h1>{action}</h1>
          <h1>{changePassword}</h1>
        </div>
      </div>
    </div>
  );
}
