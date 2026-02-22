import Navbar from "../Navbar";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient.js";
import { useState } from "react";

function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [fieldErrors, setFieldErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateInputs = () => {
        const errs = {};
        setFormError("");

        if (!username.trim()) errs.username = "Please enter your username.";
        if (!password) errs.password = "Please enter your password.";

        setFieldErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateInputs()) return;

        setIsSubmitting(true);
        setFormError("");

        const { data: userData, error } = await supabase
            .from("Users")
            .select("famID, famUser, pass_hash")
            .eq("famUser", username)
            .single();

        if (error || !userData) {
            setFieldErrors((prev) => ({
                ...prev,
                username: "Username not found.",
            }));
            setIsSubmitting(false);
            return;
        }

        if (userData.pass_hash !== password) {
            setFieldErrors((prev) => ({
                ...prev,
                password: "Incorrect password.",
            }));
            setIsSubmitting(false);
            return;
        }
        localStorage.setItem("family", JSON.stringify({
            famID: userData.famID,
            famUser: username
            }));
        setIsSubmitting(false);
        navigate("/Taskboard");
    };

    return (
        <>
            <Navbar />
            <br />
            <h1 className="header">Log in to uVisible</h1>

            <div className="login-container">
                <form className="login-form" onSubmit={handleLogin}>
                    {formError && <div className="error-banner">{formError}</div>}

                    <div className="form-group">
                        <label>Family Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                setFieldErrors((prev) => ({ ...prev, username: "" }));
                            }}
                        />
                        {fieldErrors.username && (
                            <div className="error">{fieldErrors.username}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setFieldErrors((prev) => ({ ...prev, password: "" }));
                            }}
                        />
                        {fieldErrors.password && (
                            <div className="error">{fieldErrors.password}</div>
                        )}
                    </div>

                    <button
                        className="signupbutton"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Logging in..." : "Login"}
                    </button>
                </form>

                <Link className="signup" to="/Signup">
                    Don't have a username? Sign up here!
                </Link>
            </div>
        </>
    );
}

export default Login;
