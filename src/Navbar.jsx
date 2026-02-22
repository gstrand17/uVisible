import { Link } from 'react-router-dom';
import "./Navbar.css"
import logo from './assets/House-removebg-preview (1).png'

function Navbar() {
    return(
        <>
        <nav className="nav">
        <ul className="list">
            <li className="navbar-content"><Link to="/">uVisible</Link></li>
            <li><img src={logo} className="nav-logo" alt="Logo" /></li>
            <li className="navbar-content"><Link to="/"uVisible>Logout</Link></li>
        </ul>
    </nav>
        </>
    );
}

export default Navbar;