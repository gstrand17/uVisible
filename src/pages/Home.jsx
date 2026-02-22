import React from 'react';
import Navbar from '../Navbar.jsx';
import Woman from '../assets/woman.png';
import "./Home.css"
import {Link} from "react-router-dom";

function Home() {
    return (
        <div className="hero-inline">
            
            <div className="hero-left">
                <img src={Woman} alt="woman" className="hero-image" />
            </div>

            <div className="hero-right-stacked">
                <div className="hero-heading">
                    <h1>Balancing the unseen tasks shouldered by women</h1>
                </div>
                
                <div className="content-box">
                    <h2>uVisible is dedicated to making women’s work more visible.</h2>
                    <p>Invisible labor was first discussed by Arlene Kaplan Daniels in the 1980s, who described the unpaid and unseen tasks and responsibilities involved in managing a household and family. Studies have correlated these tasks to burnout, reduced time for self-care, imbalance in work-life balance, and increased pressure and expectations.</p>
                    <p>What uVisible to do is make women's lives easier through its calendar-tracking system. Family members will be able to see tasks which needed to be done, which aren’t always accounted for. Tasks include walking the dog, doing the dishes and dropping the kids off at soccer practice.</p>

                    <Link to="/Login" className="login-button">Login</Link>
                </div>
            </div>
        </div>
    );
}

export default Home