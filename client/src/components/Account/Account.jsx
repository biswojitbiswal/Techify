import React from 'react'
import { useAuth } from '../../Store/Auth'
import './Account.css'
import { Link } from 'react-router-dom'

function Account() {
  const { darkMode, user } = useAuth();
  return (
    <>
      <section id='account-page' style={{ backgroundColor: darkMode ? '#000' : '#fff' }}>
        <div className="account-container">
          <div className="user-info">
            <h2 className='ms-2 text-primary fs-3'><span className='fs-5 text-secondary'>Welcome </span>{user.name}</h2>

            <hr className='text-primary' />
            <p className='text-primary'><span><i className="fa-solid fa-envelope text-secondary me-2"></i></span>{user.email}</p>
            <p className='text-primary'><span><i className="fa-solid fa-phone text-secondary me-2"></i></span>{user.phone}</p>
          </div>
          <div className="account-box-container">

            <Link className='acc-box fs-4 fw-semibold m-0 p-0 text-decoration-none text-black'><span><i className="fa-solid fa-user text-primary me-2"></i></span> Profile</Link>


            <Link to="/account/myorders" className='acc-box fs-4 fw-semibold m-0 p-0 text-decoration-none text-black'><span><i className="fa-solid fa-gift text-primary me-2"></i></span>Orders</Link>

            <Link to="/account/address" className='acc-box fs-4 fw-semibold m-0 p-0 text-decoration-none text-black'><span><i className="fa-solid fa-location-dot text-primary me-2"></i></span>Address</Link>

            <Link to="/account/recently-view" className='acc-box fs-4 fw-semibold m-0 p-0 text-decoration-none text-black'><span><i className="fa-solid fa-eye text-primary me-2"></i></span> Recently</Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default Account
