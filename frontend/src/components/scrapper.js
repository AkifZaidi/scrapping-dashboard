import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import "../style/scrapper.css"
import { gsap } from "gsap"; // GSAP import kiya
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BACKEND_URL from '../api/config'

gsap.registerPlugin(ScrollTrigger);

const Scrapper = () => {
  const [number, setNumber] = useState("");
  const [carName, setCarName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [emptyFile, setEmptyFile] = useState(""); // ✅ new state
  const [uniqueCars, setUniqueCars] = useState([]);
  const [fileUploaded, setFileUploaded] = useState(false); // ✅ new state

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
      await axios.post(`${BACKEND_URL}/scrape`, {
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileUploaded(true); // ✅ input disable karne ke liye

    toast.success('Uploaded Successfully!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      // Remove duplicates based on all four fields
      const uniqueData = removeDuplicates(jsonData);
      setUniqueCars(uniqueData);
      console.log("Filtered Unique Data: ", uniqueData);

      // You can send this data to the backend if needed
      axios.post(`${BACKEND_URL}/upload`, uniqueData)
        .then(() => console.log("Data uploaded"))
        .catch(err => console.error("Upload error:", err));
    };
    reader.readAsArrayBuffer(file);
    setEmptyFile(""); // Reset the file input value
    e.target.value = ""; // Clear the file input after reading
  };

  // Helper function to remove duplicates
  const removeDuplicates = (data) => {
    const seen = new Set();
    return data.filter((item) => {
      const key = `${item.number}-${item.carName}-${item.location}-${item.price}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  return (
    <>
      <div className="userPanel__Container">
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
        <div className="scrapper__main">
          <h2>Scrapper</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="number"
              placeholder="Car Number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
              disabled={fileUploaded}
            />
            <br />
            <input
              type="text"
              placeholder="Car Name"
              value={carName}
              onChange={(e) => setCarName(e.target.value)}
              required
              disabled={fileUploaded}
            />
            <br />
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              disabled={fileUploaded}
            />
            <br />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              disabled={fileUploaded}
            />
            <input
              type="file"
              value={emptyFile}
              accept=".csv, .xlsx"
              onChange={(e) => handleFileChange(e)}
            />
            <button type="submit" disabled={fileUploaded}>Submit</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Scrapper;