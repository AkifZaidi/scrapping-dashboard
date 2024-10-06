import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/scrapper.css"
import { gsap } from "gsap"; // GSAP import kiya
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Scrapper = () => {
  const [number, setNumber] = useState("");
  const [carName, setCarName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    // Form container ke liye fade-in effect jab component load ho
    gsap.fromTo(
      ".userPanel__Container",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );

    // Input fields ke liye staggered animation jab form render ho
    gsap.fromTo(
      "input",
      { opacity: 0, x: -100 },
      { opacity: 1, x: 0, duration: 0.8, stagger: 0.2 }
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form submit hone ke baad button ke liye animation
    gsap.to("button", { scale: 1.2, duration: 0.2, ease: "power3.inOut" });
    
    setNumber("");
    setCarName("");
    setLocation("");
    setPrice("");
    
    try {
      // Axios request to send input to the backend
      await axios.post("http://localhost:3000/scrape", {
        number,
        carName,
        location,
        price,
      });
    } catch (error) {
      if (error.response) {
        console.error("Backend responded with an error:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error in request setup:", error.message);
      }
    }
  };

  return (
    <>
      <div className="userPanel__Container">
        <div className="scrapper__main">
          <h2>Scrapper</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="number"
              placeholder="Car Number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
            />
            <br />
            <input
              type="text"
              placeholder="Car Name"
              value={carName}
              onChange={(e) => setCarName(e.target.value)}
              required
            />
            <br />
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <br />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Scrapper;