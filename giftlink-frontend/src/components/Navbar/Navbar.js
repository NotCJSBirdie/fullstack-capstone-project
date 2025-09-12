import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AuthContext';

export default function Navbar() {
    const { isLoggedIn, setIsLoggedIn } = useAppContext();
    const username = sessionStorage.getItem('name');

    const handleLogout = () => {
        sessionStorage.clear();
        setIsLoggedIn(false);
        window.location.href = "/app/login";
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" to="/">GiftLink</Link>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link className="nav-link" to="/app">Gifts</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/app/search">Search</Link>
                    </li>
                    {!isLoggedIn ? (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/app/login">Login</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/app/register">Register</Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item">
                                <span className="navbar-text mx-2"><b>{username}</b></span>
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}
