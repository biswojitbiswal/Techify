import React, { useState, useEffect } from 'react';
import './Order.css';
import Badge from 'react-bootstrap/esm/Badge';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../../Store/Auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../config.js';
import { useLocation } from 'react-router-dom';

function Order() {
  const [orderState, setOrderState] = useState({
    products: [],
    quantity: {},
    totalAmount: 0,
    orderDetails: {},
  });

  const location = useLocation();
  const {productIds} = location.state;
  const { user, authorization } = useAuth();
  const navigate = useNavigate();

  const address = orderState.orderDetails.user?.addresses?.find((address) => address.isPrimary);


  const getOrderProducts = async() => {
    try {
      const response = await fetch(`${BASE_URL}/api/yoga/products/order/buy-now`, {
        method: "POST",
        headers:{
          'Content-Type': 'application/json',
          Authorization: authorization,
        },
        body: JSON.stringify({productIds}),
      })

      const data = await response.json();
      // console.log(data);

      if(response.ok){
        setOrderState(prev => ({...prev, products: data.orders}))
      }
    } catch (error) {
      console.log(error);
    }
  }


  const handleQuantityChange = (action, productId) => {
    // console.log(action);
    setOrderState((prev) => {
      const updatedQuantity = {...prev.quantity};
      const currectQuantity = updatedQuantity[productId] || 1;

      if(action === 'increment'){
        updatedQuantity[productId] = currectQuantity + 1;
      } else if(action === "decrement") {
        if(updatedQuantity[productId] > 1){
          updatedQuantity[productId] = currectQuantity - 1;
        }
      }
      return {...prev, quantity: updatedQuantity};
    })
  };


  useEffect(() => {
    getOrderProducts();
  }, [])


  useEffect(() => {
    let total = 0;
    orderState.products.forEach(product => {
      const productQuantity = orderState.quantity[product._id] || 1;
      total += productQuantity * product.price;
    })
    setOrderState(prev => ({...prev, totalAmount: total}))
  }, [orderState.products, orderState.quantity]);


  useEffect(() => {
    setOrderState(prev => ({
      ...prev, orderDetails: {
        ...prev.orderDetails, user: user
      }
    }));
  }, [user]);


  const handlePayment = async () => {
    
    try {
      const orderedItems = orderState.products.map((product) => ({
        product: product._id,
        quantity: orderState.quantity[product._id] || 1,
      }));
      
      const paymentData = {
        name: address.orderByName,
        contact: address.contact,
        orderedItem: orderedItems,
        addressId: address._id,
        totalAmount: orderState.totalAmount,
      };
      // console.log(paymentData)

      const response = await fetch(`${BASE_URL}/api/yoga/order/create`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: authorization,
        },
        body: JSON.stringify(paymentData)
      })

      const data = await response.json();
      // console.log(data);

      handlePaymentVerify(data)

    } catch (error) {
      console.log(error);
    }
  }

  const handlePaymentVerify = async (data) => {
    console.log(data);
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: data.order.totalAmount * 100,
      currency: "INR",
      name: "Smart Yoga",
      description: "Test Mode",
      order_id: data.order.orderId,
      handler: async (response) => {
        console.log("response", response)
        try {
          const res = await fetch(`${BASE_URL}/api/yoga/order/verify`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              Authorization: authorization,
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
          })

          const verifyData = await res.json();

          if (verifyData.message) {
            toast.success(verifyData.message);
            navigate("/account/myorders");
          }
        } catch (error) {
          console.log(error)
        }
      },
      theme: {
        color: "#5f63b8"
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();

  }


  return (
    <section id="order-buy-page">
      <div className="deliver-details mb-4">
        <h3>Delivery Here</h3>
        <hr />
        <div>
          {address ? (
            <div className="address-details d-flex justify-content-between align-items-start">
              <div className="address-info">
                <Badge bg="primary">{address.type}</Badge>
                <h5>
                  {address.orderByName} <span className="ms-3">{address.contact}</span>
                </h5>
                <p>{address.street}</p>
                <p>{`${address.city}, ${address.state}, ${address.zipcode}`}</p>
              </div>
              <Link to="/account/address" className="btn btn-outline-primary">
                Change
              </Link>
            </div>
          ) : (
            <div>
              <p>No primary address found. Please set a primary address.</p>
              <Link to="/account/address" className="btn btn-outline-primary">
                {address ? 'Change' : 'Add'}
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <h3>Product</h3>
        <hr />
        <div className="product-details">
          {orderState.products.length ? orderState.products.map((product) => {
            return <div key={product._id} className="d-flex align-items-center bg-body-tertiary rounded-1 p-2 mb-2 gap-4">
              <div className="product-img-quantity">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="product-image"
                  style={{ width: '170px', height: '170px', objectFit: 'cover', borderRadius: ".5rem" }}
                />
                
              </div>
              <div className="product-info text-start">
                <h4>{product.title}</h4>
                <p className="text-muted">{product.description}</p>
                <div className="prod-qntity-price d-flex align-items-center">
                  <div className="quantity-selector d-flex align-items-center gap-3">
                    <Button variant="outline-primary" onClick={() => handleQuantityChange('decrement', product._id)}>
                      -
                    </Button>
                    <span>{orderState.quantity[product._id] || 1}</span>
                    <Button variant="outline-primary" onClick={() => handleQuantityChange('increment', product._id)}>
                      +
                    </Button>
                  </div>
                  <p className="text-primary ms-4 mb-0 fs-3">Price: ₹{product.price * (orderState.quantity[product._id] || 1)}</p>
                </div>
              </div>
            </div>
          }
        ) : (
            <p>No product found. Please check the product ID.</p>
          )}
        </div>
      </div>

      <div className="text-center">
        <Button variant="warning" onClick={handlePayment} className="fs-4">
          Pay Now ₹{orderState.totalAmount}
        </Button>
      </div>
    </section>
  );
}

export default Order;
