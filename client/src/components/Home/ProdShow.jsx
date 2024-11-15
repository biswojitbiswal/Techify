import React from 'react'
import './Home.css'
import Carousel from 'react-bootstrap/Carousel';

function ProdShow() {
    return (
        <>
            <section className="showcase-prod">
                <Carousel className='carousel' data-bs-theme="dark">
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="/Mat.png"
                            alt="First slide"
                        />
                        <Carousel.Caption>
                            <h5>Yoga Wheel for Deep Stretching</h5>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="/Blockset.png"
                            alt="Second slide"
                        />
                        <Carousel.Caption>
                            <h5>Dual-Pack Eco-Friendly Yoga Block Set</h5>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="/Cushion.png"
                            alt="Third slide"
                        />
                        <Carousel.Caption>
                            <h5>Adjustable Meditation Cushion</h5>
                            
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="/Socks.png"
                            alt="Third slide"
                        />
                        <Carousel.Caption>
                            <h5>Bamboo Yoga Mat Bag</h5>
                            
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
            </section>
            
        </>
    )
}

export default ProdShow
