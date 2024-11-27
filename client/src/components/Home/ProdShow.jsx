import React from 'react'
import './Home.css'
import { useStore } from '../../Store/ProductStore'
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { useAuth } from '../../Store/Auth';

function ProdShow() {
    const {darkMode} = useAuth();
    const { products } = useStore();
    return (
        <>
            <section className="showcase-prod">
                <h2 className={`fs-1 ${darkMode ? "text-white" : "text-black"}`}>Trending Now</h2>
                <div className="prod-carousel" style={{backgroundColor: darkMode ? '#343434' : '#e3edf7'}}>
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
