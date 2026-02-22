import Navbar from "../Navbar";
import './Taskboard.css'
import night from "../assets/night.png" 
import morning from "../assets/morning.png"
import afternoon from "../assets/afternoon.png"
import Confetti from '../Confetti';
import React,{ useState, useEffect } from 'react';
import { supabase } from "../supabaseClient";
import TaskInput from "./TaskInput";

function MemberSelectionModal({ members, onSelect }) {
    const randomColor = () =>
        // eslint-disable-next-line react-hooks/purity
        "#" + Math.floor(Math.random()*16777215).toString(16);

    return (
        <div className="modal-overlay-user">

            <div className="modal-content-user">
                <h2>Who's contributing?</h2>
                <div className="circle-container">
                    {members.map(member => (
                        <div
                            key={member.memID}
                            className="memberCircleWrapper"
                            onClick={() => onSelect(member)}
                        >
                            <div
                                className="memberCircle"
                                style={{ backgroundColor: randomColor() }}
                            />
                            <p>{member.memName}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

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
                                       onChange={() =>setShowConfetti(true)}/>
                                <span className="taskName">{task.title}</span>
                                <button className="timeButtonInner" style={{color: '#fff'}}>
                                    {task.duration > 60
                                         ? `${Math.floor(task.duration / 60)} hr ${task.duration % 60} min`
                                         : `${task.duration} min`}
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

    useEffect(() => {
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
    const famData = JSON.parse(localStorage.getItem("family"));
    const famID = famData?.famID;


    const [activeMember, setActiveMember] = useState(() => {
        const stored = localStorage.getItem("activeMember");
        return stored ? JSON.parse(stored) : null;
    });
    const [showMemberModal, setShowMemberModal] = useState(!activeMember);

    const handleMemberSelect = (member) => {
        localStorage.setItem("activeMember", JSON.stringify(member));
        setActiveMember(member);
        setShowMemberModal(false);
    };

    return(
        <>
            <Navbar/>
            {showMemberModal && members.length > 0 && (
                <MemberSelectionModal
                    members={members}
                    onSelect={handleMemberSelect}
                />
            )}
            <h1 className="heading">Welcome back, {activeMember?.memName}</h1>
            <button
                className="addTaskButton"
                onClick={() => setIsTaskInputOpen(true)}
            >
                + Add Task
            </button>
            {activeMember && (
                <>
                    <MemberSelection
                        key={activeMember.memID}
                        member={activeMember}
                        periodImages={periodImages}
                        setShowConfetti={setShowConfetti}
                    />

                    {members
                        .filter(m => m.memID !== activeMember.memID)
                        .map(member => (
                            <MemberSelection
                                key={member.memID}
                                member={member}
                                periodImages={periodImages}
                                setShowConfetti={setShowConfetti}
                            />
                        ))}
                </>
            )}
            {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}
            {isTaskInputOpen && (
            <TaskInput onClose={() => setIsTaskInputOpen(false)} famID={famID} />
    )}
        </>
    )
}

export default Taskboard;