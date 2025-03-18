import React, { useEffect, useState } from 'react'
import './MyOrders.css'
import { useAuth } from '../../Store/Auth'
import Badge from 'react-bootstrap/esm/Badge';
import { BASE_URL } from '../../../config.js';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import OrderCancel from './OrderCancel.jsx'
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from 'react-bootstrap';

function MyOrder() {
    // const [myOrders, setMyOrders] = useState([]);

    const { authorization } = useAuth();

    const navigate = useNavigate();

    const getMyOrders = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/techify/order/get`, {
                method: "GET",
                headers: {
                    Authorization: authorization
                }
            })
            const data = await response.json();

            return data.orders.reverse();
        } catch (error) {
            console.log(error);
        }
    }

    const { data: myOrders = [], isLoading, error } = useQuery({
        queryKey: ['myOrders'],
        queryFn: getMyOrders,
        staleTime: 30 * 60 * 1000,
    })

    if (isLoading) return <Spinner variant='primary' size='lg' />
    if (error) return <p>Error Loading In Your Orders...</p>


    return (
        <>
            <section id="myorder-page" className='p-2'>
                <h3>My Orders</h3>
                <hr />
                <div className="text-black">
                    {myOrders && myOrders.length > 0 ?
                        myOrders.flatMap(order =>
                            order.orderedItem.map((item) => {
                                const address = order.userDetails.addresses.find(
                                    (addr) => addr._id === order.address
                                );
                                return <Card key={`${order.orderId}-${item.productId}`} className="mb-3">
                                    <Card.Body>
                                        <div className='d-flex justify-content-between'>
                                            <p className='mb-0'>{order.orderId}</p>
                                            <p className={`${item.status === 'Completed' ? 'bg-success' : item.status === 'Confirmed' ? 'bg-primary' : 'bg-danger'} text-white px-2 py-1 mb-0`} style={{ borderRadius: '.5rem', fontWeight: '500' }}>{item.status}</p>

                                        </div>
                                        <hr className='m-1' />
                                        <div className="order-item gap-2">
                                            <div className="item-details d-flex justify-content-between gap-2">
                                                <img src={item.image} alt={item.title} className="p-2 bg-body-secondary ordered-img" />
                                                <div className="item-details">
                                                    <h6>{item.title}</h6>
                                                    <p className='mb-2 fs-5'>₹{item.price * item.quantity} <Badge className={item.payStatus === "Paid" ? "bg-success" : "bg-danger"}>{item.payStatus}</Badge></p>
                                                    <p className='mb-2 fs-5'>{item.quantity}</p>

                                                </div>
                                            </div>
                                            <hr className='m-1' />
                                            <div className="delivery-details">
                                                {/* <h4>Delivery Here</h4> */}
                                                <p className='mb-2'>{order.userDetails.name} <span><Badge>{address.type}</Badge></span></p>
                                                <p className='mb-2'>{address.street}</p>
                                                <p className='mb-2'>{`${address.city}, ${address.state}, ${address.zipcode}`}</p>
                                                <p className='mb-2'>{address.contact}</p>
                                            </div>
                                        </div>

                                        {item?.status === 'Canceled' ? <p className='text-danger'>Cancellation Reason: {item.cancellationReason}</p> : ""}


                                        <hr className='m-2' />
                                        <div className="ordered-btn d-flex justify-content-between">
                                            {
                                                item.status !== 'Completed' && item.status !== 'Canceled' ?
                                                    <div className='d-flex w-100 gap-2'>
                                                        <OrderCancel orderId={order._id} productId={item.productId} />

                                                        <Button className='fs-5' style={{ width: "50%" }} variant="outline-secondary" onClick={() => navigate("/contact")}><i className="fa-regular fa-comment"></i> Chat</Button>
                                                    </div> : <Button className='w-100 fs-5' variant="outline-secondary" onClick={() => navigate("/contact")}><i className="fa-regular fa-comment"></i> Chat</Button>
                                            }

                                        </div>
                                    </Card.Body>
                                </Card>
                            })
                        ) :
                        <p>No orders found.</p>
                    }
                </div>
            </section>
        </>
    )
}

export default MyOrder
