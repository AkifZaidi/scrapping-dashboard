import React, { useEffect, useState } from "react";
import "../style/scrapperList.css";
import axios from "axios";
import BACKEND_URL from "../api/config"; // Adjust the import path as needed
import { useLocation } from "react-router-dom";


function ScrapperList() {
    const [uniqueCars, setUniqueCars] = useState([]);
    const [myNumberState, setMyNumberState] = useState(false)
    const location = useLocation();
    const selectedCars = location.state?.selectedCars || JSON.parse(localStorage.getItem("selectedCars") || "[]");
    const cars = location.state?.car || JSON.parse(localStorage.getItem("cars") || "[]");

    useEffect(() => {
    const fetchUniqueCars = async () => {
        if (selectedCars.length === 0) return; // avoid empty request
        try {
            const response = await axios.get(`${BACKEND_URL}/selectedCars`, {
                params: { selectedCars: JSON.stringify(selectedCars) }
            });
            setUniqueCars(response.data.selectedCarsData);
            setMyNumberState(true);
        } catch (error) {
            console.error("Error fetching unique cars:", error);
        }
    };

    fetchUniqueCars(); // Call the function to fetch unique cars
    }, [selectedCars]); // Empty dependency array to run only once

    useEffect(() => {
    const fetchCars = async () => {
        if (cars.length === 0) return; // avoid empty request
        try {
            const response = await axios.get(`${BACKEND_URL}/selectedCars`, {
                params: { selectedCars: JSON.stringify(cars) }
            });
            setUniqueCars(response.data.selectedCarsData);
            setMyNumberState(true);
        } catch (error) {
            console.error("Error fetching unique cars:", error);
        }
    };

    fetchCars(); // Call the function to fetch unique cars
    }, [cars]); // Empty dependency array to run only once

    return (
        <div className="scrapperList-main">
            <h3 className="car-heading">
                Car Listings
            </h3>

            <h4 className="heading-Unique">Unique Cars</h4>
            {!myNumberState ? (
                <div className="no-cars-message">
                    <p>No unique cars found.</p>
                </div>
            ) : (
                <div className="cars-table">
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
            )}
        </div>
    );
}

export default ScrapperList;