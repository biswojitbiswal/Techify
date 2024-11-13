import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './Product.css'
import {Link, useNavigate} from 'react-router-dom'
import { useAuth } from '../../Store/Auth';
import { useStore } from '../../Store/ProductStore';

function Product() {
  
  const {products} = useStore();
  const {user} = useAuth();
  const navigate = useNavigate();


  return (
    <>
      <section id="product-page">

        <div className="card-container mt-4 d-flex flex-wrap gap-5 justify-content-center">
          {
            products.map((product, index) => {
              return <Card key={index}
              onClick={() => navigate(`/product/${product._id}`)} style={{ width: '25rem', backgroundColor: '#e3edf7', borderRadius: "1rem" }} className='p-2'>
                <Card.Img variant="top" style={{ height: '300px', objectFit: 'cover', borderRadius: '0.5rem' }} src={product.image} />
                <Card.Body style={{ height: "50%" }}>
                  <Card.Title>{product.title}</Card.Title>
                  <Card.Text style={{ minHeight: "70px" }}>{product.description}</Card.Text>
                  <Card.Title>&#8377;{product.price}</Card.Title>
                  {
                    user.isAdmin ? (
                      <>
                        <Link to={`/admin/edit/${product._id}`}>
                          <Button variant="primary" className='me-3 fs-5' 
                          onClick={(event) => {
                            event.stopPropagation()
                            event.preventDefault()
                            navigate(`/admin/edit/${product._id}`)
                          }}>
                            Edit <span><i className="fa-solid fa-pencil"></i></span>
                          </Button>
                        </Link>
                        <Button variant="danger" className='me-3 fs-5' onClick={(event) => event.stopPropagation()}>Delete<span><i className="fa-solid fa-trash"></i></span></Button>
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
