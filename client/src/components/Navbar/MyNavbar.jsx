import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../Store/Auth';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';

function MyNavbar() {
  const expandValue = ['sm', 'md', 'lg', 'xl', 'xxl'][3];

  const { isLoggedInuser, user, darkMode, handleDarkMode } = useAuth();

  const [showOffCanvas, setShowOffCanvas] = useState(false);

  const handleCloseOffCanvas = () => setShowOffCanvas(false);
  const handleShowOffCanvas = () => setShowOffCanvas(true);

  

  return (
    <>
      <Navbar
        key={expandValue}
        expand={expandValue}
        className="p-2"
        style={{ backgroundColor: darkMode ? "#343434" : 'hsl(210, 56%, 93%)' }}
      >
        <Container fluid>
          <Navbar.Brand className="fs-1 text-primary d-flex justify-content-center align-items-center">
            <Link to="/" style={{textDecoration: "none", marginRight: "1rem"}}>Yoga</Link>
            <Nav.Item className='fs-2' onClick={handleDarkMode}>
                {
                  darkMode ? <i className="uil uil-sun text-warning"></i> : <i className="uil uil-moon"></i>
                }

          </Nav.Item>
          </Navbar.Brand>
          
          <Navbar.Toggle
            className={`text-primary border-primary`}
            onClick={handleShowOffCanvas}
            aria-controls={`offcanvasNavbar-expand-${expandValue}`}
          >
            <i class="fa-solid fa-bars"></i>
          </Navbar.Toggle>
          <Navbar.Offcanvas
            show={showOffCanvas}
            onHide={handleCloseOffCanvas}
            id={`offcanvasNavbar-expand-${expandValue}`}
            aria-labelledby={`offcanvasNavbarLabel-expand-${expandValue}`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title
                id={`offcanvasNavbarLabel-expand-${expandValue}`}
                className="text-primary fs-2"
              >
                Smart Yoga
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav
                className="justify-content-end flex-grow-1 pe-3"
                variant="underline"
                defaultActiveKey="/"
              >
                <Nav.Item>
                  <Nav.Link
                    as={NavLink}
                    to="/"
                    eventKey="link-1"
                    className="me-3 fs-4 text-primary"
                    onClick={handleCloseOffCanvas}
                  >
                    Home
                  </Nav.Link>
                </Nav.Item>

                <Nav.Item>
                  <Nav.Link
                    as={NavLink}
                    to="/product"
                    eventKey="link-2"
                    className="me-3 fs-4 text-primary"
                    onClick={handleCloseOffCanvas}
                  >
                    Product
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    as={NavLink}
                    to="/blog"
                    eventKey="link-3"
                    className="me-3 fs-4 text-primary"
                    onClick={handleCloseOffCanvas}
                  >
                    Blog
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    as={NavLink}
                    to="/cart"
                    eventKey="link-4"
                    className="me-3 fs-4 text-primary"
                    onClick={handleCloseOffCanvas}
                  >
                    Cart
                    {user && user.cart.length > 0 && (
                      <Badge pill bg="primary" className="ms-2">
                        {user.cart.length || 0}
                      </Badge>
                    )}
                  </Nav.Link>
                </Nav.Item>
                {user?.isAdmin && (
                  <Nav.Item>
                    <Nav.Link
                      as={NavLink}
                      to="/admin"
                      eventKey="link-5"
                      className="me-3 fs-4 text-primary"
                      onClick={handleCloseOffCanvas}
                    >
                      Dashboard
                    </Nav.Link>
                  </Nav.Item>
                )}
                {isLoggedInuser ? (
                  <Nav.Item>
                    <Nav.Link
                      as={NavLink}
                      to="/signout"
                      eventKey="link-6"
                      className="me-3 fs-4 text-primary"
                      onClick={handleCloseOffCanvas}
                    >
                      Signout
                    </Nav.Link>
                  </Nav.Item>
                ) : (
                  <>
                    <Nav.Item>
                      <Nav.Link
                        as={NavLink}
                        to="/signin"
                        eventKey="link-7"
                        className="me-3 fs-4 text-primary"
                        onClick={handleCloseOffCanvas}
                      >
                        Signin
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        as={NavLink}
                        to="/signup"
                        eventKey="link-8"
                        className="me-3 fs-4 text-primary"
                        onClick={handleCloseOffCanvas}
                      >
                        Signup
                      </Nav.Link>
                    </Nav.Item>
                  </>
                )}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}

export default MyNavbar;
