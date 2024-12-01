import React from 'react'
import './Address.css'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useAuth } from '../../Store/Auth';
import { toast } from 'react-toastify';
import ShowAddress from '../ShowAddress/ShowAddress';

const states = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Andaman and Nicobar Islands',
    'Chandigarh',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi',
    'Lakshadweep',
    'Puducherry',
];

function Address() {
    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({
        orderByName: "",
        contact: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        type: ""
    })

    const {authorization, user} = useAuth();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async() => {
        try {
            const response = await fetch(`https://yoga-api-five.vercel.app/api/yoga/user/address`, {
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                    Authorization: authorization,
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json();
            console.log(data);

            if(response.ok){
                toast.success("New Address Added Successfully");
                setFormData({
                    orderByName: "",
                    contact: "",
                    street: "",
                    city: "",
                    state: "",
                    zipcode: "",
                    type: ""
                })
                handleClose();

            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            <section id="address-page">
                <div className="address-heading d-flex justify-content-between align-items-center">
                    <h3>Manage Address</h3>
                    <div className="address-form">
                        <Button variant="primary" className='fs-5' onClick={handleShow}>
                            <span><i className="fa-solid fa-plus me-2"></i></span>
                            Address
                        </Button>

                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Address Form</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group className="mb-3" controlId="orderByName">
                                        <Form.Label>Name:</Form.Label>
                                        <Form.Control type="text" name='orderByName' placeholder="Name" value={formData.orderByName} onChange={handleChange} />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="contact">
                                        <Form.Label>Phone:</Form.Label>
                                        <Form.Control type="number" name='contact' placeholder="Phone No." value={formData.contact} onChange={handleChange} />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="street">
                                        <Form.Label>Street: </Form.Label>
                                        <Form.Control as="textarea" name='street' rows={3} placeholder="Area & Street" value={formData.street} onChange={handleChange} />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="city">
                                        <Form.Label>City:</Form.Label>
                                        <Form.Control type="text" name='city' placeholder="City" value={formData.city} onChange={handleChange} />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formState">
                                        <Form.Label>State:</Form.Label>
                                        <Form.Select
                                            aria-label="Select your state"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select your state</option>
                                            {states.map((state, index) => (
                                                <option key={index} value={state}>
                                                    {state}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="zipcode">
                                        <Form.Label>Zip Code:</Form.Label>
                                        <Form.Control type="text" name='zipcode' placeholder="Zip Code" value={formData.zipcode} onChange={handleChange} />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formAddressType">
                                        <Form.Label>Address Type:</Form.Label>
                                        <div>
                                            <Form.Check
                                                inline
                                                label="Home"
                                                name="type"
                                                type="radio"
                                                value="Home"
                                                checked={formData.type === 'Home'}
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                label="Work"
                                                name="type"
                                                type="radio"
                                                value="Work"
                                                checked={formData.type === 'Work'}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>
                                <Button variant="primary" onClick={handleSubmit}>
                                    Save
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>

                </div>
                <hr />
                <ShowAddress />
                
            </section>
        </>
    )
}

export default Address
