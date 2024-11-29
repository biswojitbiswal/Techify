import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useAuth } from '../Store/Auth';
import { useParams, useNavigate } from 'react-router-dom';
import './Admin.css'
import { toast } from 'react-toastify';

function UserEdit() {
    const [user, setUser] = useState({ email: '', phone: '' });

    const {userId} = useParams();
    const {darkMode, authorization} = useAuth();
    const navigate = useNavigate();

    const getUserDataById = async() => {
        try {
            const response = await fetch(`https://yoga-api-five.vercel.app/api/yoga/admin/user/${userId}`, {
                method: "GET",
                headers: {
                    Authorization: authorization,
                }
            })

            const data = await response.json();
            // console.log(data);

            if(response.ok){
                setUser(data.user);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleInputChange = (e) => {
        setUser((prev) => ({
            ...prev,
            [e.target.name] : e.target.value
        }))
    }

    const handleEditDataSubmit = async(e) => {
        e.preventDefault();

        try {
            const response = await fetch(`https://yoga-api-five.vercel.app/api/yoga/admin/user/edit/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authorization,
                },
                body: JSON.stringify(user)
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
        <Form.Group className="mb-3" controlId="title">
          <Form.Label className={`${darkMode ? 'text-white' : 'text-black'}`}>Email:</Form.Label>
          <Form.Control
            type="text"
            name="email"
            value={user.email || ""}
            onChange={handleInputChange}
            placeholder="Enter Email"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="description">
          <Form.Label className={`${darkMode ? 'text-white' : 'text-black'}`}>Phone:</Form.Label>
          <Form.Control
            type="number"
            name="phone"
            value={user.phone || ""}
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
