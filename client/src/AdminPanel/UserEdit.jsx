import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useAuth } from '../Store/Auth';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import './Admin.css'
import { toast } from 'react-toastify';
import { BASE_URL } from '../../config.js';

function UserEdit() {
    const [userDetail, setUserDetail] = useState({ name: '', email: '', phone: '' });

    const {userId} = useParams();
    const {darkMode, authorization, user} = useAuth();
    const navigate = useNavigate();

    if(!user || (user.role !== 'Admin' && user.role !== 'Moderator')){
        return <Navigate to="/admin" replace />
    }
    

    const getUserDataById = async() => {
        try {
            const response = await fetch(`${BASE_URL}/api/yoga/admin/user/${userId}`, {
                method: "GET",
                headers: {
                    Authorization: authorization,
                }
            })

            const data = await response.json();
            // console.log(data);

            if(response.ok){
                setUserDetail(data.user);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleInputChange = (e) => {
        setUserDetail((prev) => ({
            ...prev,
            [e.target.name] : e.target.value
        }))
    }

    const handleEditDataSubmit = async(e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${BASE_URL}/api/yoga/admin/user/edit/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authorization,
                },
                body: JSON.stringify(userDetail)
            })

            const data = await response.json();
            // console.log(data)

            if(response.ok){
                navigate("/admin/users")
                toast.success("Update Successfully");
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getUserDataById()
    }, []);

  return (
    <>
      <section className="admin-edit-user">
      <h1 className="text-primary mb-4">Edit user Details</h1>
      <Form onSubmit={handleEditDataSubmit}>
      <Form.Group className="mb-3" controlId="name">
          <Form.Label className={`${darkMode ? 'text-white' : 'text-black'}`}>Name:</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={userDetail.name || ""}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label className={`${darkMode ? 'text-white' : 'text-black'}`}>Email:</Form.Label>
          <Form.Control
            type="text"
            name="email"
            value={userDetail.email || ""}
            onChange={handleInputChange}
            placeholder="Enter Email"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="phone">
          <Form.Label className={`${darkMode ? 'text-white' : 'text-black'}`}>Phone:</Form.Label>
          <Form.Control
            type="number"
            name="phone"
            value={userDetail.phone || ""}
            onChange={handleInputChange}
            placeholder="Enter Phone No."
            required
          />
        </Form.Group>

            <Button variant="primary" type="submit" className="fs-5 m-1">
            Update
            </Button>
        </Form>
      </section>
    </>
  )
}

export default UserEdit
