import Navbar from "../Navbar";
import './Login.css'
import { useNavigate} from "react-router-dom";
import { useState } from "react";
import { supabase } from "../supabaseClient";

function Signup() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [members, setMembers] = useState([
        { memName: "", is_adult: false, labor_limit: 1 }
    ]);

    function updateMember(index, field, value) {
        const updated = [...members];
        updated[index][field] = value;
        setMembers(updated);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

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
            alert(userError.message);
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
            alert(memberError.message);
            return;
        }

        localStorage.setItem("family", JSON.stringify({
            famID: currFamID,
            famUser: username
        }));
        navigate("/Taskboard");
    };


    return(
        <>
            <Navbar />
            <br />
            <h1 className = "header" > Create a new family account</h1>

            <div className = "login-container">
                <form className="login-form" onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Choose Family Username</label>
                        <input type='text'
                               value={username}
                               onChange={(e) => setUsername(e.target.value)}
                               id='username'/>
                    </div>
                    <div className="form-group">
                        <label>Choose Family Password</label>
                        <input type='text'
                               value={password}
                               onChange={(e) => setPassword(e.target.value)}
                               id='choose-password'/>
                    </div>
                    <div className="form-group">
                        <label>Confirm Family Password</label>
                        <input type='text' id='confirm-password'/>
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
