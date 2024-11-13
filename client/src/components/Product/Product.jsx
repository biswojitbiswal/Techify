import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './Product.css'
import { useAuth } from '../../Store/Auth';
import {Link, useNavigate} from 'react-router-dom'

function Product() {
  const [products, setProducts] = useState([]);

  const { authorization, user } = useAuth();
  const navigate = useNavigate();

  const getAllProductListing = async (e) => {
    try {
      const response = await fetch(`http://localhost:5000/api/yoga/products/get`, {
        method: "GET",
        headers: {
          Authorization: authorization
        }
      })

      const data = await response.json();
      // console.log(data.products);
      // console.log(user);

      if (response.ok) {
        setProducts(data.products);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllProductListing();
  }, [])

  return (
    <>
      <section id="product-page">
        <Card className="bg-dark text-white custom-hero-card">
          <Card.Img src="/ProductImg.jpg" alt="Card image" className='custom-hero-card-image' />
          <Card.ImgOverlay>
            <Card.Title className='fs-2 text-primary text-center'>Cushion Your Practice, Inspire Your Soul</Card.Title>
            <Card.Text className='fs-4 text-primary text-center'>
              Enhance Every Pose with Comfort and Stability. Discover the Perfect Support for Your Yoga Journey. Embrace Balance, Ease, and Mindful Movement in Every Breath.
            </Card.Text>
          </Card.ImgOverlay>
        </Card>

        <div className="card-container mt-4 d-flex flex-wrap gap-5 justify-content-center">
          {
            products.map((product, index) => {
              return <Card key={index}
              onClick={() => navigate(`/product/${product._id}`)} style={{ width: '25rem', backgroundColor: '#e3edf7', borderRadius: "1rem" }} key={index} className='p-2'>
                <Card.Img variant="top" style={{ height: '300px', objectFit: 'cover', borderRadius: '0.5rem' }} src={product.image} />
                <Card.Body style={{ height: "50%" }}>
                  <Card.Title>{product.title}</Card.Title>
                  <Card.Text style={{ minHeight: "70px" }}>{product.description}</Card.Text>
                  <Card.Title>&#8377;{product.price}</Card.Title>
                  {
                    user.isAdmin ? (
                      <>
                        <Link to={`/admin/edit/${product._id}`}>
                          <Button variant="primary" className='me-3 fs-5'>
                            Edit <span><i className="fa-solid fa-pencil"></i></span>
                          </Button>
                        </Link>
                        <Button variant="danger" className='me-3 fs-5'>Delete<span><i className="fa-solid fa-trash"></i></span></Button>
                      </>
                    ) : null
                  }
                </Card.Body>
              </Card>
            })
          }
        </div>
      </section>
    </>
  )
}

export default Product
