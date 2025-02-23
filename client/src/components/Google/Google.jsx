import React, { useState } from 'react'
import google from '../../assets/Google.png'
import Button from 'react-bootstrap/Button';
import {GoogleAuthProvider, signInWithPopup, getAuth} from '@firebase/auth'
import {app} from '../../Firebase.js'
import { useAuth } from '../../Store/Auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import { BASE_URL } from '../../../config';
import Form from 'react-bootstrap/Form'
import './Google.css'

function Google() {
    const [showModal, setShowModal] = useState(false);
    const [phone, setPhone] = useState("");
    const [userData, setUserData] = useState({name : "", email: ""})

    const {darkMode, setTokenInCookies, setUser} = useAuth();
    const navigate = useNavigate();

    const handleGoogleClick = async() => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            setUserData({
                name: user.displayName,
                email: user.email
            })

            if(!user.phoneNumber){
                setShowModal(true);
            } else {
                handleUserData(user.displayName, user.email, user.phoneNumber);
            }

            // console.log(result);
        } catch (error) {
            console.log(error);
            toast.error('An error occurred. Please try again later.', error);
        }
    }

    const handleSavedData = () => {
        handleUserData(userData.name, userData.email, phone);
        setShowModal(false);
    }

    const handleUserData = async(name, email, phone) => {
        try {
            const response = await fetch(`${BASE_URL}/api/techify/user/google`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name, email, phone})
            })
    
            const data = await response.json();
            console.log(data);
            if(response.ok){
                toast.success('Sign In Successful')
                setTokenInCookies(data.token);
                setUser(data.user);
                navigate("/")
            }
        } catch (error) {
            console.log(error);
            toast.error('An error occurred. Please try again later.');
        }
    }
  return (
    <>
        <Button onClick={handleGoogleClick} variant="light" className='d-flex align-items-center justify-content-center border-primary google-image' style={{height: "60px", width: "70%"}}>
        <img src={google} className='me-2' alt="google" height="60px" width="60px" />
            <span>CONTINUE WITH GOOGLE</span>
        </Button>
        
            <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Please Enter Your Phone No.:</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form.Group className="mb-3" controlId="phone">
            <Form.Label className={`${darkMode ? 'text-white' : 'text-black'}`}>Phone No.:</Form.Label>
            <Form.Control type="number" name='phone' value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter Phone No." required />
          </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSavedData}>
                Save
              </Button>
            </Modal.Footer>
          </Modal>
        
    </>
  )
}

export default Google
