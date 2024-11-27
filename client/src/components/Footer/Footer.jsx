import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'
import { useAuth } from '../../Store/Auth';

function Footer() {
  const {darkMode} = useAuth();
  return (
    <>
      <footer id='footer-page' style={{backgroundColor: darkMode ? '#343434' : '#e9ecef'}}>
      <div className="footer-social-links">
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
          <p className={`${darkMode ? 'text-white' : 'text-black'}`}>&copy; 2024 Smart Yoga. All Rights Reserved.</p>
          <p className={`${darkMode ? 'text-white' : 'text-black'}`}>Designed & Developed By <strong className='text-primary'>Biswojit</strong></p>
      </footer>
    </>
  )
}

export default Footer
