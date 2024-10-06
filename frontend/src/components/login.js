import React, { useState } from 'react'
import '../style/login.css'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'



function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [accessUser, setAccessUser] = useState("")
    let Navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post("http://localhost:3000/login", { email, password })
            .then(result => {
                if (result.data.role === "admin") {
                    Navigate("/adminpanel/createUser");
                } else if (result.data.role === "user") {
                    Navigate("/userpanel/scrapper");
                } else if (result.data.role === "unauthorized") {
                    setAccessUser("Unauthorized access");
                }
            })
            .catch(err => {
                console.log(err);
                setAccessUser("Login failed. Please try again.");
            });

    }
    return (
        <div className="login-main">
            <div className="login-container">
                <div className="header">
                    <h1>Dashboard Login Form</h1>
                </div>
                <div className="form">
                    <form onSubmit={handleSubmit}>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            name="email"
                            placeholder="Email"
                        />
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            name="password"
                            placeholder="Password"
                        />
                        <button type='submit'>Login</button>
                        <p>{accessUser}</p>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default Login;


