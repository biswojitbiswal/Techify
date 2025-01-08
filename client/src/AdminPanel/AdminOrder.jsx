import React, { useEffect, useRef, useState } from 'react'
import Table from 'react-bootstrap/Table';
import { BASE_URL } from "../../config.js";
import { useAuth } from "../Store/Auth.jsx";
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';
import { toast } from 'react-toastify';


function AdminOrder() {
    const [orders, setOrders] = useState([]);
    const [skip, setSkip] = useState(0);
    const [limit] = useState(5);
    const storedIds = useRef(new Set());

    const { authorization, user } = useAuth();

    const handleAllOrder = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/yoga/admin/orders?skip=${skip}&limit=${limit}`, {
                method: "GET",
                headers: {
                    Authorization: authorization,
                },
            })

            const data = await response.json();
            // console.log(data);

            if (response.ok) {
                const newOrders = data.orders.filter(order => !storedIds.current.has(order._id));
    
                if (newOrders.length > 0) {
                    newOrders.forEach(order => storedIds.current.add(order._id));
    
                    setOrders(prevOrders => [...prevOrders, ...newOrders]);
                }
            } else {
                toast.error("No More Order Found");
            }

        } catch (error) {
            console.log(error);
        }
    }
    

    const handleOrderStatus = async (orderId, newStatus) => {
        if (confirm(`Are You Sure You Want Change Order Status To ${newStatus}`)) {
            try {
                const response = await fetch(`${BASE_URL}/api/yoga/admin/order/status/${orderId}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: authorization
                    },
                    body: JSON.stringify({ newStatus })
                })

                const data = await response.json();
                console.log(data);

                if (response.ok) {
                    toast.success(`Order Status Update To ${newStatus}`)
                    setOrders((prevOrders) =>
                        prevOrders.map((prevOrder) =>
                            prevOrder._id === orderId ? { ...prevOrder, orderStatus: newStatus } : prevOrder
                        )
                    )
                } else {
                    toast.error(data.message || "Failed to update order status");
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    const validAction = {
        Pending: ['Confirmed', 'Canceled'],
        Confirmed: ['Completed', 'Canceled'],
        Completed: [],
        Cancel: [],
    }

    const showDropDownOptions = (currentStatus) => {
        return validAction[currentStatus]?.map((action) => (
            <Dropdown.Item key={action} eventKey={action}>
                {action}
            </Dropdown.Item>
        ));
    };

    const handleOrderDelete = async (orderId) => {
        if (confirm("Are Sure You Want To Delete The Order")) {
            // console.log(orderId);
            try {
                const response = await fetch(`${BASE_URL}/api/yoga/admin/order/${orderId}/delete`, {
                    method: "DELETE",
                    headers: {
                        Authorization: authorization,
                    }
                })

                const data = await response.json();
                // console.log(data);

                if (response.ok) {
                    toast.error("Order Deleted");
                    handleAllOrder();
                }
            } catch (error) {
                console.log(error.message);
            }
        }
    }

    useEffect(() => {
        handleAllOrder();
    }, [skip]);
    return (
        <>
            <div className="order-container text-center">
                <div className="table-caption bg-primary d-flex align-items-center">
                    <h3 className='fs-3 text-white ps-2'>Orders</h3>
                </div>
                <div className="order-table">
                    <Table responsive="sm" bordered striped hover>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Name</th>
                                <th>Contact</th>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Amount</th>
                                {user.role === 'Admin' ? <th>Address</th> : ""}
                                <th>Order Status</th>
                                <th>Payment Status</th>
                                <th>Date</th>
                                {user.role === 'Admin' && <th>Delete</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                orders && orders?.length > 0 ?
                                    orders?.map(order => {
                                        return <tr key={order._id}>
                                            <td>{`${order?._id?.slice(0, 2)}...${order?._id?.slice(-4)}`}</td>
                                            <td>{order.name}</td>
                                            <td>{user.role === 'Admin' ? order.contact : 'xxxxxxxxxx'}</td>
                                            <td style={{ width: "300px" }}>{order?.orderedItem?.map((item, index) => {
                                                return <p key={index}>{item.product.title}</p>
                                            })}</td>
                                            <td>{order?.orderedItem?.reduce((acc, item) => acc + item.quantity, 0)}</td>
                                            <td>{order.totalAmount}</td>
                                            {
                                                user.role === 'Admin' ? <td>
                                                    {
                                                        `${order?.address?.street}, ${order?.address?.city}, ${order?.address?.state}, ${order?.address?.zipcode}`
                                                    }
                                                </td> : ""
                                            }
                                            <td>
                                                {
                                                    user?.role === 'Admin' ? (
                                                        ['Completed', 'Canceled'].includes(order.orderStatus) ? (
                                                            <span className='btn btn-primary' style={{ fontSize: "1rem" }}>
                                                                {order.orderStatus}
                                                            </span>
                                                        ) : (
                                                            <DropdownButton
                                                                id={`dropdown-item-${order._id}`}
                                                                title={order.orderStatus}
                                                                onSelect={(newStatus) => handleOrderStatus(order._id, newStatus)}
                                                                disabled={['Completed', 'Canceled'].includes(order.orderStatus)}
                                                            >
                                                                {showDropDownOptions(order.orderStatus)}
                                                            </DropdownButton>
                                                        )
                                                    ) : (
                                                        <td className={order.orderBy.role === 'Admin' ? 'text-success' :
                                                            order.orderBy.role === 'Moderator' ? 'text-warning' :
                                                                'text-primary'} style={{ fontWeight: "600", fontSize: "1.25rem" }}>{order.orderBy.role}</td>
                                                    )
                                                }
                                            </td>
                                            <td className={order.paymentStatus === 'Paid' ? 'text-success' : 'text-danger'} style={{ fontWeight: "600" }}>
                                                {order.paymentStatus}
                                            </td>
                                            <td style={{ width: "120px" }}>{order?.createdAt?.split('T')[0]}</td>
                                            {
                                                user.role == 'Admin' && (<td style={{ width: "120px" }}><Button variant='danger' onClick={() => handleOrderDelete(order._id)}>Delete<span><i className="fa-solid fa-trash ms-2"></i></span></Button></td>)
                                            }
                                        </tr>

                                    }) : <tr>
                                        <td colSpan={11} className="text-center fs-3">
                                            Orders Not Found
                                        </td>
                                    </tr>
                            }

                        </tbody>
                    </Table>
                </div>
                <Button variant='primary' onClick={() => setSkip((prev) => prev + limit)} className='m-3 fs-5'>More</Button>
            </div>
        </>
    )
}

export default AdminOrder
