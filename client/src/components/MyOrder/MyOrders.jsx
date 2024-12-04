import React, { useEffect, useState } from 'react'
import './MyOrders.css'
import { useAuth } from '../../Store/Auth'
import Badge from 'react-bootstrap/esm/Badge';

function MyOrder() {
    const [myOrders, setMyOrders] = useState([]);

    const {authorization} = useAuth();

    const getMyOrders = async() => {
        try {
            const response = await fetch(`https://yoga-api-five.vercel.app/api/yoga/order/get`, {
                method: "GET",
                headers: {
                    Authorization: authorization
                }
            })
            const data = await response.json();
            // console.log(response);
            // console.log(data);

            if(response.ok){
                setMyOrders(data.orders)
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getMyOrders();
    }, [myOrders])

    const orders = myOrders?.filter((order) => order.orderStatus !== 'Pending')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return (
    <>
      <section id="myorder-page" className='p-2'>
        <h3>My Orders</h3>
        <hr />
        <div className="order-container">
            {
                orders && orders.length > 0 ? 
                orders.map(order => {
                    return <div key={order._id} className='d-flex p-2 border-bottom border-secondary my-2 gap-4'>
                        <img width="150px" height="150px" src={order.orderedItem.images[0]} alt="" />
                        <div className="order-info">
                            <Badge bg={order.orderStatus === 'Completed' ? "success" : "primary"}>{order.orderStatus}</Badge>
                            <p>{order.orderedItem.title}</p>
                            <p>{order.orderedItem.description}</p>
                            
                        </div>
                    </div>
                }) : <p>Orders Not Found</p>
            }
        </div>
        <p>For Now You can only see a limited information in future i will improve it like cancel order and contact us option</p>
      </section>
    </>
  )
}

export default MyOrder
