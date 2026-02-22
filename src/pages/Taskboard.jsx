import Navbar from "../Navbar";
import './Taskboard.css'
import night from "../assets/night.png" 
import morning from "../assets/morning.png"
import afternoon from "../assets/afternoon.png"
import Confetti from '../Confetti';
import React,{ useState, useEffect } from 'react';
import { supabase } from "../supabaseClient";
import TaskInput from "./TaskInput";


function MemberSelection({ member, periodImages, setShowConfetti }){
    console.log("Rendering member:", member);
    const [assignedTasks, setAssignedTasks] = useState([]);

    useEffect(() => {
        const fetchAssignedTasks = async () => {
            const { data, error } = await supabase
                .from("TaskAssigned")
                .select(`
          assignmentID,
          complete,
          TaskTemplate (
            title,
            duration,
            time_day
          )
        `)
                .eq("memID", member.memID);
            console.log("Member:", member.memName);
            console.log("memID:", member.memID);
            console.log("Assigned data:", data);
            console.log("Error:", error);

            if (!error) {
                setAssignedTasks(data);
            } else {
                console.error("ASSIGN FETCH ERROR:", error);
            }
        };

        fetchAssignedTasks();
    }, [member.memID]);

    return (
        <div className="member centered-member widened-member">
            <h2 className="memberName">{member.memName}</h2>
            <div className="task-section">
                <h3 className="frequency">To Do</h3>
                <div className="task-list">
                    {assignedTasks.map((assignment) => {
                        const task = assignment.TaskTemplate;

                        return (
                            <div className="taskButtonWide" key={assignment.assignmentID}>
                                <input type="checkbox"
                                       className="taskCheckbox"
                                       checked={assignment.complete}
                                       onChange={e => {
                                           if (e.target.checked) setShowConfetti(true);
                                       }}/>
                                <span className="taskName">{task.title}</span>
                                <button className="timeButtonInner"
                                        style={{color: '#fff'}}>{task.duration}
                                </button>
                                <img src={periodImages[task.time_day]}
                                     alt={task.time_day}
                                     className="periodIcon"/>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}


function Taskboard() {
    const [isTaskInputOpen, setIsTaskInputOpen] = React.useState(false);

    const periodImages = {
        morning: morning,
        afternoon: afternoon,
        night: night
    };
    const [showConfetti, setShowConfetti] = React.useState(false);
    React.useEffect(() => {
        if (showConfetti) {
            const timer = setTimeout(() => setShowConfetti(false), 1800);
            return () => clearTimeout(timer);
        }
    }, [showConfetti]);

    const [members, setMembers] = useState([]);
    const [activeMember, setActiveMember] = useState(null);

    React.useEffect(() => {
        const fetchMembers = async () => {
            const family = JSON.parse(localStorage.getItem("family"));

            if (!family) return;

            const { data, error } = await supabase
                .from("Members")
                .select("*")
                .eq("familyID", family.famID);

            if (!error) {
                setMembers(data);
            } else {
                console.error("FETCH MEMBERS ERROR:", error);
            }
        };

        fetchMembers();
    }, []);

    return(
        <>
            <Navbar/>
            <h1 className="heading">Hello {activeMember?.memName}</h1>
            <div style={{display: "flex", justifyContent: "center"}}>
                <select style={{ width: "250px", padding: "8px" }}
                    onChange={(e) => {
                        const selected = members.find(
                            m => m.memID === Number(e.target.value)
                        );
                        setActiveMember(selected);
                    }}
                >
                    <option value="">Select Member</option>
                    {members.map(member => (
                        <option key={member.memID} value={member.memID}>
                            {member.memName}
                        </option>
                    ))}
                </select>
            </div>
            <button
                className="addTaskButton"
                onClick={() => setIsTaskInputOpen(true)}
            >
                + Add Task
            </button>
            {members.map(member => (
                <MemberSelection
                    key={member.memID}
                    member={member}
                    periodImages={periodImages}
                    setShowConfetti={setShowConfetti}
                />
            ))}
            {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}
            {isTaskInputOpen && <TaskInput onClose={() => setIsTaskInputOpen(false)} />}
        </>
    )
}

export default Taskboard;