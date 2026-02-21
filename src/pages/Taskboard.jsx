import Navbar from "../Navbar";
import './Taskboard.css'

function Taskboard() {
    return(
        <>
            <Navbar />
            <h1 className="heading">Welcome Maria</h1>
            <div className="member">
                <h2 className="memberName">Mom</h2>
                <h3 className="frequency">--daily--</h3>
                <p className="task">Dishes</p>
                <p className="task">Walk dog</p>
                <p className="task">pick up kids from school</p>
                <h3 className="frequency">--weekly--</h3>
                <p className="task">Pick up dry cleaning</p>

            </div>
        </>
    )
}

export default Taskboard;