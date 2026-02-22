import Navbar from "../Navbar";
<<<<<<< HEAD
<<<<<<< HEAD
import './Login.css'
import {Link, useNavigate} from "react-router-dom";
import {supabase} from "../supabaseClient.js";
import { useState } from "react";
=======
import '../App.css'
>>>>>>> f4b3a63812f20e2e18333e1761e34d3b225a7498
=======
import '../App.css'
>>>>>>> f4b3a63812f20e2e18333e1761e34d3b225a7498

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const handleLogin = async (e) => {
        e.preventDefault();
        const { data: userData, error } = await supabase
            .from("Users")
            .select("*")
            .eq("famUser", username)
            .single();
        if(error || !userData) {
            alert("Username not found");
            return;
        }
        if (userData.pass_hash !== password) {
            alert("Password is incorrect");
            return;
            }

        localStorage.setItem("family", JSON.stringify({
            famID: userData.famID,
            famUser: username
        }));
        navigate("/Taskboard");
        };
    return(
        <>
            <Navbar />
<<<<<<< HEAD
<<<<<<< HEAD
            <br />
            <h1 className = "header" > Log in to uVisible</h1>

            <div className = "login-container">
                <form className = "login-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Family Username</label>
                        <input type='text'
                               id='username'
                               value={username}
                        onChange={(e) => setUsername(e.target.value)}/>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type='password'
                               id='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <button className="signupbutton" type="submit">
                        Login
                        </button>
                </form>
                <Link className="signup" to="/Signup">Don't have a username? Sign up here!</Link>
            </div>
=======
            <h1> This is my log in page</h1>
>>>>>>> f4b3a63812f20e2e18333e1761e34d3b225a7498
        </>
    );
}
<<<<<<< HEAD

export default Login;
=======
export default Login;
>>>>>>> f4b3a63812f20e2e18333e1761e34d3b225a7498
=======
            <h1> This is my log in page</h1>
        </>
    )
}
export default Login;
>>>>>>> f4b3a63812f20e2e18333e1761e34d3b225a7498
