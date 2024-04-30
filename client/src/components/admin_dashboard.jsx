// // AdminComplaints.js
// import React, { useEffect, useState } from 'react';
// // import axios from 'axios';

// const AdminComplaints = () => {
//     const [complaints, setComplaints] = useState([]);

//     useEffect(() => {
//         const fetchData = async () => {
//             const jwttoken = window.localStorage.getItem('token')
//             try {
//                 const response = await fetch('http://localhost:4000/api/tickets/get_all', {
//                     method: 'GET',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Authorization': `${jwttoken}`,
//                     },
//                 });
//                 if (response.ok) {
//                     const data = await response.json();
//                     console.log(data)
//                     setComplaints(data);
//                 } else {
//                     console.error('Failed to fetch analysis data');
//                 }
//             } catch (error) {
//                 console.error('Error fetching analysis data:', error);
//             }
//         };

//         fetchData();
//     }, []);

//     return (
//         <div>
//             <h2>All Complaints</h2>

//             {complaints.map(complaint => (
//                 <div key={complaint._id}>
//                     <span>{complaint.title}</span>
//                     <p>{complaint.description}</p>
//                     <span>{complaint.user}</span>
//                     <span>{complaint.status}</span>
//                     <p>AssignTo :- <span>{complaint.assignedTo}</span></p>
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default AdminComplaints;
import React, { useEffect, useState } from 'react';
import './admin_dashboard.css'; // Import the CSS file
import axios from 'axios'
import { useNavigate } from 'react-router';

const AdminComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const navigate = useNavigate()
    
    useEffect(() => {

        fetchData();
    }, []);

    const fetchData = async () => {
        const jwttoken = window.localStorage.getItem('token')
        try {
            const response = await fetch('http://localhost:4000/api/tickets/get_all', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${jwttoken}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data)
                setComplaints(data);
            } else {
                console.error('Failed to fetch analysis data');
            }
        } catch (error) {
            console.error('Error fetching analysis data:', error);
        }
    };

    const handleAssignedToChange = async (id, assignedTo) => {
        try {
            const jwttoken = window.localStorage.getItem('token');
            const response = await axios.patch(`http://localhost:4000/api/tickets/ticket/${id}`, { assignedTo }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${jwttoken}`,
                },
            });
            console.log(response.data);
            fetchData() // Handle response if needed
        } catch (error) {
            console.error('Error updating assignedTo:', error);
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            const jwttoken = window.localStorage.getItem('token');
            const response = await axios.patch(`http://localhost:4000/api/tickets/ticket/${id}`, { status }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${jwttoken}`,
                },
            });
            fetchData()
            console.log(response.data); // Handle response if needed
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };
    const handleLogout = () => {
        window.localStorage.removeItem('token');
        navigate('/login'); 
    };

    return (
        <div>
            <h1 className='title'>Admin Dashboard</h1>
            <button className='admin_logout' onClick={handleLogout}>Logout</button>
            <div className='main_container'>
                {complaints.map(complaint => (
                    <div key={complaint._id} className="complaint-container">
                        <div>
                            <span className='complaint'>Title : {complaint.title}</span><br></br>
                            {/* <p> : {complaint.description}</p> */}
                            <span className='complaint' Description={complaint.description.length > 15 ? complaint.description : ''}>
                            Description : {complaint.description.length > 15 ? `${complaint.description.slice(0, 15)}...` : complaint.description}
                            </span><br></br>
                            <span className='complaint'>User : {complaint.user}</span>
                        </div>
                        <div>
                            <p>AssignTo:</p>
                            <select value={complaint.assignedTo} onChange={(e) => handleAssignedToChange(complaint._id, e.target.value)}>
                                <option value="savan">Savan</option>
                                <option value="jay">Jay</option>
                                <option value="dhruv">Dhruv</option>
                                <option value="meet">Meet</option>
                            </select>
                        </div>
                        <div>
                            <p>Status:</p>
                            <select value={complaint.status} onChange={(e) => handleStatusChange(complaint._id, e.target.value)}>
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                            </select>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminComplaints;
