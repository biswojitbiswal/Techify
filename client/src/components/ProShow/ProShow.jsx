import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import './ProShow.css'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../Store/Auth';
import { toast } from 'react-toastify';
import Spinner from 'react-bootstrap/Spinner';
import Review from '../Review/Review';
import { BASE_URL } from '../../../config.js';

function ProShow() {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);
  const [imageClick, setImageClick] = useState(0);


  const { productId } = useParams()
  const { authorization, refreshUser, isLoggedInuser, darkMode } = useAuth();
  const navigate = useNavigate();


  const getProductById = async () => {
    setLoading(true)
    try {
      // console.log(productId);
      const response = await fetch(`${BASE_URL}/api/techify/products/product/${productId}`, {
        method: "GET",
        headers: {
          Authorization: authorization
        }
      })

      const data = await response.json();
      // console.log(data);

      if (response.ok) {
        setProduct(data.item);
        // console.log("successful");
        setLoading(false)
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (!product) {
    return <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  }

  const handleAddToCart = async () => {
    if (!isLoggedInuser) {
      navigate("/signin");
      return;
    } else {
      try {
        const response = await fetch(`${BASE_URL}/api/techify/products/cart/add/${productId}`, {
          method: "POST",
          headers: {
            Authorization: authorization,
          }
        });

        const data = await response.json();
        // console.log(data);

        if (response.ok) {
          toast.success("Item Added To Your Cart");
          // setUser(data)
          refreshUser();

        } else {
          toast.error(data.extradetails ? data.extradetails : data.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }


  const handleHoverImage = (id) => {
    setImageClick(id);
  }

  useEffect(() => {
    getProductById()
    // console.log("hello");
  }, [])



  return (
    <>
      <section id="prod-details">
        <div className="prod-card" style={{ backgroundColor: darkMode ? '#343434' : '#e3edf7' }}>
            <div className="prod-look">

              {product.images && product.images.length > 0 && (
                <div className="prod-img">
                  <img src={product.images[imageClick]} alt="Main Image" id="mainimg" loading='lazy' />
                </div>
              )}

              <div className="product-images">
                {
                  product?.images?.map((image, index) => {
                    return <div className={`small-img-box ${imageClick === index ? 'imageSelected' : ''}`} key={index}>
                      <img
                        src={image}
                        alt={`Product Image ${index + 1}`}
                        className={`small-img`}
                        onClick={() => handleHoverImage(index)}
                      />
                    </div>
                  })
                }
              </div>

            </div>

            <div className="details">
              <p className={`fs-4 ${darkMode ? 'text-white' : 'text-black'}`}>Smart Yoga</p>
              <h4 className="fs-3 text-primary">{product.title}</h4>
              <h2 className={`fs-2 ${darkMode ? 'text-white' : 'text-black'}`}>₹{product.price}</h2>
              <p className="ratings text-primary">{product?.averageRating?.toFixed(1)}<span><i className="fa-solid fa-star"></i></span></p>
              <div>
                <p className={`fs-4 ${darkMode ? 'text-white' : 'text-black'}`}>Product Details:</p>
                <p className={`fs-5 ${darkMode ? 'text-white' : 'text-black'}`}>{product.description}</p>
              </div>

              <div className="order">
                <Button variant="primary" onClick={handleAddToCart} className="fs-4 add-cart-btn"><span className='me-2'><i className="fa-solid fa-cart-shopping"></i></span>Add To Cart</Button>
                <Link to="/order/buy-now" state={{ productIds: [product._id] }} className='btn btn-warning fs-4'><span className='me-2'><i className="fa-solid fa-fire-flame-curved"></i></span>Buy Now</Link>
              </div>
            </div>
          </div>
      </section>

      <Review product={product} />


    </>
  )
}

export default ProShow
