import React from 'react'
import { Link } from 'react-router-dom'
import './Error.css'

function Error() {
  return (
    <>
      <section id="error-page">
        <h2 className='fs-2 text-primary'> Page Not Found!</h2>
        <h1 className='fs-1 text-primary'>404!</h1>
        <Link to="/home" className='btn btn-primary'>Go Back To Home</Link>

      </section>
    </>
  )
}

export default Error
