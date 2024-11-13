import React from 'react'
import Button from 'react-bootstrap/Button';
import './Home.css'


function Home() {

  return (
    <>
      <section id='home-container'>
        <div className="home-description">
          <h2>Smart Yoga</h2>
          <div className='home-slogan'>
            <span className="line1">Yoga For New</span>
            <br />
            <span className="line2">Body Energy</span>
          </div>
          <Button className="btn btn-primary fs-3">Shop Now<span><i className="fa-solid fa-arrow-right"></i></span></Button>
        </div>
        {/* <div className="image-showcase">
          
        </div> */}
      </section>
    </>
  )
}

export default Home
