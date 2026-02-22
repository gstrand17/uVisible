import Navbar from "../Navbar";
import './Login.css'
import {Link, useNavigate} from "react-router-dom";
import viteLogo from "../assets/vite.svg";
import {supabase} from "../supabaseClient.js";
import { useState } from "react";

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
        navigate("/Taskboard");
        localStorage.removeItem("activeMember");
        };
    return(
        <>
            <Navbar />
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
        </>
    );
}

export default Login;
