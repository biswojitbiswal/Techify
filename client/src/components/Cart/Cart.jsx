import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './Cart.css'
import { useAuth } from '../../Store/Auth';
import { useStore } from '../../Store/ProductStore';
import { toast } from 'react-toastify';

function Cart() {
  const {user, authorization} = useAuth();
  const {products} = useStore();
  const [cartItems, setCartItems] = useState([]);

  
  useEffect(()=> {
    if(Array.isArray(user.cart)){
      const cartProductIds = user.cart;
      const updateCartItems = cartProductIds.map(id => products.find(prduct => prduct._id === id)).filter(item => item !== undefined);

      setCartItems(updateCartItems.reverse());
    }
  }, [user.cart, products])

  const handleRemove = async(itemId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/yoga/products/cart/remove/${itemId}`, {
        method: "PATCH",
        headers: {
          Authorization : authorization
        }
      })

      const data = await response.json();
      // console.log(data);

      if(response.ok){
        toast.success("Item Removed")
        // setUser(data);
        setCartItems(prevItems => prevItems.filter(item => item._id !== itemId));
      } else {
        toast.error(data.extraDetails ? data.extraDetails : data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleBooking = async() => {
    toast.success("This Feature Will Be Available In Future.")
  }

  
  return (
    <>
      <section id="cart-page">
        <h1 className='text-primary'>My Cart</h1>
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item._id} className="cart-card">
              <img src={item.image} alt="Product Image" />
              <Card>
                <Card.Header as="h4">{item.title}</Card.Header>
                <Card.Body>
                  <Card.Title>₹{item.price}</Card.Title>
                  <Card.Text>{item.description}</Card.Text>
                  {/* <div className="cart-btns"> */}
                    <Button variant="secondary" onClick={() => handleRemove(item._id)} className='remove-btn me-4'>
                      <span><i className="fa-solid fa-trash"></i></span>Remove</Button>
                    <Button onClick={handleBooking} variant="warning" className="buy-btn">
                      <span><i className="fa-solid fa-fire-flame-curved"></i></span>Buy Now
                    </Button>
                  {/* </div> */}
                </Card.Body>
              </Card>
            </div>
          ))
        ) : (
          <p>Your cart is empty.</p>
        )}

      </section>
    </>
  )
}

export default Cart
