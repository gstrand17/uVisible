ls
import React from 'react';
import Navbar from '../Navbar.jsx';
import Woman from '../assets/woman.png';
import "./Home.css"
import {Link} from "react-router-dom";

function Home() {
    return (
        <>
            <div className="hero">
                <Header>Balancing the unseen tasks shouldered by women</Header>
                <img src={Woman} alt="woman" className="hero-image"></img>
            </div>
            <Link to="/Login">Login</Link>

        </>
    );
}

export default Home