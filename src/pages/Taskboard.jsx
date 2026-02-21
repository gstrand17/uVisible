import Navbar from "../Navbar";
import './Taskboard.css'
import night from "../assets/night.png" 
import morning from "../assets/morning.png"
import afternoon from "../assets/afternoon.png"
import Confetti from '../Confetti';
import React from 'react';

function Taskboard() {
    const dailyTasks = [
        { name: "Dishes", time: "15 min", period: "morning" },
        { name: "Walk dog", time: "20 min", period: "afternoon" },
        { name: "Pick up kids from school and make sure they have their lunchbox", time: "30 min", period: "afternoon" }
    ];
    const weeklyTasks = [
        { name: "Pick up dry cleaning", time: "10 min", period: "night" }
    ];
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
    return(
        <>
            <Navbar />
            <h1 className="heading">Welcome Maria</h1>
            <button className="addTaskButton">+ Add Task</button>           
            
            <div className="member centered-member widened-member">
                <h2 className="memberName">Mom</h2>
                <div className="task-section">
                    <h3 className="frequency">Daily</h3>
                    <div className="task-list">
                        {dailyTasks.map((task, idx) => (
                            <div className="taskButtonWide" key={idx}>
                                <input type="checkbox" className="taskCheckbox" onChange={e => { if (e.target.checked) setShowConfetti(true); }} />
                                <span className="taskName">{task.name}</span>
                                <button className="timeButtonInner" style={{color: '#fff'}}>{task.time}</button>
                                <img src={periodImages[task.period]} alt={task.period} className="periodIcon" />
                            </div>
                        ))}
                    </div>
                    <h3 className="frequency">Weekly</h3>
                    <div className="task-list">
                        {weeklyTasks.map((task, idx) => (
                            <div className="taskButtonWide" key={idx}>
                                <input type="checkbox" className="taskCheckbox" onChange={e => { if (e.target.checked) setShowConfetti(true); }} />
                                <span className="taskName">{task.name}</span>
                                <button className="timeButtonInner" style={{color: '#fff'}}>{task.time}</button>
                                <img src={periodImages[task.period]} alt={task.period} className="periodIcon" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}
        </>
    )
}

export default Taskboard;