import React from 'react'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import {Link} from 'react-router-dom'
import { useAuth } from '../../Store/Auth';



function MyNavbar() {

  const expandValue = ['sm', 'md', 'lg', 'xl', 'xxl'][3];

  const {isLoggedInuser} = useAuth();

  return (
    <>
      <Navbar key={expandValue} expand={expandValue} className="p-2" style={{backgroundColor: "hsl(210, 56%, 93%)"}}>
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className='fs-1 text-primary'>Yoga</Navbar.Brand>
        <Navbar.Toggle className='text-primary' aria-controls={`offcanvasNavbar-expand-${expandValue}`} />
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-${expandValue}`}
          aria-labelledby={`offcanvasNavbarLabel-expand-${expandValue}`}
          placement="end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expandValue}`} className='text-primary fs-2'>
              Smart Yoga
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3">
            <Nav.Item>
              <Nav.Link as={Link} to="/" className='me-3 fs-4 text-primary'>Home</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/product" className='me-3 fs-4 text-primary'>Product</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/blog" className='me-3 fs-4 text-primary'>Blog</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/social" className='me-3 fs-4 text-primary'>Social</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/cart" className='me-3 fs-4 text-primary'>Cart</Nav.Link>
            </Nav.Item>
            {
              isLoggedInuser ? 
              <Nav.Item>
              <Nav.Link as={Link} to="/signout" className='me-3 fs-4 text-primary'>Signout</Nav.Link>
              </Nav.Item> :

              <>
                <Nav.Item>
              <Nav.Link as={Link} to="/signin" className='me-3 fs-4 text-primary'>Signin</Nav.Link>
              </Nav.Item>

              <Nav.Item>
              <Nav.Link as={Link} to="/signup" className='me-3 fs-4 text-primary'>Signup</Nav.Link>
              </Nav.Item>

              </>
            }
            
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>

    </>
    
  )
}

export default MyNavbar;
