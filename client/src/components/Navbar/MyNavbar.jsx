import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../Store/Auth';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import NavDropdown from 'react-bootstrap/NavDropdown';
import '../../App.css'

function MyNavbar() {
  const expandValue = ['sm', 'md', 'lg', 'xl', 'xxl'][3];

  const { isLoggedInuser, user } = useAuth();

  const [showOffCanvas, setShowOffCanvas] = useState(false);

  const handleCloseOffCanvas = () => setShowOffCanvas(false);
  const handleShowOffCanvas = () => setShowOffCanvas(true);



  return (
    <>
      <Navbar
        sticky='top'
        key={expandValue}
        expand={expandValue}
        className="p-2"
        style={{ backgroundColor: 'hsl(210, 56%, 93%)' }}
      >
        <Container fluid>
          <Navbar.Brand className="fs-1 text-primary d-flex justify-content-center align-items-center">
            <Link to="/" style={{ textDecoration: "none", marginRight: "1rem" }}>Techify</Link>
          </Navbar.Brand>

          <Navbar.Toggle
            className={`text-primary border-primary`}
            onClick={handleShowOffCanvas}
            aria-controls={`offcanvasNavbar-expand-${expandValue}`}
          >
            <i className="fa-solid fa-bars"></i>
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
                Techify
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
                    className='fs-5 text-primary'
                    onClick={handleCloseOffCanvas}
                  >
                    Home
                  </Nav.Link>
                </Nav.Item>

                <Nav.Item>
                  <Nav.Link
                    as={NavLink}
                    to="/products/:categoryId"
                    className='fs-5 text-primary'
                    onClick={handleCloseOffCanvas}
                  >
                    Product
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    as={NavLink}
                    to="/cart"
                    className='fs-5 text-primary'
                    onClick={handleCloseOffCanvas}
                  >
                    Cart
                    {user && user?.cart?.length > 0 && (
                      <Badge pill bg="primary" className="ms-2">
                        {user.cart.length || 0}
                      </Badge>
                    )}
                  </Nav.Link>
                </Nav.Item>

                {(user?.role === 'Admin' || user?.role === 'Moderator') && (
                  <NavDropdown
                    title={<span className="text-primary">Dashboard</span>}
                    id="admin-dashboard-dropdown"
                    className='fs-5 text-primary'
                  >
                    <NavDropdown.Item className='text-primary m-2 fs-5 bg-white' onClick={handleCloseOffCanvas} href="/admin">Manage Order</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item className='text-primary m-2 fs-5 bg-white' onClick={handleCloseOffCanvas} href="/admin/users">Manage User</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item className='text-primary m-2 fs-5 bg-white' onClick={handleCloseOffCanvas} href="/admin/reviews">Manage Review</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item className='text-primary m-2 fs-5 bg-white' onClick={handleCloseOffCanvas} href="/admin/add/product">Add Products</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item className='text-primary m-2 fs-5 bg-white' onClick={handleCloseOffCanvas} href="/admin/add/category">Add Category</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item className='text-primary m-2 fs-5 bg-white' onClick={handleCloseOffCanvas} href="/admin/add/brand">Add Brand</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item className='text-primary m-2 fs-5 bg-white' onClick={handleCloseOffCanvas} href="/admin/add/testimonial">Add Testimonials</NavDropdown.Item>
                    
                  </NavDropdown>
                )}

                <Nav.Item>
                  <Nav.Link
                    as={NavLink}
                    to="/account"
                    className='fs-5 text-primary'
                    onClick={handleCloseOffCanvas}
                  >
                    Account
                  </Nav.Link>
                </Nav.Item>

                {isLoggedInuser ? (
                  <Nav.Item>
                    <Nav.Link
                      as={NavLink}
                      to="/signout"
                      className='fs-5 text-primary'
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
                        className='fs-5 text-primary'
                        onClick={handleCloseOffCanvas}
                      >
                        Signin
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        as={NavLink}
                        to="/signup"
                        className='fs-5 text-primary'
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
