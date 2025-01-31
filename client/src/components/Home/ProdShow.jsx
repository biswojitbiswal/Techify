import React, { useEffect, useState } from 'react'
import './Home.css'
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { useAuth } from '../../Store/Auth';
import { BASE_URL } from '../../../config';

function ProdShow() {
    const [products, setProducts] = useState([]);

    const {darkMode} = useAuth();

    const getSomeProduct = async() => {
        try {
            const response = await fetch(`${BASE_URL}/api/yoga/products/showcase`, {
                method: "GET",
            })

            const data = await response.json();
            // console.log(data);

            if(response.ok){
                setProducts(data.showcase);
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getSomeProduct();
    })
    return (
        <>
            <section className="showcase-prod">
                <h2 className={`fs-1 ${darkMode ? "text-white" : "text-black"}`}>Trending Now</h2>
                <div className="prod-carousel">
                    {
                        products.length > 0 ? 
                        products.map(product => (
                            <Card key={product._id} style={{ width: '20rem', flex: '0 0 auto', margin: '0.5rem', backgroundColor: darkMode ? "#000000" : "#ffffff"}}>
                                <Card.Img variant="top" src={product.images[0]} alt={product.title} style={{height: "70%"}} />
                                <Card.Body>
                                    <Card.Title style={{color: darkMode ? "#fff" : "#000"}}>{product.title}</Card.Title>
                                    <Link to={`/product/${product._id}`} className='btn btn-primary'>Shop Now</Link>
                                </Card.Body>
                            </Card>
                        )) 
                        : <p>No products available.</p>
                    }
                </div>
            </section>

        </>
    )
}

export default ProdShow
