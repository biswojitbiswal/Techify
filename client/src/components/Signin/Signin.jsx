import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './Signin.css'
import { toast } from 'react-toastify';
import { useAuth } from '../../Store/Auth';

function Signin() {
  const [signinData, setSignInData] = useState({
    email: "",
    password: "",
  })

  const {setTokenInCookies} = useAuth()
  const navigate = useNavigate();

  const handleInput = (e) => {
    setSignInData({
      ...signinData,
      [e.target.name]: e.target.value
    })
  }

  const handleSifninForm = async(e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/yoga/user/signin`, {
        method: "POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify(signinData)
      })
  
      const data = await response.json();
      // console.log(data);
  
      if(response.ok){
        toast.success("Signin Successful");
        setTokenInCookies(data.token);
        setSignInData({email: "", password: ""});
        navigate("/");
      } else {
        toast.error(data.extraDetails ? data.extraDetails : data.message)
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="signin-page">
        <h1 className='text-primary mb-4'>Sign-In Form</h1>
        <Form onSubmit={handleSifninForm}>
          <Form.Group className="mb-3" id="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" name='email' placeholder="Enter email" value={signinData.email} onChange={handleInput} required />
          </Form.Group>

          <Form.Group className="mb-3" id="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name='password' placeholder="Password" value={signinData.password} onChange={handleInput} required />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    </>
  )
}

export default Signin
