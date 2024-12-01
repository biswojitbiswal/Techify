import React from 'react'
import { useAuth } from '../../Store/Auth';
import Badge from 'react-bootstrap/Badge';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/esm/Button';

function ShowAddress() {
    const {user} = useAuth();

    const handleDelete = async(addressId) => {
        try {
            
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <>
      <div className="address-container">
                    {
                        user?.addresses && user.addresses.length > 0 ? (
                            user.addresses.map((address) => {
                                return (
                                    <div className="address-card d-flex justify-content-between border-bottom border-1 gap-2 my-2" key={address._id}>
                                        <div className="address-info">
                                            <Badge bg="primary">{address.type}</Badge>
                                            <h5>{address.orderByName} <span className='ms-3'>{address.contact}</span></h5>
                                            <p className='p-0 my-1 mx-0'>{address.street}</p>
                                            <p className='p-0 my-1 mx-0'>{address.city + ", " + address.state + ", " + address.zipcode}</p>
                                        </div>
                                        <div className="address btns d-flex flex-column justify-content-evenly">
                                        <Link className="btn btn-primary">Edit</Link>
                                        <Button onClick={() => {handleDelete(address._id)}} variant="danger">Delete</Button>
                                        </div>
                                        
                                    </div>
                                    
                                    
                                );
                            })
                        ) : (
                            <p>No addresses available.</p>
                        )
                    }
                </div>
    </>
  )
}

export default ShowAddress
