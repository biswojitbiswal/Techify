import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import './ProShow.css'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../Store/Auth';
import { toast } from 'react-toastify';
import Spinner from 'react-bootstrap/Spinner';
import Review from '../Review/Review';
import { BASE_URL } from '../../../config.js';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

function ProShow() {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
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

      if (response.ok) {
        setProduct(data.item);
        setLoading(false)
      }
    } catch (error) {
      console.log(error);
    }
    finally{
      setLoading(false)
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

        if (response.ok) {
          toast.success("Item Added To Your Cart");
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
  }, [])



  return (
    <>
      <section id="prod-details">
        <div className="prod-card" style={{ backgroundColor: '#f1f1f1' }}>
          <div className="prod-look mb-2">

            {product.images && product.images.length > 0 && (
              <div className="prod-img">
                <img src={product.images[imageClick] || <Skeleton />} alt="Main Image" id="mainimg" loading='lazy' style={{ opacity: loading ? 0.5 : 1, transition: "opacity 0.3s ease-in-out" }} />
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
                      loading='lazy'
                    />
                  </div>
                })
              }
            </div>

          </div>

          <div className="details">
            <p className='fs-4 text-secondary mb-1'>Techify</p>
            <h4 className="fs-3 text-primary-emphasis">{loading ? <Skeleton /> : product.title}</h4>
            <h2 className='fs-2 text-primary'>₹{loading ? <Skeleton  /> : product.price}</h2>
            <p className="ratings mb-1 text-primary" style={{ marginLeft: "2rem" }}>
              {Array.from({ length: 5 }, (_, index) => (
                <span key={index}>
                  <i className={`fa-solid fa-star fs-5 ${index < product.averageRating ? 'text-warning' : 'text-secondary'}`}></i>
                </span>
              ))}
            </p>
            <p className='mb-1 fs-4 text-danger'>{product.stock < 50 ? `${product.stock} Left` : ""} </p>

            <p className='fs-5 mb-3 text-primary-emphasis'>{product.description}</p>
            <div className="specification">
              <h4>Specifications :</h4>
              {
                product?.specification && Object.keys(product.specification).map(key => (
                  <div className='mb-2 d-flex' key={key}><p className='fs-5 mb-2 text-secondary'>{key}</p> : <p className='fs-5 ms-3 mb-2 text-primary-emphasis'>{product.specification[key]}</p></div>
                ))
              }
            </div>

            <div className="order w-100">
              <Button variant="primary" onClick={handleAddToCart} className="fs-5 add-cart-btn"><span className='me-2'><i className="fa-solid fa-cart-shopping"></i></span>Add To Cart</Button>

              <Link to="/order/buy-now" state={{ productIds: [product._id] }} className='btn btn-warning buy-now-btn fs-5'><span className='me-2'><i className="fa-solid fa-fire-flame-curved"></i></span>Buy Now</Link>
            </div>
          </div>
        </div>
      </section>

      <Review productId={product._id} />


    </>
  )
}

export default ProShow
