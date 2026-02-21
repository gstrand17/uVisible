import Navbar from "../Navbar";
import './Login.css'
import {Link} from "react-router-dom";
import viteLogo from "../assets/vite.svg";

function Login() {
    return(
        <>
            <Navbar />
            <br />
            <h1> Log in to uVisible</h1>
            <form>
                <div>                                      </div>
                <p>Username: </p>
                <input type='text' id='username'/>
            </form>
            <form>
                <div>
                    <p>Password: </p>
                    <input type='text' id='password'/>
                </div>
            </form>
            <div>
                <Link to="/Signup">Sign up here!</Link>
            </div>
        </>
    )
}
export default Login;

