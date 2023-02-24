import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar"


export default function Login() {
    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");

    let loginProcess = (event) => {
        event.preventDefault();

        let request = {
            user_name: username,
            user_password: password
        }

        let endpoint = `http://localhost:8080/user/auth`

        axios.post(endpoint, request).then(response => {
            if (response.data.logged === true) {
                let token = response.data.token
                localStorage.setItem(`token`, token)

                let data = JSON.stringify(response.data)
                localStorage.setItem(`user`, data)
                
                let dataUser = JSON.stringify(response.data.data)
                localStorage.setItem('data_user', dataUser)
                localStorage.setItem('user_role', response.data.user_role)

                alert("Login Successfull")
                window.location = "./management"
            } else {
                alert("Login not successfull, please try again !")
            }
        }).catch(error => {
            console.log(error)
        })
    }
    return <div class="container p-3 containerLogin col-lg-12">
        <div className="row">
            <img src="assets/login.jpg" width="100%" alt="" className="col-lg-6"/>
            <div className="col-lg-5 bg-white shadow p-5 ms-4 rounded-5">
                <h1>
                    <b>Log in</b>
                </h1>
                <h5>Log in to your account</h5>
                <form onSubmit={
                    (event) => loginProcess(event)
                }>
                    <h5 className="mt-5">Username</h5>
                    <div class="input-group input-group-lg">
                        <input type="text" class="form-control" placeholder="ex: Johnson" value={username} onChange={(event) => setUsername(event.target.value)} required/>
                    </div>
                    <h5 className="mt-3">Password</h5>
                    <div class="input-group input-group-lg">
                        <input type="password" class="form-control" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="false" required/>
                    </div>
                    <button type="submit" className="form-control btn btn-success btn-custom btn-lg btn-block mt-5">
                        <b>Login</b>
                    </button>
                </form>
                <h5 className="text-center mt-5">
                    <Link id="signup" to="/signup" className="nav-link">
                        Do you have not account ? Sign up
                    </Link>
                </h5>
            </div>
        </div>
    </div>

}
