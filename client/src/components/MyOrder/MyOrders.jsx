import React, { useEffect, useState } from 'react'
import './MyOrders.css'
import { useAuth } from '../../Store/Auth'
import Badge from 'react-bootstrap/esm/Badge';
import { BASE_URL } from '../../../config.js';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

function MyOrder() {
    const [myOrders, setMyOrders] = useState([]);

    const { authorization } = useAuth();

    const getMyOrders = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/yoga/order/get`, {
                method: "GET",
                headers: {
                    Authorization: authorization
                }
            })
            const data = await response.json();
            // console.log(response);
            console.log(data);

            if (response.ok) {
                setMyOrders(data.orders)
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getMyOrders();
    }, [])

    const orders = myOrders?.filter((order) => order.orderStatus !== 'Pending')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    return (
        <>
            <section id="myorder-page" className='p-2'>
                <h3>My Orders</h3>
                <hr />
                <div className="text-black">
                    {orders && orders.length > 0 ?
                        orders.flatMap(order =>
                            order.orderedItem.map((item) => {
                                const address = order.userDetails.addresses.find(
                                    (addr) => addr._id === order.address
                                );
                                return <Card key={`${order.orderId}-${item.productId}`} className="mb-3">
                                    <Card.Body>
                                        <div className='d-flex justify-content-between'>
                                            <p className='mb-0'>{order.orderId}</p>
                                            <p className={`${order.orderStatus === 'Completed' ? 'bg-success' : order.orderStatus === 'Confirmed' ? 'bg-primary' : 'bg-danger'} text-white px-2 py-1 mb-0`} style={{ borderRadius: '.5rem', fontWeight: '500' }}>{order.orderStatus}</p>

                                        </div>
                                        <hr className='m-1' />
                                        <div className="order-item gap-2">
                                            <div className="item-details d-flex justify-content-between gap-2">
                                                <img src={item.image} alt={item.title} className="p-2 bg-body-secondary ordered-img" />
                                                <div className="item-details">
                                                    <h6>{item.title}</h6>
                                                    <p className='mb-2 fs-5'>₹{item.price * item.quantity} <Badge className='bg-success'>{order.paymentStatus}</Badge></p>
                                                    <p className='mb-2 fs-5'>{item.quantity}</p>

                                                </div>
                                            </div>
                                            <hr className='m-1'/>
                                            <div className="delivery-details">
                                                {/* <h4>Delivery Here</h4> */}
                                                <p className='mb-2'>{order.userDetails.name} <span><Badge>{address.type}</Badge></span></p>
                                                <p className='mb-2'>{address.street}</p>
                                                <p className='mb-2'>{`${address.city}, ${address.state}, ${address.zipcode}`}</p>
                                                <p className='mb-2'>{address.contact}</p>

                                            </div>
                                        </div>
                                        <hr className='m-2' />
                                        <div className="ordered-btn d-flex justify-content-between">
                                            {
                                                order.orderStatus !== 'Completed' ?
                                                    <div className='d-flex w-100 gap-2'>
                                                        <Button className='fs-5' style={{width: "50%"}} variant="outline-secondary">Cancel</Button>

                                                        <Button className='fs-5' style={{width: "50%"}} variant="outline-secondary"><i class="fa-regular fa-comment"></i> Chat With Us</Button>
                                                    </div> : <Button className='w-100 fs-5' variant="outline-secondary"><i class="fa-regular fa-comment"></i> Chat With Us</Button>
                                            }

                                        </div>
                                    </Card.Body>
                                </Card>
                            })
                        ) :
                        <p>No orders found.</p>
                    }
                </div>
                <p>For Now You can only see a limited information in future i will improve it like cancel order and contact us option</p>
            </section>
        </>
    )
}

export default MyOrder
