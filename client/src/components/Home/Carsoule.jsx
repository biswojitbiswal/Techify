import React from 'react'
import Carousel from 'react-bootstrap/Carousel';
import Banner1 from '/HeadBanner.jpg'
import Banner2 from '/LaptopBanner.png'
import Banner3 from '/SmartWatchBannerB.jpg'
import Banner4 from '/EarBanner.jpeg'
import Banner5 from '/SmartWatchBanner.jpg'

function Carsoule() {
  return (
    <div className='text-center mt-3'>
      <h1 className=''>Discover Quality & Style – Shop the Best Products Today!</h1>
      <p className='fs-4 text-secondary mb-0'>This Component Only For UI</p>
      <Carousel data-bs-theme="dark" style={{ height: "600px", objectFit: "contain" }}>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={Banner1}
            alt="First slide"
          />
          <Carousel.Caption>
            <h5>First slide label</h5>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src={Banner2}
            alt="Second slide"
          />
          <Carousel.Caption>
            <h5>Second slide label</h5>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src={Banner3}
            alt="Third slide"
          />
          <Carousel.Caption>
            <h5>Third slide label</h5>
            <p>
              Praesent commodo cursus magna, vel scelerisque nisl consectetur.
            </p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src={Banner4}
            alt="Fourth slide"
          />
          <Carousel.Caption>
            <h5>Fourth slide label</h5>
            <p>
              Praesent commodo cursus magna, vel scelerisque nisl consectetur.
            </p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src={Banner5}
            alt="Fifth slide"
          />
          <Carousel.Caption>
            <h5>Fifth slide label</h5>
            <p>
              Praesent commodo cursus magna, vel scelerisque nisl consectetur.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  )
}

export default Carsoule
