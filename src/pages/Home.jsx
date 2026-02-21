import React from 'react';
import Navbar from '../Navbar.jsx';
import Woman from '../assets/woman.png';
import "./Home.css"
import {Link} from "react-router-dom";


function Home() {
    return (
        <>
            <div class="hero">
                <h1>Balancing the unseen tasks shouldered by women</h1>
                <img src={Woman} alt="woman"></img>
            </div>
            <Link to="/Login">Login</Link>

        </>
    );
}

export default Home