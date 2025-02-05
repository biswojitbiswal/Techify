import React from 'react'
import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './Signin.css'
import { toast } from 'react-toastify';
import { useAuth } from '../../Store/Auth';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../../config.js';
import Google from '../Google/Google.jsx';

function Signin() {
  const [signinData, setSignInData] = useState({
    email: "",
    password: "",
  })

  const { setTokenInCookies, isLoggedInuser, refreshUser, darkMode } = useAuth()
  const navigate = useNavigate();

  if (isLoggedInuser) {
    return <Navigate to="/" />
  }

  const handleInput = (e) => {
    setSignInData({
      ...signinData,
      [e.target.name]: e.target.value
    })
  }

  const handleSigninForm = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/api/techify/user/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(signinData)
      })

      const data = await response.json();
      // console.log(data);

      if (response.ok) {
        toast.success("Signin Successful");
        setTokenInCookies(data.token);
        refreshUser();
        setSignInData({ email: "", password: "" });
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
      <section id="signin-page">
        <div className="signin-page" style={{ backgroundColor: darkMode ? '#343434' : '' }}>
          <h1 className='text-primary mb-4'>Sign-In Form</h1>
          <Form onSubmit={handleSigninForm}>
            <Form.Group className="mb-3" id="email">
              <Form.Label className={`${darkMode ? 'text-white' : 'text-black'}`}>Email</Form.Label>
              <Form.Control type="email" name='email' placeholder="Enter email" value={signinData.email} onChange={handleInput} required />
            </Form.Group>

            <Form.Group className="mb-3" id="password">
              <Form.Label className={`${darkMode ? 'text-white' : 'text-black'}`}>Password</Form.Label>
              <Form.Control type="password" name='password' placeholder="Password" value={signinData.password} onChange={handleInput} required />
            </Form.Group>
            <Button variant="primary" type="submit">
              Sign In
            </Button>
          </Form>
          <hr className={`${darkMode ? 'text-white' : 'text-black'}`} />
          <div className="d-flex flex-column justify-content-center align-items-center">
          <Google />
          <Link style={{textDecoration: "none", margin: "1rem" }} className='fs-5' to="/signup">Don't have an Account! Create An Account</Link>

          </div>
        </div>
      </section>
    </>
  )
}

export default Signin
