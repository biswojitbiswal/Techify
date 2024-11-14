import React,{ useState, useEffect } from 'react';
import './ProShow.css'
import { useStore } from '../../Store/ProductStore';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../Store/Auth';
import { toast } from 'react-toastify';

function ProShow() {
  const {productId} = useParams()
  const {products} = useStore();
  const {authorization} = useAuth();

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
      } else {
        toast.error(data.extradetails ? data.extradetails : data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  return (
    <>
      <section id="prod-details">
        <div className="prod-look">
            <div className="prod-img">
                <img src={product.image} alt="Main Image"  id="mainimg" />
            </div>
            <div className="order">
                <button onClick={handleAddToCart} className="btn btn-primary"><span><i className="fa-solid fa-cart-shopping"></i></span>ADD TO CART</button>
                <button className="btn btn-warning"><span><i className="fa-solid fa-fire-flame-curved"></i></span>BUY NOW</button>
            </div>
        </div>

        <div className="details">
            <p className="fs-4 text-primary">Smart Yoga</p>
            <h4 className="fs-3">{product.title}</h4>
            <h2 className="fs-2">₹{product.price}</h2>
            <p className="ratings text-primary">3.8<span><i className="fa-solid fa-star"></i></span></p>
            <div>
              <p className='fs-4'>Product Details:</p> 
              <p className='fs-5'>{product.description}</p>
            </div>
        </div>
    </section>
    </>
  )
}

export default ProShow
