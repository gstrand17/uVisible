import Navbar from "../Navbar";
import './Login.css'
import {Link} from "react-router-dom";
import viteLogo from "../assets/vite.svg";

function Login() {
    return(
        <>
            <Navbar />
            <br />
            <h1 className = "header" > Log in to uVisible</h1>

            <div className = "login-container">
                <form className = "login-form">

                    <div className="form-group">
                        <label>Username</label>
                        <input type='text' id='username'/>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type='password' id='password'/>
                    </div>
                    <input type="button" value="Login"/>
                </form>
                <Link className="signup" to="/Signup">Don't have a username? Sign up here!</Link>
            </div>
        </>
    )
}
export default Login;


