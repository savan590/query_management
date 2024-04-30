// UserDashboard.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import './user_dashboard.css'


const UserDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = window.localStorage.getItem('token');
            const response = await axios.get('http://localhost:4000/api/auth/get_ticket', {
                headers: {
                    Authorization: `${token}`,
                },
            });
            setComplaints(response.data);
        } catch (error) {
            console.error('Error fetching complaints:', error);
        }
    };

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleCreateComplaint = async () => {
        try {
            const token = window.localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:4000/api/auth/create',
                {
                    title,
                    description,
                },
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            );
            setComplaints([...complaints, response.data]);
            setTitle('')
            setDescription('')
            setOpenModal(false);
        } catch (error) {
            console.error('Error creating complaint:', error);
        }
    };

    const handleDeleteComplaint = async (id) => {
        try {
            const token = window.localStorage.getItem('token');
            await axios.delete(`http://localhost:4000/api/auth/delete/${id}`, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            setComplaints(complaints.filter((complaint) => complaint._id !== id));
        } catch (error) {
            console.error('Error deleting complaint:', error);
        }
    };
    const handleLogout = () => {
        window.localStorage.removeItem('token');
        navigate('/login'); 
    };

    return (
        <div>
            <h2 className='user_board'>User Dashboard</h2>
            <button className='user_logout' onClick={handleLogout}>Logout</button>
            <button className='create' onClick={handleOpenModal}>+ Open Complaint Ticket</button>
            <div className={openModal ? 'modal open' : 'modal'}>
                <div className="modal-content">
                    <span className="close" onClick={handleCloseModal}>&times;</span>
                    <div className='details'>
                        <span className='text_details'>Create Complaint</span>
                        <input className='title_detail' type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
                        <textarea className='desc_detail' value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description"></textarea>
                        <button className='submit' onClick={handleCreateComplaint}>Submit</button>
                    </div>
                </div>
            </div>
            <div className='view'>
                {complaints.map((complaint) => (
                    <div className='view_complaint' key={complaint._id}>
                        <h3>Title : {complaint.title}</h3>
                        <p>Description : {complaint.description}</p>
                        <p>Status: {complaint.status}</p>
                        <button className='delete_detail' onClick={() => handleDeleteComplaint(complaint._id)}>Delete</button>
                        {/* <button>Open</button> */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserDashboard;
