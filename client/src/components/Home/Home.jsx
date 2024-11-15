import React from 'react'
import './Home.css'
import { Link } from 'react-router-dom'


function Home() {

  return (
    <>
      <section id="home_section">
        {/* <div className="home_container"> */}

          <div className="home_content">
            <div className="home_social">
              <Link
                href="https://www.instagram.com"
                target="_blank"
                className="home_social-icon"
              >
                <i className="fa-brands fa-instagram"></i>
              </Link>

              <Link
                href="https://www.facebook.com"
                target="_blank"
                className="home_social-icon"
              >
                <i className="fa-brands fa-facebook"></i>
              </Link>

              <Link
                href="https://www.twitter.com"
                target="_blank"
                className="home_social-icon"
              >
                <i className="fa-brands fa-x-twitter"></i>
              </Link>
            </div>
            <div className="home_img">
              <svg viewBox="0 0 200 200" className="home_blob" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="#0d6efd" // Adjust the color to your preference (F1C21B is another option)
                  d="M46.6,-69.8C56.3,-57,57.5,-38,63.1,-20.5C68.7,-3.1,78.8,12.9,76.3,26.2C73.9,39.4,58.9,50,44.1,55.2C29.3,60.4,14.7,60.3,1.3,58.5C-12.1,56.8,-24.3,53.5,-36.5,47.4C-48.8,41.4,-61.1,32.6,-69.4,19.6C-77.7,6.6,-82,-10.7,-75.9,-23.2C-69.9,-35.8,-53.6,-43.5,-39.2,-54.8C-24.8,-66.2,-12.4,-81.1,3,-85.2C18.4,-89.3,36.8,-82.6,46.6,-69.8Z"
                  transform="translate(100 100)"
                />
                <image
                  className="home_blob-img"
                  href="/Hero.png" // Ensure this image path is correct in your public directory
                  
                />
              </svg>
            </div>
          </div>

          <div className="home_data">
            <h1>Smart Yoga</h1>
            <h3 className="text-primary fs-2">Breathe | Flow | Transform</h3>
            <p className="fs-4">
              Achieve mindfulness, improve flexibility, and boost your energy with our carefully curated yoga products. Start your wellness journey today and experience the difference!
            </p>
            <Link href="/product" className='btn btn-primary fs-4'>
                Shop Now <i class="uil uil-message button_icon"></i>
            </Link>
          </div>

        {/* </div> */}
      </section>
    </>
  )
}

export default Home
