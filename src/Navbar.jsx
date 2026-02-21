import { Link } from 'react-router-dom';
import "./Navbar.css"
 import viteLogo from './assets/vite.svg'

function Navbar() {
    return(
        <>
        <nav class="nav">
            <ul class="list">
                <li><Link to="/"><img src={viteLogo} className="nav-logo"/></Link></li>
                <li className="WebName"><Link to="/">uVisible</Link></li>
                <li><Link to="/Login">Login</Link></li>
                <li><Link to="/Taskboard">Taskboard</Link></li>
            </ul>
        </nav>
        </>
    );
}

export default Navbar;