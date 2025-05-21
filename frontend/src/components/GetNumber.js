import React, { useEffect, useState } from 'react'
import "../style/GetNumber.css"
import axios from "axios";
import BACKEND_URL from '../api/config'


const GetNumber = () => {
    const [uniqueCars, setUniqueCars] = useState([])
    const [getNumberState, setGetNumberState] = useState(false)
    const [userName, setUserName] = useState("")
    
    const getNumber = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/cars`); // Fetch car data
            setUniqueCars(response.data.uniqueCars); // Set unique cars
            setGetNumberState(true) // Set getNumberState to true
            console.log(uniqueCars); // Log the unique cars data
        } catch (error) {
            console.error("Error fetching car data:", error);
        }
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/user/profile`, {withCredentials: true}); // Fetch user profile data
                setUserName(response.data); // Set the user name from the response
                console.log(response.data); // Log the user profile data
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        }
        fetchUserProfile(); // Call the function to fetch user profile data
    }, []); // Dependency array includes uniqueCars   

    return (
        <div className='getNumber-main'>
            <button className='getNumber' onClick={getNumber}>Get Number</button>
            <div className='getNumber-container'>
                <h2>{userName.name}</h2>
                <h3>Allowed Number:<span>{uniqueCars.length}</span></h3>
            </div>

            <div>
                {getNumberState &&
                    <table >
                        <tr className='table-header'>
                            <th>car Number</th>
                            <th>car Name</th>
                            <th>price</th>
                            <th>location</th>
                        </tr>
                        {uniqueCars.map((car, index) => (
                            <tr key={index}>
                                <td>{car.number}</td>
                                <td>{car.carName}</td>
                                <td>{car.price}</td>
                                <td>{car.location}</td>
                            </tr>
                        ))}
                    </table>
                }

            </div>
        </div>
    )
}

export default GetNumber
