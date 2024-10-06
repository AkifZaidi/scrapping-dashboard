import axios from 'axios'
import "../style/user.css"
import React, { useEffect, useState } from 'react'

export default function User() {
    const [renderUser, setRenderUser] = useState([]);

    // Fetch the user data when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post("http://localhost:3000/user");
                setRenderUser(response.data);  // Assuming response.data is an array of users
            } catch (error) {
                console.error("Error fetching user data", error);
            }
        };
        fetchData();
    }, []); // Empty dependency array means this runs once when the component mounts

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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}
