import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { gsap } from "gsap";
import "../style/scrapperList.css";

function ScrapperList() {
    const [uniqueCars, setUniqueCars] = useState([]); // State for unique cars
    const [duplicateCars, setDuplicateCars] = useState([]); // State for duplicate cars
    const uniqueTableRef = useRef(null); // Reference for unique cars table
    const duplicateTableRef = useRef(null); // Reference for duplicate cars table
    const headingRef = useRef(null); // Reference for the heading

    const fetchCars = async () => {
        try {
            const response = await axios.get("http://localhost:3000/cars");
            setUniqueCars(response.data.uniqueCars); // Set unique cars
            setDuplicateCars(response.data.duplicateCars); // Set duplicate cars
        } catch (error) {
            console.error("Error fetching car data:", error);
        }
    };

    useEffect(() => {
        fetchCars(); // Fetch car data when component mounts
    }, []);

    useEffect(() => {
        // Heading cinematic reveal animation
        gsap.fromTo(
            headingRef.current,
            { opacity: 0, scale: 0.5, color: "#ff0000" },
            {
                opacity: 1,
                scale: 1.2,
                color: "#0000ff",
                duration: 3,
                ease: "power3.out",
            }
        );

        // Unique cars table animation
        if (uniqueCars.length > 0) {
            gsap.fromTo(
                uniqueTableRef.current.querySelectorAll("tr"),
                { opacity: 0, scale: 0.5 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 3,
                    stagger: 0.2,
                    ease: "elastic.out(1, 0.5)",
                }
            );
        }

        // Duplicate cars table animation
        if (duplicateCars.length > 0) {
            gsap.fromTo(
                duplicateTableRef.current.querySelectorAll("tr"),
                { opacity: 0, scale: 0.5 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 3,
                    stagger: 0.2,
                    ease: "elastic.out(1, 0.5)",
                }
            );
        }
    }, [uniqueCars, duplicateCars]);

    return (
        <div className="scrapperList-main">
            <h3 ref={headingRef} className="car-heading cinematic-heading">
                Car Listings
            </h3>

            <h4 className="heading-Unique">Unique Cars</h4>
            <table border={2} ref={uniqueTableRef}>
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
            {duplicateCars.length > 0 ? (
                <>
                    <h4 className="heading-Unique">Duplicate Cars</h4>
                    <table border={2} ref={duplicateTableRef}>
                        <thead>
                            <tr>
                                <th>Car Number</th>
                                <th>Car Name</th>
                                <th>Price</th>
                                <th>Location</th>
                            </tr>
                        </thead>
                        <tbody>
                            {duplicateCars.map((car, index) => (
                                <tr key={index}>
                                    <td>{car.number}</td>
                                    <td>{car.carName}</td>
                                    <td>{car.price}</td>
                                    <td>{car.location}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            ) : null}

        </div>
    );
}

export default ScrapperList;
