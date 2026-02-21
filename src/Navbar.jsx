import { Link } from 'react-router-dom';
import "./Navbar.css"
 import viteLogo from './assets/vite.svg'

function Navbar() {
    return(
        <>
        <nav className="nav">
        <ul className="list">
            <li><Link to="/"><img src={viteLogo} className="nav-logo"/></Link></li>
            <li className="navbar-content"><Link to="/">uVisible</Link></li>
            <li className="navbar-content"><Link to="/Login">Login</Link></li>
            <li className="navbar-content"><Link to="/Taskboard">Taskboard</Link></li>
        </ul>
    </nav>
        </>
    );
}

export default Navbar;