import React, { useEffect } from 'react'
import './Review.css';
import { useState } from 'react';
import { useAuth } from '../../Store/Auth';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../../config.js';
import { Spinner, Button, Modal, Form } from 'react-bootstrap';



function Review({ productId }) {
    const [show, setShow] = useState(false);
    const [hover, setHover] = useState(null);
    const [loading, setLoading] = useState(false);
    const [allReviews, setAllReviews] = useState([]);
    const [review, setReview] = useState({
        rating: 0,
        comment: '',
    });

    const { authorization } = useAuth();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleRating = (star) => {
        setReview((prevState) => ({
            ...prevState,
            rating: star
        }))
    };

    const handleReview = (e) => {
        setReview((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    const getAllReviews = async () => {
        
        if (!productId) return;
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/api/techify/review/get-all/${productId}`, {
                method: "GET",
            })

            const data = await response.json();
            console.log(data);

            if (response.ok) {
                setAllReviews(data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/techify/review/add/${productId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authorization,
                },
                body: JSON.stringify(review)
            })

            const data = await response.json();
            console.log(data);

            if (response.ok) {
                toast.success("Review Added");
                setReview({
                    rating: 0,
                    comment: '',
                })
                handleClose()
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (productId) {
            getAllReviews(); // Fetch reviews as soon as productId is available
        }
    }, [productId]);

    return (
        <>
            <section id="prod-review-page">
                <div>
                    <div className="d-flex w-100 justify-content-between">
                        <h2 className='m-0 d-flex justify-content-center align-items-center fs-3'>All Reviews</h2>

                        <Button variant="primary" onClick={handleShow} className='review-btn'>
                            Add Review
                        </Button>

                        <Modal
                            show={show}
                            onHide={handleClose}
                            backdrop="static"
                            keyboard={false}
                        >
                            <Modal.Header closeButton>
                                <Modal.Title>Write A Review</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Rating</Form.Label>
                                        <div className="star-rating">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <i
                                                    key={star}
                                                    className="fa-solid fa-star fs-2"
                                                    style={{
                                                        cursor: 'pointer',
                                                        marginRight: '5px',
                                                        color: star <= (hover || review.rating) ? "#fea507" : "#e4e5e9", // Check hover first, then rating
                                                    }}
                                                    onClick={() => handleRating(star)}
                                                    onMouseEnter={() => setHover(star)}
                                                    onMouseLeave={() => setHover(null)}
                                                ></i>
                                            ))}
                                        </div>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Review</Form.Label>
                                        <Form.Control as="textarea" name='comment' value={review.comment} onChange={handleReview} rows={5} placeholder="Write your review here..." />
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>
                                <Button variant="primary" onClick={handleSubmit}>Submit</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                    <hr />
                    <div className="review-car-contaner">
                        {
                            loading ? <Spinner size='lg' variant='primary' /> : allReviews?.filter((review) => review.status === 'Approved').map((review) => {
                                return (
                                    <div key={review._id} className="review-card px-2">
                                        <p className='fs-4 text-primary-emphasis mb-2'>{review.comment}</p>
                                        <p className='mb-0'>
                                            {Array.from({ length: 5 }, (_, index) => (
                                                <span key={index}>
                                                    <i className={`fa-solid fa-star fs-5 ${index < review.rating ? 'text-warning' : 'text-secondary'}`}></i>
                                                </span>
                                            ))}
                                        </p>
                                        <p className='mb-0'><span className="fs-3">&rarr;</span>{review.reviewBy.name}</p>
                                        <p className='mb-2'>{new Date(review.createdAt).toDateString()}</p>
                                        <hr />
                                    </div>
                                )
                            })
                        }


                    </div>
                </div>
            </section>
        </>
    )
}

export default Review
