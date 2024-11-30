import React from 'react'
import './Review.css';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useAuth } from '../../Store/Auth';
import { toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom'

function Review(product) {
    const [show, setShow] = useState(false);
    const [review, setReview] = useState({
        rating: 0,
        comment: '',
    });

    const {authorization} = useAuth();
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

    const handleSubmit = async() => {
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

            if(response.ok){
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
                        <h2>All Reviews</h2>
                        <Button variant="primary" onClick={handleShow} className='fs-4'>
                            Write A Review
                        </Button>

                        <Modal
                            show={show}
                            onHide={handleClose}
                            backdrop="static"
                            keyboard={false}
                        >
                            <Modal.Header closeButton>
                                <Modal.Title>Review Our Product</Modal.Title>
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
                                                        color: star <= (hover) ? "#fea507" : "#e4e5e9",
                                                
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
                </div>
            </section>
        </>
    )
}

export default Review
