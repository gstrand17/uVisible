import Navbar from "../Navbar";
import './Login.css'
import {Link, useNavigate} from "react-router-dom";
import { useState } from "react";
import { supabase } from "../supabaseClient";

function Signup() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [members, setMembers] = useState([
        {memName: "", is_adult: false, labor_limit: 1}
    ]);
    const [fieldErrors, setFieldErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    function updateMember(index, field, value) {
        const updated = [...members];
        updated[index][field] = value;
        setMembers(updated);
    }

    const validate = () => {
        const errs = {};
        setFormError("");
        if (!username.trim()) errs.username = "Please enter a username";
        if (!password) errs.password = "Please enter a password";
        if (!confirmPassword) errs.confirmPassword = "Please confirm your password";
        if (password && confirmPassword && password !== confirmPassword) {
            errs.confirmPassword = "Passwords do not match";
        }
    members.forEach((m, i) => {
        if (!m.memName.trim()) errs[`member-${i}-memName`] = "Please enter a name";
    });
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
};

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        setFormError("");

// Insert into Users table
        const { data: userData, error: userError } = await supabase
            .from("Users")
            .insert([
                {
                    famUser: username,
                    pass_hash: password
                }
            ])
            .select("famID")
            .single();

        if (userError) {
            console.error("USER INSERT ERROR:", userError);
            setFormError(userError.message || "Could not create account. Please try again.");
            setIsSubmitting(false);
            return;
        }

        const currFamID = userData.famID; // primary key

// Attach famID to each member
        const membersRows = members.map(member => ({
            ...member,
            familyID: currFamID
        }));

// Insert into Members table
        const { error: memberError } = await supabase
            .from("Members")
            .insert(membersRows);

        if (memberError) {
            console.error("MEMBER INSERT ERROR:", memberError);
            setFormError(memberError.message || "Could not add family members. Please try again.");
            setIsSubmitting(false);
            return;
        }
        setIsSubmitting(false);
        navigate("/Taskboard");
    };


    return(
        <>
            <Navbar />
            <br />
            <h1 className = "header" > Create a new family account</h1>

            <div className = "login-container">
                <form className="login-form" onSubmit={handleSubmit}>
                    {formError && <div className="error-banner">{formError}</div>}

                    <div className="form-group">
                        <label>Choose Family Username</label>
                        <input type='text'
                               value={username}
                               onChange={(e) => setUsername(e.target.value)}
                               id='username'/>
                        {fieldErrors.username && <div className="error">{fieldErrors.username}</div>}
                    </div>
                    <div className="form-group">
                        <label>Choose Family Password</label>
                        <input type="password"
                               value={password}
                               onChange={(e) => setPassword(e.target.value)}
                               id='choose-password'/>
                        {fieldErrors.password && <div className="error">{fieldErrors.password}</div>}
                    </div>
                    <div className="form-group">
                        <label>Confirm Family Password</label>
                        <input type="password" id="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}/>
                        {fieldErrors.confirmPassword && (
                            <div className="error">{fieldErrors.confirmPassword}</div>
                        )}
                    </div>


                    {members.map((member, index) => (
                        <div key={index} >
                            <div className="form-group">
                                <label>Enter Name</label>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={member.memName}
                                    id='name'
                                    onChange={(e) => updateMember(index, "memName", e.target.value)}
                                />
                                {fieldErrors[`member-${index}-memName`] && (
                                    <div className="error">{fieldErrors[`member-${index}-memName`]}</div>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={member.is_adult}
                                        id='parent'
                                        onChange={(e) => updateMember(index, "is_adult", e.target.checked)}
                                    /> Parent?
                                </label>
                            </div>

                            <div className="form-group">
                                <label htmlFor="labor">Labor Limit</label>
                                <select
                                    value={member.labor_limit}
                                    id='labor'
                                    onChange={(e) => updateMember(index, "labor_limit", Number(e.target.value))}
                                >
                                    <option value={1}>Low</option>
                                    <option value={2}>Medium</option>
                                    <option value={3}>High</option>
                                    <option value={4}>Extreme</option>
                                </select>
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="signupbutton"
                        onClick={() =>
                            setMembers([
                                ...members,
                                { memName: "", is_adult: false, labor_limit: 1 }
                            ])
                        }>
                        Add Family Member
                    </button>
                    <button className='signupbutton' type="submit">
                        <b>Create account</b>
                    </button>
                    <br />
                </form>
            </div>
        </>
    )
}
export default Signup;
