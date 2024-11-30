import React, { useState } from 'react'
import Nav from 'react-bootstrap/Nav';
import { NavLink, Link } from 'react-router-dom'
import { Outlet } from 'react-router-dom';
import { useAuth } from '../Store/Auth';
import Spinner from 'react-bootstrap/Spinner';
import { Navigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import './Admin.css'


function AdminLayout() {
    const expandValue = ['sm', 'md', 'lg', 'xl', 'xxl'][3];


    const [showOffCanvas, setShowOffCanvas] = useState(false);

    const handleCloseOffCanvas = () => setShowOffCanvas(false);
    const handleShowOffCanvas = () => setShowOffCanvas(true);

    const { user, isLoading, darkMode } = useAuth()

    if (isLoading) {
        return <Spinner animation="border" />;
    }

    if (!user || (user.role !== 'Admin' && user.role !== 'Moderator')) {
        return <Navigate to="/admin" replace />
    }

    return (
        <>
            <Navbar
                key={expandValue}
                expand={expandValue}
                className="p-2"
                style={{ backgroundColor: darkMode ? "#6f6f6f" : '#f1f1f1' }}
            >
                <Container fluid>
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
                        placement="start"
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
                            <Nav variant="underline"
                                className="justify-content-start flex-grow-1 pe-3"
                            >
                                <Nav.Item>
                                    <Nav.Link
                                        as={NavLink}
                                        to="/admin"
                                        // eventKey="link-1"
                                        className="me-3 fs-4 text-center"
                                        onClick={handleCloseOffCanvas}
                                    >
                                        Dashboard
                                    </Nav.Link>
                                </Nav.Item>

                                <Nav.Item>
                                    <Nav.Link
                                        as={NavLink}
                                        to="/admin/users"
                                        // eventKey="link-2"
                                        className="me-3 fs-4"
                                        onClick={handleCloseOffCanvas}
                                    >
                                        Users
                                    </Nav.Link>
                                </Nav.Item>

                                {
                                    user?.role === 'Admin' ? <Nav.Item>
                                        <Nav.Link
                                            as={NavLink}
                                            to="/admin/add/product"
                                            // eventKey="link-3"
                                            className="me-3 fs-4"
                                            onClick={handleCloseOffCanvas}
                                        >
                                            Add Product
                                        </Nav.Link>
                                    </Nav.Item> : ""
                                }

                                <Nav.Item>
                                    <Nav.Link
                                        as={NavLink}
                                        to="/admin/add/publish"
                                        // eventKey="link-4"
                                        className="me-3 fs-4"
                                        onClick={handleCloseOffCanvas}
                                    >
                                        Publish
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link
                                        as={NavLink}
                                        to="/admin/add/links"
                                        // eventKey="link-5"
                                        className="me-3 fs-4"
                                        onClick={handleCloseOffCanvas}
                                    >
                                        Links
                                    </Nav.Link>
                                </Nav.Item>

                            </Nav>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>

            <Outlet />
        </>
    )
}

export default AdminLayout
