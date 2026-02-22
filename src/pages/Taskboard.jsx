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
import React, { useState, useEffect } from 'react';
import { supabase } from "../supabaseClient";
import TaskInput from "./TaskInput";
import { assignTasks } from "../utils/assignTasks";
import { expandTasks} from "../utils/expandTasks.js";

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
    const today = new Date();
    const todayStr = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    ).toISOString().split("T")[0];

    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    const nextWeekStr = nextWeek.toISOString().split("T")[0];

    const [assignedTasks, setAssignedTasks] = useState([]);
    const [openMenu, setOpenMenu] = useState(null);

    useEffect(() => {
        const fetchAssignedTasks = async () => {
            const { data, error } = await supabase
                .from("TaskAssigned")
                .select(`
          assignmentID,
          complete,
          scheduled_date,
          TaskTemplate (
            title,
            duration,
            time_day,
            labor
          )
        `)
                .eq("memID", member.memID)
                .gte("scheduled_date", todayStr)
                .lte("scheduled_date", nextWeekStr)
                .order("scheduled_date", {ascending: true })


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

                        // fix timezone shift by constructing local date
                        const [year, month, day] = assignment.scheduled_date.split("-");
                        const localDate = new Date(year, month - 1, day);

                        const weekday = localDate.toLocaleDateString("en-US", { weekday: "short",
                                timeZone: "America/New_York" });
                        return (
                            <div className="taskButtonWide" key={assignment.assignmentID}>

                                {/* Dropdown wrapper */}
                                <div style={{
                                    position: "relative",
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px"
                                }}>

                                    <input
                                        type="checkbox"
                                        className="taskCheckbox"
                                        checked={assignment.complete}
                                        onChange={async () => {
                                            const newValue = !assignment.complete;

                                            const {error} = await supabase
                                                .from("TaskAssigned")
                                                .update({complete: newValue})
                                                .eq("assignmentID", assignment.assignmentID);

                                            if (!error) {
                                                setAssignedTasks(prev =>
                                                    prev.map(t =>
                                                        t.assignmentID === assignment.assignmentID
                                                            ? {...t, complete: newValue}
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
                                    <span className="dayOfWeek">{weekday}</span>
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

                                    <img src={periodImages[task.time_day]} alt={task.time_day} className="periodIcon"/>

                                    {/* Three-dot menu */}
                                    <span
                                        style={{cursor: "pointer", fontSize: "20px", padding: "0 6px"}}
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
                                            <div style={{padding: "6px 12px", fontWeight: 600}}>
                                                Reassign task to:
                                            </div>

                                            {members
                                                .filter(m => m.memID !== member.memID)
                                                .map(m => (
                                                    <div
                                                        key={m.memID}
                                                        style={{padding: "6px 12px", cursor: "pointer"}}
                                                        onClick={async () => {
                                                            await supabase
                                                                .from("TaskAssigned")
                                                                .update({memID: m.memID})
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

    const [unassignedTasks, setUnassignedTasks] = useState([]);
    const fetchUnassignedTasks = async () => {
        if (!famID) return;

        const { data: templates, error: templateError } = await supabase
            .from("TaskTemplate")
            .select("*")
            .eq("famID", famID);

        if (templateError) {
            console.error("TEMPLATE FETCH ERROR:", templateError);
            return;
        }

        const { data: assigned, error: assignedError } = await supabase
            .from("TaskAssigned")
            .select("taskID");

        if (assignedError) {
            console.error("ASSIGNED FETCH ERROR:", assignedError);
            return;
        }

        const assignedIDs = assigned.map(a => a.taskID);

        const filtered = templates.filter(
            t => !assignedIDs.includes(t.taskID)
        );

        setUnassignedTasks(filtered);
    };
    useEffect(() => {
        fetchUnassignedTasks();
    }, [famID]);

    const handleDistribute = async () => {

        const expandedTasks = expandTasks(unassignedTasks);

        const todayStr = new Date().toISOString().split("T")[0];

        const { data: existingAssignments } = await supabase
            .from("TaskAssigned")
            .select(`
            memID,
            TaskTemplate (
                duration,
                labor
            )
        `)
            .gte("scheduled_date", todayStr);


        // run the round-robin algorithm
        const result = assignTasks(
            members,
            expandedTasks,
            existingAssignments || []
        );
        const inserts = [];

        result.members.forEach(member => {
            member.assigned_tasks.forEach(task => {
                inserts.push({
                    memID: member.memID,
                    taskID: task.taskID,
                    scheduled_date: task.scheduled_date,
                    complete: false
                });
            });
        });
        const { error } = await supabase
            .from("TaskAssigned")
            .insert(inserts);

        if (error) {
            console.error("INSERT ERROR:", error);
            alert("Something went wrong inserting assignments.");
            return;
        }
        setUnassignedTasks([]); // hide the div
        window.location.reload();
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
            {unassignedTasks.length > 0 && (
                <div className="member centered-member widened-member">
                    <h2 className="memberName">Unassigned Tasks</h2>
                    <div className="task-section">
                        <p className="unassigned-subtitle">
                            Add several tasks before distributing to ensure a fair and balanced workload.
                        </p>
                        <div className="task-list">
                            {unassignedTasks.map(task => (
                                <div className="taskButtonWide" key={task.taskID}>
                                    <span className="taskName">{task.title}</span>

                                    <button
                                        className="timeButtonInner"
                                        style={{color: "#fff"}}
                                    >
                                        {task.duration > 60
                                            ? `${Math.floor(task.duration / 60)} hr ${task.duration % 60} min`
                                            : `${task.duration} min`}
                                    </button>

                                    <img
                                        src={periodImages[task.time_day]}
                                        alt={task.time_day}
                                        className="periodIcon"
                                    />
                                </div>
                            ))}
                            <div className="distribute-button-wrapper">
                                <button
                                    className="addTaskButton"
                                    onClick={handleDistribute}
                                >
                                    Distribute Tasks
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
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
            <TaskInput onClose={() => {
                setIsTaskInputOpen(false);
                fetchUnassignedTasks();
            }} famID={famID} />
    )}
        </>
    )
}

export default Taskboard;