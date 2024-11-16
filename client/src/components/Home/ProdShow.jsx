import React from 'react'
import './Home.css'
import { useStore } from '../../Store/ProductStore'
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

function ProdShow() {
    const { products } = useStore();
    return (
        <>
            <section className="showcase-prod">
                <h2 className='fs-1'>Trending Now</h2>
                <div className="prod-carousel">
                    {
                        products.length > 0 ? 
                        products.map(product => (
                            <Card key={product._id} style={{ width: '20rem', flex: '0 0 auto', margin: '0.5rem'}}>
                                <Card.Img variant="top" src={product.image} alt={product.title} style={{height: "70%"}} />
                                <Card.Body>
                                    <Card.Title>{product.title}</Card.Title>
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
