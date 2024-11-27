import React from 'react'
import { useAuth } from '../Store/Auth'

function AdminHome() {
  const {darkMode} = useAuth();
  return (
    <>
      <section className='d-flex flex-column justify-content-center align-items-center p-2' style={{height: "80vh", textAlign: "center"}}>
        <h1 className={`${darkMode ? 'text-white' : 'text-black'}`}>Admin Dashboard Page</h1>
        <p className='text-primary fs-3'>Dashboard Feature Will Be Available Very Soon</p>
      </section>
    </>
  )
}

export default AdminHome

