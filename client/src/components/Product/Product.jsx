import React, { useState, useEffect, useRef } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import './Product.css'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../Store/Auth';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../../config.js';


function Product() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [loading, setLoading] = useState(false);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(6);
  const storedIds = useRef(new Set());


  const { user, authorization, darkMode, refreshUser } = useAuth();
  const navigate = useNavigate();

  const productData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${BASE_URL}/api/techify/products/get?skip=${skip}&limit=${limit}`, {
        method: "GET",
        headers: {
          Authorization: authorization
        }
      })

      const data = await response.json();
      console.log(data);


      if (response.ok) {
        const newProducts = data.Allproducts.filter(product => !storedIds.current.has(product._id));

        if (newProducts.length > 0) {
          newProducts.forEach(product => storedIds.current.add(product._id));

          setProducts(prevProducts => [...prevProducts, ...newProducts]);
        }
        setLoading(false);
      } else {
        toast.error("No More Order Found");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    productData();
  }, [skip])

  let filteredProducts = products?.filter((product) =>
    product?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (sortOrder === 'asc') {
    filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'dsc') {
    filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
  }

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/techify/admin/product/delete/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: authorization
        }
      })

      const data = await response.json();
      // console.log(data);

      if (response.ok) {
        toast.success("Product Removed");
        refreshUser();
        setProducts((prevProducts) => prevProducts.filter(product => product._id !== data.product._id))
      } else {
        toast.error(data.extraDetails ? data.extraDetails : data.message);
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <section id="product-page">
        <InputGroup className="mb-3" style={{ height: "50px" }}>
          <Form.Control
            placeholder="Search Here"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search"
            aria-describedby="basic-addon2"
          />
          <Button variant="primary" className='fs-3' id="button-addon2">
            Search
          </Button>
        </InputGroup>
        <div className="sortBtns">
          <Button onClick={() => setSortOrder('asc')}
            active={sortOrder === 'asc'}
            className='fs-5'>Low &rarr; High</Button>
          <Button
            onClick={() => setSortOrder('dsc')}
            active={sortOrder === 'dsc'}
            className='fs-5'>High &rarr; Low</Button>
        </div>
        <div className="card-container mt-4 d-flex flex-wrap gap-5 justify-content-center">
          {
            filteredProducts?.map((product) => {
              return <div key={product._id} className="outer-card">
                <div className="inner-card">
                  <h5 className='text-primary product-title'>{product.title}</h5>
                  <div className="product-image">
                    <img src={product?.images[0]} alt={product.title} loading='lazy' />
                  </div>
                  <p className='product-description'>{product.description}</p>
                  <h4 className='text-primary'>&#8377;{product.price}</h4>
                  <p className='m-1'>
                    {Array.from({ length: 5 }, (_, index) => (
                      <span key={index}>
                        <i className={`fa-solid fa-star ${index < product.averageRating ? 'text-warning' : 'text-secondary'}`}></i>
                      </span>
                    ))}
                  </p>
                  {
                    user.role === 'Admin' && (
                      <div className='edit-delete-buttons w-100 justify-content-between mb-4'>
                        <Link to={`/admin/edit/${product._id}`} className='product-edit'><i className="fa-solid fa-pencil"></i>
                        </Link>

                        <button variant="danger" className='product-dlt-btn text-danger' onClick={(event) => {
                          event.stopPropagation();
                          handleDelete(product._id)
                        }}><i className="fa-solid fa-trash ms-2"></i></button>
                      </div>
                    )
                  }
                  {
                    user?.role === 'Moderator' && (
                      <Link to={`/admin/edit/${product._id}`} className='product-edit edit-delete-buttons'><i className="fa-solid fa-pencil"></i>
                      </Link>
                    )
                  }
                  <button onClick={() => navigate(`/product/${product?._id}`)} className='cart-btn bg-warning'>Add To Cart</button>
                </div>
              </div>
            })
          }
        </div>
        {filteredProducts.length > 0 ? <Button variant='primary' onClick={() => setSkip((prev) => prev + limit)} className='mt-4'>More</Button> : ""}
      </section>
    </>
  )
}

export default Product
