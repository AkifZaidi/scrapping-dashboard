import React, { useEffect, useState } from 'react'
import axios from 'axios'
import "../style/user.css"
import BACKEND_URL from '../api/config'
import { toast } from 'react-toastify';


export default function User() {
    const [renderUser, setRenderUser] = useState([]);

    // Fetch the user data when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post(`${BACKEND_URL}/user`); // Fetch user data
                setRenderUser(response.data);  // Assuming response.data is an array of users
            } catch (error) {
                console.error("Error fetching user data", error);
            }
        };
        fetchData();
    }, []); // Empty dependency array means this runs once when the component mounts

    const userDelete = async (id) => {
        try {
            const response = await axios.post(`${BACKEND_URL}/delete`, { id });
            toast.success("User deleted successfully");
        } catch (error) {
            console.error("Delete failed", error);
            toast.error("Failed to delete user");
        }
    };

    return (
        <section className="container mx-auto p-6 font-mono">
            <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg flex justify-center">
                <div className="w-full overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr
                                className="text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600">
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {renderUser.map((data, key) => (
                                <tr className="text-gray-700" key={key}>
                                    <td className="px-4 py-3 border">
                                        <div className="flex items-center text-sm">
                                            <div>
                                                <p className="font-semibold">{data.name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border text-md font-semibold">
                                        {data.email}
                                    </td>
                                    <td className="px-4 py-3 border text-sm">
                                        {data.date}
                                    </td>
                                    <td className="px-4 py-3 border text-sm">
                                        <button onClick={() => userDelete(data._id)}><i className="ri-delete-bin-5-line"></i></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}