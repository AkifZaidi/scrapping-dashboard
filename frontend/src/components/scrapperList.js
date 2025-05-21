import React, { useEffect, useState } from "react";
import "../style/scrapperList.css";
import axios from "axios";
import BACKEND_URL from "../api/config"; // Adjust the import path as needed


function ScrapperList() {
    const [uniqueCars, setUniqueCars] = useState([]);

    useEffect(() => {
        const fetchUniqueCars = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/cars`); // Adjust the URL as needed
                console.log(response.data); // Log the response data for debugging
                setUniqueCars(response.data.uniqueCars); // Assuming the API returns unique cars in this format
            } catch (error) {
                console.error("Error fetching unique cars:", error);
            }
        };

        fetchUniqueCars(); // Call the function to fetch unique cars
    }, []); // Empty dependency array to run only once

    return (
        <div className="scrapperList-main">
            <h3 className="car-heading cinematic-heading">
                Car Listings
            </h3>

            <h4 className="heading-Unique">Unique Cars</h4>
            <table border={2}>
                <thead>
                    <tr>
                        <th>Car Number</th>
                        <th>Car Name</th>
                        <th>Price</th>
                        <th>Location</th>
                    </tr>
                </thead>
                <tbody>
                    {uniqueCars.map((car, index) => (
                        <tr key={index}>
                            <td>{car.number}</td>
                            <td>{car.carName}</td>
                            <td>{car.price}</td>
                            <td>{car.location}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ScrapperList;
