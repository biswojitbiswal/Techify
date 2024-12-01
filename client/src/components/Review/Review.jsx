import React from 'react'
import './Review.css';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useAuth } from '../../Store/Auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'

function Review(product) {
    const [show, setShow] = useState(false);
    const [review, setReview] = useState({
        rating: 0,
        comment: '',
    });

    const { authorization } = useAuth();
    const navigate = useNavigate();

    const [hover, setHover] = useState(null);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleRating = (star) => {
        setReview((prevState) => ({
            ...prevState,
            rating: star
        }))
        // console.log(product.product._id);
    };

    const handleReview = (e) => {
        setReview((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async () => {
        try {
            const response = await fetch(`https://yoga-api-five.vercel.app/api/yoga/review/add/${product.product._id}`, {
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
                navigate(`/product/${product.product._id}`)
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <section id="prod-review-page">
                <div className='review-container'>
                    <div className="review-form-container d-flex justify-content-between">
                        <h2 className='m-0 d-flex justify-content-center'>All Reviews <span><p style={{ borderRadius: ".75rem", fontSize: "1.25rem" }} className='btn btn-success ms-2'>{product.product.averageRating.toFixed(1)} <span><i className="fa-solid fa-star fs-5"></i></span></p></span></h2>
                        <Button variant="primary" onClick={handleShow} className='fs-4'>
                            Rate Product
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
                            product?.product?.reviews.map((review) => {
                                return <div key={review._id} className="review-card px-2">

                                    <p><span className="btn btn-success me-4 p-1" style={{ borderRadius: ".75rem", fontSize: "1rem" }}>{review.rating}<i className="fa-solid fa-star ms-1"></i></span>
                                        <span className='fs-4'>{review.comment}</span>
                                    </p>
                                    <p><span className='fs-3'>&rarr;</span>{review.reviewBy.name}</p>
                                    <p>{new Date(review.createdAt).toDateString()}</p>
                                    <hr />
                                </div>
                            })
                        }


                    </div>
                </div>
            </section>
        </>
    )
}

export default Review
