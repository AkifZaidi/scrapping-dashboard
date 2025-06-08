import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import "../style/GetNumber.css"
import axios from "axios";
import BACKEND_URL from '../api/config'


const GetNumber = () => {
    const [uniqueCars, setUniqueCars] = useState([])
    const [disabledCarIds, setDisabledCarIds] = useState([]);
    const [getNumberState, setGetNumberState] = useState(false)
    const [userName, setUserName] = useState("")
    const [selectedCars, setSelectedCars] = useState([])
    const navigate = useNavigate();

    const getNumber = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/cars`); // Fetch car data
            setUniqueCars(response.data.uniqueCars); // Set unique cars
            setGetNumberState(true) // Set getNumberState to true
        } catch (error) {
            console.error("Error fetching car data:", error);
        }
    };

    

    const singleCheck = (car) => {
        const alreadySentCars = JSON.parse(localStorage.getItem("sentCars") || "[]");

        if (alreadySentCars.includes(car._id)) {
            alert("This car's data has already been sent!");
            return;
        }

        let existingCars = JSON.parse(localStorage.getItem("cars") || "[]");
        if (!Array.isArray(existingCars)) {
            existingCars = [existingCars];
        }

        const isAlreadyInList = existingCars.some(c => c._id === car._id);
        if (isAlreadyInList) {
            toast.success('This car is already selected!', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            return;
        }
        const updatedCars = [...existingCars, car];
        localStorage.setItem("cars", JSON.stringify(updatedCars));
        setSelectedCars(prev => [...prev, car._id]);
        setDisabledCarIds(prev => [...prev, car._id]);
    };

    const singleUnCheck = (car) => {
        console.log("Unselected Car:", car);
        setSelectedCars(prev => prev.filter(id => id !== car._id)); // Remove the unselected car ID from the selectedCars state
    }

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/user/profile`, { withCredentials: true }); // Fetch user profile data
                setUserName(response.data); // Set the user name from the response
            } catch (error) {
                console.error("Error fetching user profile:", error);
                navigate("/"); // Redirect to login if there's an error
            }
        }
        fetchUserProfile(); // Call the function to fetch user profile data
    }, []); // Dependency array includes uniqueCars   

    return (
        <div className='getNumber-main'>
            <ToastContainer
                position="top-center"
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
            <button className='getNumber' onClick={getNumber}>Get Number</button>
            <div className='getNumber-container'>
                <h2>
                    {userName.name}
                </h2>
                <h3>Allowed Number:<span>{uniqueCars.length}</span></h3>
            </div>

            {getNumberState ? (
                <div className='getNumber-table'>
                    <table>
                        <thead>
                            <tr className='table-header'>
                                <th>Car Number</th>
                                <th>Car Name</th>
                                <th>Price</th>
                                <th>Location</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        {[...uniqueCars].reverse().map((car, index) => (
                            <tbody key={index}>
                                <tr key={index}>

                                    <td>{car.number}</td>
                                    <td>{car.carName}</td>
                                    <td>{car.price}</td>
                                    <td>{car.location}</td>
                                    <td>
                                        {selectedCars.includes(car._id) ? (
                                            <button disabled={disabledCarIds.includes(car._id)} >
                                                <i
                                                    className="ri-close-fill"
                                                    onClick={() => {
                                                        if (!disabledCarIds.includes(car._id)) singleUnCheck(car);
                                                    }}
                                                ></i>
                                            </button>
                                        ) : (
                                            <button disabled={disabledCarIds.includes(car._id)}>
                                                <i
                                                    className="ri-check-double-line"
                                                    onClick={() => {
                                                        if (!disabledCarIds.includes(car._id)) singleCheck(car);
                                                    }}
                                                ></i>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        ))}
                    </table>
                </div>
            ) : (
                <div className='no-data-message'>
                    <p>No car data available. Please click the "Get Number" button to fetch car details.</p>
                </div>
            )}
        </div>
    )
}

export default GetNumber