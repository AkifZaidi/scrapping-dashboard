import React, { useState } from 'react'
import '../style/register.css'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
// import Login from '../components/login'


function CreateUser() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    let Navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        setName("")
        setEmail("")
        setPassword("")
        axios.post("http://localhost:3000/register", { name, email, password })
            .then(result => {
                console.log(result)
            })
            .catch(err => console.log(err));

    }
    return (
        <div className="main">
            <div className="container">
                <div className="header">
                    <h1>User Registration Form</h1>
                </div>
                <div className="form">
                    <form onSubmit={handleSubmit}>
                        <input
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            name="name"
                            value={name}
                            placeholder="User Name"
                        />
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            name="email"
                            value={email}
                            placeholder="Email"
                        />
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            name="password"
                            value={password}
                            placeholder="Password"
                        />
                        <button type='submit'> Register</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default CreateUser;



