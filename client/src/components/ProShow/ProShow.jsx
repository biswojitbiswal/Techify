import React from 'react';
import Button from 'react-bootstrap/Button';
import './ProShow.css'
import { useStore } from '../../Store/ProductStore';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../Store/Auth';
import { toast } from 'react-toastify';

function ProShow() {
  const {productId} = useParams()
  const {products} = useStore();
  const {authorization, setUser} = useAuth();

  const product = products.find((prod) => prod._id === productId)

  const handleAddToCart = async() => {
    try {
      const response = await fetch(`http://localhost:5000/api/yoga/products/cart/add/${productId}`, {
        method: "POST",
        headers: {
          Authorization: authorization,
        }
      });

      const data = await response.json();
      // console.log(data);

      if(response.ok){
        toast.success("Item Added To Your Cart");
        setUser(data)
      } else {
        toast.error(data.extradetails ? data.extradetails : data.message);
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
      <section id="prod-details">
        <div className="prod-look">
            <div className="prod-img">
                <img src={product.image} alt="Main Image"  id="mainimg" />
            </div>
            
        </div>

        <div className="details">
            <p className="fs-4">Smart Yoga</p>
            <h4 className="fs-3 text-primary">{product.title}</h4>
            <h2 className="fs-2">₹{product.price}</h2>
            <p className="ratings text-primary">4.5<span><i className="fa-solid fa-star"></i></span></p>
            <div>
              <p className='fs-4'>Product Details:</p> 
              <p className='fs-5'>{product.description}</p>
            </div>
            <div className="order">
                <Button variant="primary" onClick={handleAddToCart} className="fs-3 me-2 px-4"><span className='me-2'><i className="fa-solid fa-cart-shopping"></i></span>Add To Cart</Button>
                <Button variant="warning" onClick={handleBooking} className="fs-3 me-4 px-5"><span className='me-2'><i className="fa-solid fa-fire-flame-curved"></i></span>Buy Now</Button>
            </div>
        </div>
    </section>
    </>
  )
}

export default ProShow
