import './App.css'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Taskboard from './pages/Taskboard'

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/login" element={<Login/>} />
                    <Route path="/taskboard" element={<Taskboard />} />
                </Routes>
            </BrowserRouter>
        </>

    );
}

export default App
