import React, { useState } from 'react'
import '../style/register.css'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import BACKEND_URL from '../api/config'
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
        axios.post(`${BACKEND_URL}/register`, { name, email, password }, { withCredentials: true })
            .then(result => {
                toast.success("User created successfully", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            })
            .catch(err => console.log("user not created", err));

    }
    return (
        <div className="main">
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
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



