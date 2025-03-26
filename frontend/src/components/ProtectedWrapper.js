import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const ProductedWrapperRoute = ({ children }) => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    console.log("Protected Route Role:", storedRole); // ✅ Debugging log
    setRole(storedRole);
  }, []);

  if (role === null) {
    return <p>Loading...</p>; // ✅ Wait until role is loaded
  }

  return role === 'admin' ? children : <Navigate to="/" />;
};

export default ProductedWrapperRoute;
