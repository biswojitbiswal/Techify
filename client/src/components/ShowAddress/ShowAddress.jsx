import React, { useState } from 'react';
import { useAuth } from '../../Store/Auth';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Badge from 'react-bootstrap/Badge';
import Form from 'react-bootstrap/Form';
import { toast } from 'react-toastify';

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

function ShowAddress() {
    const { user, authorization, refreshUser } = useAuth();
    const [show, setShow] = useState(false);
    const [editData, setEditData] = useState(null);

    const handleClose = () => {
        setShow(false);
        setEditData(null);
    };
    const handleShow = (address) => {
        setEditData(address);
        setShow(true);
    };

    const handleDelete = async (addressId) => {
        try {
            const response = await fetch(`https://yoga-api-five.vercel.app/api/yoga/user/delete/address/${addressId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: authorization,
                },
            });

            const data = await response.json();
            if (response.ok) {
                toast.success('Address Deleted Successfully');
                refreshUser();
            } else {
                toast.error(data.message || 'Failed to delete address');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while deleting the address');
        }
    };

    const handleChange = (e) => {
        setEditData({
            ...editData,
            [e.target.name]: e.target.value,
        });
    };

    // console.log(editData)

    const handleSaveChanges = async () => {
        
        try {
            const response = await fetch(`https://yoga-api-five.vercel.app/api/yoga/user/update/address/${editData._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: authorization,
                },
                body: JSON.stringify(editData),
            });

            const data = await response.json();
            // console.log(data);
            
            if (response.ok) {
                toast.success('Address Updated Successfully');
                refreshUser();
                handleClose();
            } else {
                toast.error(data.message || 'Failed to update address');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while updating the address');
        }
    };

    const handleSetPrimary = async (addressId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/yoga/user/address/${addressId}/primary`, {
                method: 'PATCH',
                headers: {
                    Authorization: authorization,
                },
            });

            const data = await response.json();
            if (response.ok) {
                toast.success('Primary Address Updated Successfully');
                refreshUser(); 
            } else {
                toast.error(data.message || 'Failed to update primary address');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while updating the primary address');
        }
    };


    return (
        <div className="address-container">
            {user?.addresses && user.addresses.length > 0 ? (
                user.addresses.map((address) => (
                    <div
                        className={`address-card d-flex justify-content-between border-bottom border-1 gap-2 my-2 ${address.primary ? 'border-success' : ''
                            }`}
                        key={address._id}
                    >
                        <div className="address-info">
                            <div className="d-flex align-items-center">
                                <Form.Check
                                    type="checkbox"
                                    checked={address.isPrimary}
                                    onChange={() => handleSetPrimary(address._id)}
                                    className="me-2 fs-5"
                                />
                                <Badge bg={address.primary ? 'success' : 'primary'}>
                                    {address.primary ? 'Primary' : address.type}
                                </Badge>
                            </div>
                            <h5>
                                {address.orderByName} <span className="ms-3">{address.contact}</span>
                            </h5>
                            <p className="p-0 my-1 mx-0">{address.street}</p>
                            <p className="p-0 my-1 mx-0">{`${address.city}, ${address.state}, ${address.zipcode}`}</p>
                        </div>
                        <div className="address-btns d-flex flex-column justify-content-evenly">
                            <Button variant="primary" onClick={() => handleShow(address)}>
                                Edit
                            </Button>
                            <Button onClick={() => handleDelete(address._id)} variant="danger">
                                Delete
                            </Button>
                        </div>
                    </div>
                ))
            ) : (
                <p>No addresses available.</p>
            )}
            
            {editData && (
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Address</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="editName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="orderByName"
                                    value={editData.orderByName || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="editContact">
                                <Form.Label>Contact</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="contact"
                                    value={editData.contact || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="editStreet">
                                <Form.Label>Street</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="street"
                                    value={editData.street || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="editCity">
                                <Form.Label>City</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="city"
                                    value={editData.city || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="editState">
                                <Form.Label>State</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="state"
                                    value={editData.state || ''}
                                    onChange={handleChange}
                                >
                                    {states.map((state) => (
                                        <option key={state} value={state}>
                                            {state}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="editZipcode">
                                <Form.Label>Zip Code</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="zipcode"
                                    value={editData.zipcode || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSaveChanges}>
                            Save
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
}

export default ShowAddress;
