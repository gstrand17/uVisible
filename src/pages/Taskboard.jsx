import Navbar from "../Navbar";
import './Taskboard.css'
import night from "../assets/night.png" 
import morning from "../assets/morning.png"
import afternoon from "../assets/afternoon.png"
import lowbat from "../assets/lowbat .png"
import mediumbat from "../assets/mediumbat .png"
import highbat from "../assets/highbat .png"
import extremebat from "../assets/extremebat.png"
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

function MemberSelection({ member, members, periodImages, batteryImages, setShowConfetti }){
    console.log("Rendering member:", member);
    const [assignedTasks, setAssignedTasks] = useState([]);
    const [openMenu, setOpenMenu] = useState(null);

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
            time_day,
            labor
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

                                {/* ✅ Dropdown wrapper */}
                                <div style={{ position: "relative", width: "100%", display: "flex", alignItems: "center", gap: "12px" }}>

                                    <input
                                        type="checkbox"
                                        className="taskCheckbox"
                                        checked={assignment.complete}
                                        onChange={async () => {
                                            const newValue = !assignment.complete;

                                            const { error } = await supabase
                                                .from("TaskAssigned")
                                                .update({ complete: newValue })
                                                .eq("assignmentID", assignment.assignmentID);

                                            if (!error) {
                                                setAssignedTasks(prev =>
                                                    prev.map(t =>
                                                        t.assignmentID === assignment.assignmentID
                                                            ? { ...t, complete: newValue }
                                                            : t
                                                    )
                                                );

                                                if (newValue) {
                                                    setShowConfetti(true);
                                                }
                                            } else {
                                                console.error("Update error:", error);
                                            }
                                        }}
                                    />

                                    <span className="taskName">{task.title}</span>

                                    <button className="timeButtonInner" style={{color: '#fff'}}>
                                        {task.duration > 60
                                            ? `${Math.floor(task.duration / 60)} hr ${task.duration % 60} min`
                                            : `${task.duration} min`}
                                    </button>
                                    <img
                                        src={batteryImages[task.labor]}
                                        alt={String(task.labor)}
                                        className="batteryIcon"
                                    />

                                    <img src={periodImages[task.time_day]} alt={task.time_day} className="periodIcon" />

                                    {/* Three-dot menu */}
                                    <span
                                        style={{ cursor: "pointer", fontSize: "20px", padding: "0 6px" }}
                                        onClick={() =>
                                            setOpenMenu(openMenu === assignment.assignmentID ? null : assignment.assignmentID)
                                        }
                                    >
                                        ⋮
                                    </span>

                                    {/* Dropdown menu */}
                                    {openMenu === assignment.assignmentID && (
                                        <div
                                            style={{
                                                position: "absolute", // ✅ absolute inside relative wrapper
                                                top: "36px",
                                                right: 0,
                                                background: "#fff",
                                                color: "#5b21b6",
                                                borderRadius: "8px",
                                                boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
                                                padding: "6px 0",
                                                zIndex: 9999, // ✅ ensure on top
                                                minWidth: "150px",
                                                overflow: "hidden",
                                            }}
                                        >
                                            <div style={{ padding: "6px 12px", fontWeight: 600 }}>
                                                Reassign task to:
                                            </div>

                                            {members
                                                .filter(m => m.memID !== member.memID)
                                                .map(m => (
                                                    <div
                                                        key={m.memID}
                                                        style={{ padding: "6px 12px", cursor: "pointer" }}
                                                        onClick={async () => {
                                                            await supabase
                                                                .from("TaskAssigned")
                                                                .update({ memID: m.memID })
                                                                .eq("assignmentID", assignment.assignmentID);

                                                            setAssignedTasks(prev =>
                                                                prev.filter(t => t.assignmentID !== assignment.assignmentID)
                                                            );

                                                            setOpenMenu(null);
                                                        }}
                                                    >
                                                        {m.memName}
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function Taskboard() {

    const [isTaskInputOpen, setIsTaskInputOpen] = useState(false);

    const periodImages = {
        morning: morning,
        afternoon: afternoon,
        night: night
    };
    const batteryImages = {
        1: lowbat,
        2: mediumbat,
        3: highbat,
        4: extremebat,
        low: lowbat,
        medium: mediumbat,
        high: highbat,
        extreme: extremebat,
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
                        members={members}
                        periodImages={periodImages}
                        batteryImages={batteryImages}
                        setShowConfetti={setShowConfetti}
                    />

                    {members
                        .filter(m => m.memID !== activeMember.memID)
                        .map(member => (
                            <MemberSelection
                                key={member.memID}
                                member={member}
                                members={members}
                                periodImages={periodImages}
                                batteryImages={batteryImages}
                                setShowConfetti={setShowConfetti}
                            />
                        ))}
                </>
            )}

            {showConfetti && (
                <Confetti onComplete={() => setShowConfetti(false)} />
            )}

            {isTaskInputOpen && (
                <TaskInput
                    onClose={() => setIsTaskInputOpen(false)}
                    famID={famID}
                />
            )}
        </>
    )
}

export default Taskboard;