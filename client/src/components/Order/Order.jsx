import React, { useState, useEffect } from 'react';
import './Order.css';
import Badge from 'react-bootstrap/esm/Badge';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../../Store/Auth';
import { useStore } from '../../Store/ProductStore';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../config.js';

function Order() {
  const { productId } = useParams();
  const [quantity, setQuantity] = useState(1);

  const { user, authorization } = useAuth();
  const { products } = useStore();
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState({
    user: user,
    products: products,
  });

  const product = userDetails.products.find((prod) => prod._id === productId);
  const address = userDetails.user?.addresses?.find((address) => address.isPrimary);

  const handleQuantityChange = (action) => {
    if (action === 'increment') {
      setQuantity(quantity + 1);
    } else {
      if (quantity === 1) {
        setQuantity(1);
      } else {
        setQuantity(quantity - 1);
      }
    }
  };

  const handlePayment = async () => {
    try {
      const paymentData = {
        name: address.orderByName,
        contact: address.contact, // Assuming user contact is available
        quantity: quantity,
        addressId: address._id, // Address ID of the primary address
        totalAmount: totalAmount, // Total amount to be paid
        productId: product._id, // Product ID
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
      name: "Drivo",
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


useEffect(() => {
  setUserDetails({
    user: user,
    products: products
  });
}, [user, products]);

const totalAmount = product?.price * quantity;

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
          <p>No primary address found. Please set a primary address.</p>
        )}
      </div>
    </div>

    <div className="mb-4">
      <h3>Product</h3>
      <hr />
      <div className="product-details">
        {product ? (
          <div className="d-flex align-items-center gap-4">
            <div className="product-img-quantity">
              <img
                src={product.images[0]}
                alt={product.title}
                className="product-image"
                style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: ".5rem" }}
              />
              <div className="quantity-selector d-flex align-items-center gap-3 mt-3">
                <Button variant="outline-primary" onClick={() => handleQuantityChange('decrement')}>
                  -
                </Button>
                <span>{quantity}</span>
                <Button variant="outline-primary" onClick={() => handleQuantityChange('increment')}>
                  +
                </Button>
              </div>
            </div>
            <div className="product-info text-start">
              <h4>{product.title}</h4>
              <p className="text-muted">{product.description}</p>
              <h3 className="text-primary">Price: ₹{product.price}</h3>
            </div>
          </div>
        ) : (
          <p>No product found. Please check the product ID.</p>
        )}
      </div>
    </div>

    <div className="text-center">
      <Button variant="warning" onClick={handlePayment} className="fs-4">
        Pay Now ₹{totalAmount}
      </Button>
    </div>
  </section>
);
}

export default Order;
