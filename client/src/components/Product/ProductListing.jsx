import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Store/Auth';
import { BASE_URL } from '../../../config';

function ProductListing({ products }) {

    const { user, authorization } = useAuth();
    const navigate = useNavigate();

    const handleProductClick = async (productId) => {
        // console.log(productId)
        if (!user) {
            navigate(`/product/${productId}`);
            return;
        }
    
        try {
            const res = await fetch(`${BASE_URL}/api/techify/products/recently-viewed/${productId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authorization, // Assuming user object contains token
                },
            });

            const data = await res.json();
            // console.log(data);
        } catch (error) {
            console.error("Error adding to recently viewed", error);
        }
    
        navigate(`/product/${productId}`);
    };
    
    return (
        <div className="card-container mt-4 d-flex flex-wrap gap-5 justify-content-center">
            {
                products?.map((product) => {
                    return <div key={`${product._id}-${product.title}`} className="outer-card">
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
                            
                            <button onClick={() => handleProductClick(product?._id)} className='cart-btn bg-warning'>Add To Cart</button>
                        </div>
                    </div>
                })
            }
        </div>
    )
}

export default ProductListing
